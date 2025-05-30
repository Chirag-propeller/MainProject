"use client";
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Campaign, Agent } from '../types';
import { ChevronDown, ChevronUp, Settings, Users, Target, Calendar, Upload, Clock, Shield } from 'lucide-react';
import TimezoneDropdown from '@/components/ui/TimezoneDropdown';
import * as Papa from 'papaparse';
import axios from 'axios';

interface CampaignGeneralTabProps {
  campaign: Campaign;
  setCampaign: (campaign: Campaign) => void;
  agents: Agent[];
  isEditable: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

type Contact = {
  phonenumber: string;
  metadata: {
    follow_up_date_time: string,
    [key: string]: any;
  };
};

type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
const weekdays: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children 
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-2 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

const CampaignGeneralTab: React.FC<CampaignGeneralTabProps> = ({ 
  campaign, 
  setCampaign, 
  agents,
  isEditable 
}) => {
  const [openSections, setOpenSections] = useState({
    details: true,
    recipients: false,
    goals: false,
    scheduling: false
  });

  // Use refs to maintain focus
  const goalInputRef = useRef<HTMLTextAreaElement>(null);
  const dataTextareaRef = useRef<HTMLTextAreaElement>(null);
  const mandatoryAdherenceTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload states
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedPhones, setExtractedPhones] = useState<string[]>([]);
  const [contact, setContact] = useState<Contact[]>([]);

  // Add state for phone numbers
  const [fromNumberList, setFromNumberList] = useState<string[]>([]);

  // Scheduling states
  const [selectedDays, setSelectedDays] = useState<Weekday[]>(campaign.slotDates as Weekday[] || []);
  const [callTiming, setCallTiming] = useState<string>('fullDay');
  const [customStartTime, setCustomStartTime] = useState<string>('10:00');
  const [customEndTime, setCustomEndTime] = useState<string>('18:00');

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleInputChange = useCallback((field: keyof Campaign, value: any) => {
    if (!isEditable) return;
    
    // console.log(`🔄 Updating campaign field: ${field}`, value);
    setCampaign({
      ...campaign,
      [field]: value
    });
  }, [campaign, setCampaign, isEditable]);

  // Specialized handlers to maintain cursor position
  const handleGoalChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    handleInputChange('goal', value);
    
    // Restore cursor position after state update
    requestAnimationFrame(() => {
      if (goalInputRef.current) {
        goalInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  }, [handleInputChange]);

  const handleDataCollectChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    const dataArray = value.split('\n').filter(item => item.trim());
    
    handleInputChange('dataToCollect', dataArray);
    
    // Restore cursor position after state update
    requestAnimationFrame(() => {
      if (dataTextareaRef.current) {
        dataTextareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  }, [handleInputChange]);

  const handleMandatoryAdherenceChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    handleInputChange('mandatoryAdherence', value);
    
    // Restore cursor position after state update
    requestAnimationFrame(() => {
      if (mandatoryAdherenceTextareaRef.current) {
        mandatoryAdherenceTextareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  }, [handleInputChange]);

  // File upload functionality
  function transformDynamicData(data: any): { contacts: Contact[] } {
    return {
      contacts: data.map((row: any) => ({
        phonenumber: row.phone || row.phonenumber || Object.values(row)[0],
        metadata: {
          follow_up_date_time: new Date().toISOString(),
          ...row
        }
      }))
    };
  }

  const extractPhoneNumbers = (data: any[]) => {
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\-.\s]{7,13}/g;
    const phoneNumbers: string[] = [];

    data.forEach(row => {
      Object.values(row).forEach(value => {
        const matches = String(value).match(phoneRegex);
        if (matches) {
          matches.forEach(phone => {
            const cleaned = phone.replace(/[^+\d]/g, '');
            if (cleaned.length >= 10) {
              phoneNumbers.push(cleaned);
            }
          });
        }
      });
    });
    return [...new Set(phoneNumbers)];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📁 File selected:', file.name);
      setFileName(file.name);
  
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('📊 CSV parse results:', results.data);
          
          const temp = transformDynamicData(results.data);
          console.log('🔄 Transformed contacts:', temp.contacts);
          
          const phoneNumbers = extractPhoneNumbers(results.data);
          console.log('📞 Extracted phone numbers:', phoneNumbers);
          
          setContact(temp.contacts);
          setExtractedPhones(phoneNumbers);
          
          // Update campaign with both recipients and contacts
          const updatedCampaign = {
            ...campaign,
            recipients: phoneNumbers,
            contacts: temp.contacts  // Add contacts for API
          };
          console.log('💾 Updating campaign with recipients:', updatedCampaign);
          setCampaign(updatedCampaign);
        },
        error: (err) => {
          console.error('❌ Error parsing file:', err);
        }
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      // Trigger the same logic as file select
      const fakeEvent = { target: { files: [file] } } as any;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  // Day selection handler
  const handleDayToggle = (day: Weekday) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    setSelectedDays(newDays);
    handleInputChange('slotDates', newDays);
  };

  // Call timing handler
  const handleCallTimingChange = (timing: string) => {
    setCallTiming(timing);
    let slotTime = timing;
    if (timing === 'custom') {
      slotTime = `${customStartTime}-${customEndTime}`;
    }
    handleInputChange('slotTime', slotTime);
  };

  const agentName = agents.find(a => a.agentId === campaign.agentId)?.agentName || 'No Agent Attached';

  // Fetch phone numbers from API
  const fetchNumbers = async () => {
    try {
      const res = await fetch('/api/phoneNumber/get');
      const data = await res.json();
      const numbers = data.map((item: any) => item.phoneNumber);
      setFromNumberList(numbers);
    } catch (err) {
      console.error('Failed to fetch phone numbers:', err);
    } 
  };

  // Initialize data and fetch phone numbers
  useEffect(() => {
    fetchNumbers();
    
    if (campaign.slotTime) {
      // Parse existing slotTime
      if (campaign.slotTime === 'fullDay' || campaign.slotTime === 'firstHalf' || campaign.slotTime === 'secondHalf') {
        setCallTiming(campaign.slotTime);
      } else if (campaign.slotTime.includes('-')) {
        setCallTiming('custom');
        const [start, end] = campaign.slotTime.split('-');
        setCustomStartTime(start);
        setCustomEndTime(end);
      }
    }
    if (campaign.slotDates) {
      setSelectedDays(campaign.slotDates as Weekday[]);
    }
    
    // Initialize extracted phones from existing recipients if not already extracted
    if (campaign.recipients && campaign.recipients.length > 0 && extractedPhones.length === 0) {
      console.log('📋 Initializing extracted phones from existing recipients:', campaign.recipients);
      setExtractedPhones(campaign.recipients as string[]);
    }
  }, [campaign, extractedPhones.length]);

  return (
    <div className='flex flex-col gap-2'>
      {/* Campaign Details Section */}
      <CollapsibleSection
        title="Campaign Details"
        icon={Settings}
        isOpen={openSections.details}
        onToggle={() => toggleSection('details')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent</label>
              {isEditable ? (
                <select
                  value={campaign.agentId || ''}
                  onChange={(e) => handleInputChange('agentId', e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent.agentId}>
                      {agent.agentName}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                  {agentName}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Number</label>
              {isEditable ? (
                <select
                  value={campaign.fromNumber || ''}
                  onChange={(e) => handleInputChange('fromNumber', e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a phone number</option>
                  {fromNumberList.map((number: string) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                  {campaign.fromNumber || 'Not specified'}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="concurrentCalls">Max Concurrent Calls</label>
              {isEditable ? (
                <input
                  type="number"
                  id="concurrentCalls"
                  name="concurrentCalls"
                  value={campaign.concurrentCalls || 0}
                  onChange={(e) => handleInputChange('concurrentCalls', parseInt(e.target.value) || 0)}
                  className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                />
              ) : (
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                  {campaign.concurrentCalls || 0}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up</label>
              {isEditable ? (
                <div className="flex items-center gap-4">
                  <div className="flex gap-4">
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        name="followUp"
                        value="No"
                        checked={campaign.followUp === "No" || !campaign.followUp}
                        onChange={(e) => handleInputChange('followUp', e.target.value)}
                        className="mr-2 text-sm"
                      />
                      No
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        name="followUp"
                        value="Yes"
                        checked={campaign.followUp === "Yes"}
                        onChange={(e) => handleInputChange('followUp', e.target.value)}
                        className="mr-2 text-sm"
                      />
                      Yes
                    </label>
                  </div>
                  {campaign.followUp === "Yes" && (
                    <input
                      type="number"
                      value={campaign.noOfFollowUps || ''}
                      onChange={(e) => handleInputChange('noOfFollowUps', e.target.value)}
                      className="w-20 rounded-md border border-gray-300 px-1 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="#"
                      min="1"
                      max="5"
                    />
                  )}
                </div>
              ) : (
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                  {campaign.followUp || 'No'}
                  {campaign.followUp === 'Yes' && campaign.noOfFollowUps && (
                    <span className="ml-2">({campaign.noOfFollowUps} follow-ups)</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Recipients Section */}
      <CollapsibleSection
        title="Recipients"
        icon={Users}
        isOpen={openSections.recipients}
        onToggle={() => toggleSection('recipients')}
      >
        <div className="space-y-4">
          {isEditable && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Recipients File</label>
              <label
                htmlFor="recipientsFile"
                className="block p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:border-indigo-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {fileName ? (
                  <span className="text-green-600 font-medium">{fileName}</span>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-500">
                      Drop CSV file here or click to upload
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  id="recipientsFile"
                  ref={fileInputRef}
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {extractedPhones.length > 0 && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <span className="text-sm text-green-700 font-medium">
                    ✓ {extractedPhones.length} phone numbers extracted successfully
                  </span>
                </div>
              )}
            </div>
          )}

          <div>
            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients ({(campaign.recipients?.length || 0) + (extractedPhones.length || 0)} total)
            </label> */}
            
            {/* Show extracted phones if available */}
            {extractedPhones.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-green-600 font-medium mb-1">
                  Recently uploaded ({extractedPhones.length} numbers):
                </div>
                <div className="max-h-32 overflow-y-auto border border-green-200 rounded-md p-2 bg-green-50">
                  {extractedPhones.slice(0, 3).map((phone, index) => (
                    <div key={index} className="text-sm text-green-700 py-1">
                      {phone}
                    </div>
                  ))}
                  {extractedPhones.length > 5 && (
                    <div className="text-sm text-green-600 italic">
                      ... and {extractedPhones.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Show existing recipients */}
            {/* {campaign.recipients && campaign.recipients.length > 0 ? (
              <div>
                <div className="text-xs text-gray-600 font-medium mb-1">
                  Campaign recipients ({campaign.recipients.length} numbers):
                </div>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
                  {campaign.recipients.slice(0, 10).map((recipient, index) => (
                    <div key={index} className="text-sm text-gray-600 py-1">
                      {recipient}
                    </div>
                  ))}
                  {campaign.recipients.length > 10 && (
                    <div className="text-sm text-gray-500 italic">
                      ... and {campaign.recipients.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            ) : extractedPhones.length === 0 && (
              <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-md bg-gray-50">
                No recipients added yet. Upload a CSV file to add recipients.
              </div>
            )} */}
          </div>
        </div>
      </CollapsibleSection>

      {/* Goals Section */}
      <CollapsibleSection
        title="Goals"
        icon={Target}
        isOpen={openSections.goals}
        onToggle={() => toggleSection('goals')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">Campaign Goal <span className="italic text-gray-500 text-sm">(Define what the AI voice agent should achieve in a single sentence.)
            </span></label>
            <div className="text-gray-500 text-xs mb-2">💡 Example: "Remind users to renew their subscription"</div>
            {isEditable ? (
              <textarea
                ref={goalInputRef}
                value={campaign.goal || ''}
                onChange={handleGoalChange}
                rows={2}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
                placeholder="Describe the main objective of this campaign..."
              />
            ) : (
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[60px]">
                {campaign.goal || 'No goal specified'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data to Collect</label>
            {isEditable ? (
              <textarea
                ref={dataTextareaRef}
                value={campaign.dataToCollect?.join('\n') || ''}
                onChange={handleDataCollectChange}
                rows={3}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Specify what information you want to gather (one per line)..."
              />
            ) : (
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[60px]">
                {campaign.dataToCollect && campaign.dataToCollect.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {campaign.dataToCollect.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'No data collection specified'
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">

              Mandatory Adherence
            </label>
            {isEditable ? (
              <textarea
                ref={mandatoryAdherenceTextareaRef}
                value={campaign.mandatoryAdherence || ''}
                onChange={handleMandatoryAdherenceChange}
                rows={3}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Define compliance requirements and mandatory protocols..."
              />
            ) : (
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[60px]">
                {campaign.mandatoryAdherence || 'No mandatory adherence specified'}
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Scheduling Section */}
      <CollapsibleSection
        title="Scheduling"
        icon={Calendar}
        isOpen={openSections.scheduling}
        onToggle={() => toggleSection('scheduling')}
      >
        <div className="space-y-6">
          {/* Time Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            {isEditable ? (
              <TimezoneDropdown
                value={campaign.callTimezone || ''}
                onChange={(value) => handleInputChange('callTimezone', value)}
              />
            ) : (
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {campaign.callTimezone || 'Not specified'}
              </div>
            )}
          </div>

          {/* Schedule call days */}
          {isEditable && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3 text-sm">Schedule your call days</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekdays.map(day => (
                  <label key={day} className="inline-flex items-center space-x-2 p-1 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-indigo-600" 
                      checked={selectedDays.includes(day)} 
                      onChange={() => handleDayToggle(day)} 
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Selected Days Display (Read-only view) */}
          {!isEditable && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected Days</label>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {campaign.slotDates && campaign.slotDates.length > 0 ? (
                  campaign.slotDates.join(', ')
                ) : (
                  'No specific days selected'
                )}
              </div>
            </div>
          )}

          {/* Call timings */}
          {isEditable && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3 text-sm">Select call timings during the day</h4>
              <div className="space-y-3">
                <label className="flex items-center p-1 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="callTiming" 
                    className="w-4 h-4 text-indigo-600" 
                    value="fullDay" 
                    checked={callTiming === 'fullDay'} 
                    onChange={(e) => handleCallTimingChange(e.target.value)} 
                  />
                  <span className="ml-2 text-sm">Full day - 10 AM to 6 PM</span>
                </label>
                <label className="flex items-center p-1 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="callTiming" 
                    className="w-4 h-4 text-indigo-600" 
                    value="firstHalf" 
                    checked={callTiming === 'firstHalf'} 
                    onChange={(e) => handleCallTimingChange(e.target.value)} 
                  />
                  <span className="ml-2 text-sm">1st Half only - 10 AM to 2 PM</span>
                </label>
                <label className="flex items-center p-1 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="callTiming" 
                    className="w-4 h-4 text-indigo-600" 
                    value="secondHalf" 
                    checked={callTiming === 'secondHalf'} 
                    onChange={(e) => handleCallTimingChange(e.target.value)} 
                  />
                  <span className="ml-2 text-sm">2nd Half only - 2 PM to 6 PM</span>
                </label>
                <label className="flex items-center p-1 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="callTiming" 
                    className="w-4 h-4 text-indigo-600" 
                    value="custom" 
                    checked={callTiming === 'custom'} 
                    onChange={(e) => handleCallTimingChange(e.target.value)} 
                  />
                  <span className="ml-2 text-sm">Custom</span>
                </label>
                
                {callTiming === 'custom' && (
                  <div className="flex items-center mt-3 space-x-4 ml-8">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <input 
                        type="time" 
                        value={customStartTime} 
                        onChange={(e) => {
                          setCustomStartTime(e.target.value);
                          handleInputChange('slotTime', `${e.target.value}-${customEndTime}`);
                        }} 
                        className="border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <span className="text-sm">to</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <input 
                        type="time" 
                        value={customEndTime} 
                        onChange={(e) => {
                          setCustomEndTime(e.target.value);
                          handleInputChange('slotTime', `${customStartTime}-${e.target.value}`);
                        }} 
                        className="border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Call Time Display (Read-only view) */}
          {!isEditable && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Call Time</label>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                {campaign.slotTime || 'Not specified'}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default CampaignGeneralTab; 
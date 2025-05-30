"use client";

import TimeZoneDropdown from "@/components/newAgent/timeZoneDropdown";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef, useMemo } from "react";
import { createCampaign } from '@/utils/api';
import Papa from 'papaparse'; 
import axios from 'axios';
import { Campaign } from "../types";
import { Settings, Calendar, Target, Users, Triangle, Clock, Phone, Bot, Paperclip, MapPin, Shield } from 'lucide-react';
import TimezoneDropdown from '@/components/ui/TimezoneDropdown';

type Contact = {
  phonenumber: string;
  metadata: {
    follow_up_date_time: string,
    [key: string]: any;
  };
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type Weekday = typeof weekdays[number];

interface EditFormProps {
  campaign: Campaign; 
  onSave?: (formData: any) => void;
}

interface EditFormRef {
  save: () => void;
}

const EditForm = forwardRef<EditFormRef, EditFormProps>(({ campaign, onSave }, ref) => {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedPhones, setExtractedPhones] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [agentList, setAgentList] = useState([]);
  const [timeZones, setTimeZones] = useState<string[]>([]);
  const [contact, setContact] = useState<any>();
  const [fromNumberList, setFromNumberList] = useState<string[]>([]);
  
  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    basic: true,
    scheduling: false,
    goals: false,
    recipients: false
  });

  // Helper function to parse existing slotTime
  const parseSlotTime = (slotTime?: string) => {
    if (!slotTime) return { timing: 'fullDay', startTime: '10:00', endTime: '18:00' };
    
    if (slotTime === 'fullDay' || slotTime === 'firstHalf' || slotTime === 'secondHalf') {
      return { timing: slotTime, startTime: '10:00', endTime: '18:00' };
    }
    
    // Parse custom time format like "09:00-17:00"
    const timeMatch = slotTime.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
    if (timeMatch) {
      return { timing: 'custom', startTime: timeMatch[1], endTime: timeMatch[2] };
    }
    
    return { timing: 'fullDay', startTime: '10:00', endTime: '18:00' };
  };

  const existingSlotTime = parseSlotTime(campaign.slotTime);

  const [formData, setFormData] = useState({
    agent: campaign.agentId || "",
    campaignName: campaign.campaignCallName || "",
    fromNumber: campaign.fromNumber || "",
    sendOption: "now",
    scheduleDate: "",
    timeZone: campaign.callTimezone || "",
    recipientsFile: null as File | null,
    recipients: campaign.recipients || [],
    followUp: campaign.noOfFollowUps === "" || campaign.noOfFollowUps === "0" ? "No" : "Yes",
    noOfFollowUps: campaign.noOfFollowUps || "0",
    status: campaign.status || "ongoing",
    concurrentCalls: campaign.concurrentCalls || 0,
    
    // New fields for scheduling and timing - initialize with existing data
    selectedDays: (campaign.slotDates || []) as Weekday[],
    callTiming: existingSlotTime.timing as 'fullDay'|'firstHalf'|'secondHalf'|'custom',
    customStartTime: existingSlotTime.startTime,
    customEndTime: existingSlotTime.endTime,
    
    // New fields for goals and data collection - initialize with existing data
    campaignGoal: campaign.goal || '',
    dataToCollect: Array.isArray(campaign.dataToCollect) ? campaign.dataToCollect.join('\n') : '',
    mandatoryAdherence: campaign.mandatoryAdherence || ''
  });

  function transformDynamicData(data: any): { contacts: Contact[] } {
    const contacts = data
      .filter((item: any) => item["Phone Number"]?.trim())
      .map((item: any) => {
        const { ["Phone Number"]: phoneNumber, ...restMetadata } = item;
        return {
          phonenumber: phoneNumber,
          metadata: {
            follow_up_date_time: "",
            ...restMetadata,
          }
        };
      });
  
    return { contacts };
  }

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agent/get');
      const data = await res.json();
      setAgentList(data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } 
  };

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

  const fetchTimeZones = async () => {
    try {
      const res = await axios.get('https://timeapi.io/api/timezone/availabletimezones');
      setTimeZones(res.data);
    } catch (error) {
      console.error('Failed to fetch time zones:', error);
    }
  };
  
  useEffect(() => {
    fetchAgents();
    fetchNumbers();
    fetchTimeZones();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFormData(prev => ({ ...prev, recipientsFile: file }));
  
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const temp = transformDynamicData(results.data);
          setContact(temp.contacts);
          const phoneNumbers = extractPhoneNumbers(results.data);
          setExtractedPhones(phoneNumbers);
        },
        error: (err) => {
          console.error('Error parsing file:', err);
        }
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

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

  // Simple onChange handler that doesn't cause re-renders
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Simple handler for radio buttons
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simple handler for checkboxes (days selection)
  const handleDayToggle = (day: Weekday) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleSave = () => {
    if (onSave) {
      // Generate slotTime based on selection
      let slotTime: string = formData.callTiming;
      if (formData.callTiming === 'custom') {
        slotTime = `${formData.customStartTime}-${formData.customEndTime}`;
      }

      const campaignData = {
        _id: campaign._id,
        campaignCallName: formData.campaignName,
        agentId: formData.agent,
        fromNumber: formData.fromNumber,
        followUp: formData.followUp,
        noOfFollowUps: formData.noOfFollowUps,
        callTimezone: formData.timeZone,
        callScheduledOrNot: formData.sendOption === 'schedule',
        callDate: formData.sendOption === 'schedule' ? new Date(formData.scheduleDate) : null,
        recipients: extractedPhones.length > 0 ? extractedPhones : formData.recipients,
        status: formData.status,
        concurrentCalls: formData.concurrentCalls,
        contacts: contact,
        
        // Updated field names to match database model
        slotDates: formData.selectedDays,
        slotTime: slotTime, // Store the full timing info
        goal: formData.campaignGoal,
        dataToCollect: formData.dataToCollect.split('\n').filter(item => item.trim() !== ''),
        mandatoryAdherence: formData.mandatoryAdherence
      };
      onSave(campaignData);
    }
  };

  // Expose save function to parent via ref
  useImperativeHandle(ref, () => ({
    save: handleSave
  }));

  // Dedicated handler for campaign goal input
  const handleCampaignGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      campaignGoal: value
    }));
  };

  const CollapsibleSection = ({ 
    title, 
    icon: Icon, 
    isOpen, 
    onToggle, 
    children 
  }: { 
    title: string; 
    icon: any; 
    isOpen: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
  }) => (
    <div className='border border-gray-200 rounded-lg'>
      <header 
        className='cursor-pointer bg-gray-100 p-3'
        onClick={onToggle}
      >
        <div className='flex justify-between items-center'>
          <div className='flex gap-2 items-center'>
            <Icon className='w-4 h-4 text-gray-900' />
            <h3 className='text-md font-medium text-gray-900'>{title}</h3>
          </div>
          <Triangle 
            className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : "rotate-90"}`} 
            style={{ fill: "lightgray" }}
          />
        </div>
      </header>
      {isOpen && (
        <div className='p-4 bg-gray-50'>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 pt-0 space-y-4">
        
        {/* Basic Configuration Section */}
        <CollapsibleSection
          title="Basic Configuration"
          icon={Settings}
          isOpen={openSections.basic}
          onToggle={() => toggleSection('basic')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="agent" className="block text-sm font-medium text-gray-700">
                  <Bot className="w-4 h-4 inline mr-1" />
                  Select Agent
                </label>
                <select
                  id="agent"
                  name="agent"
                  value={formData.agent}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select an agent</option>
                  {agentList.map((agent: any) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.agentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="fromNumber" className="block text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 inline mr-1" />
                  From Number
                </label>
                <select
                  id="fromNumber"
                  name="fromNumber"
                  value={formData.fromNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select a phone number</option>
                  {fromNumberList.map((number: string) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="concurrentCalls" className="block text-sm font-medium text-gray-700">
                  Concurrent Calls
                </label>
                <input
                  type="number"
                  id="concurrentCalls"
                  name="concurrentCalls"
                  min="0"
                  value={formData.concurrentCalls}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Follow-ups</label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="followUp"
                        value="Yes"
                        checked={formData.followUp === "Yes"}
                        onChange={(e) => handleRadioChange('followUp', e.target.value)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="followUp"
                        value="No"
                        checked={formData.followUp === "No"}
                        onChange={(e) => handleRadioChange('followUp', e.target.value)}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                  {formData.followUp === "Yes" && (
                    <input
                      type="number"
                      name="noOfFollowUps"
                      value={formData.noOfFollowUps}
                      min="1"
                      max="5"
                      onChange={handleInputChange}
                      className="w-20 rounded-md border border-gray-300 px-2 py-1"
                      placeholder="#"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Scheduling & Timing Section */}
        <CollapsibleSection
          title="Scheduling & Timing"
          icon={Calendar}
          isOpen={openSections.scheduling}
          onToggle={() => toggleSection('scheduling')}
        >
          <div className="space-y-6">
            {/* Time Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Time Zone
              </label>
              <TimezoneDropdown
                value={formData.timeZone}
                onChange={(value) => setFormData(prev => ({ ...prev, timeZone: value }))}
              />
            </div>

            {/* Schedule call days */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Schedule your call days</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekdays.map(day => (
                  <label key={day} className="inline-flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-indigo-600" 
                      checked={formData.selectedDays.includes(day)} 
                      onChange={(e) => handleDayToggle(day)} 
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Call timings */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Select call timings during the day</h4>
              <div className="space-y-3">
                <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="callTiming" 
                    className="w-4 h-4 text-indigo-600" 
                    value="fullDay" 
                    checked={formData.callTiming === 'fullDay'} 
                    onChange={(e) => handleRadioChange('callTiming', e.target.value)} 
                  />
                  <span className="ml-2">Full day - 10 AM to 6 PM</span>
                </label>
                <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="callTiming" 
                    className="w-4 h-4 text-indigo-600" 
                    value="firstHalf" 
                    checked={formData.callTiming === 'firstHalf'} 
                    onChange={(e) => handleRadioChange('callTiming', e.target.value)} 
                  />
                  <span className="ml-2">1st Half only - 10 AM to 2 PM</span>
                </label>
                <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="callTiming" 
                    className="w-4 h-4 text-indigo-600" 
                    value="secondHalf" 
                    checked={formData.callTiming === 'secondHalf'} 
                    onChange={(e) => handleRadioChange('callTiming', e.target.value)} 
                  />
                  <span className="ml-2">2nd Half only - 2 PM to 6 PM</span>
                </label>
                <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="callTiming" 
                    className="w-4 h-4 text-indigo-600" 
                    value="custom" 
                    checked={formData.callTiming === 'custom'} 
                    onChange={(e) => handleRadioChange('callTiming', e.target.value)} 
                  />
                  <span className="ml-2">Custom</span>
                </label>
                
                {formData.callTiming === 'custom' && (
                  <div className="flex items-center mt-3 space-x-4 ml-8">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <input 
                        type="time" 
                        name="customStartTime"
                        value={formData.customStartTime} 
                        onChange={handleInputChange} 
                        className="border border-gray-300 rounded p-2"
                      />
                    </div>
                    <span>to</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <input 
                        type="time" 
                        name="customEndTime"
                        value={formData.customEndTime} 
                        onChange={handleInputChange} 
                        className="border border-gray-300 rounded p-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Goals & Data Collection Section */}
        <CollapsibleSection
          title="Goals & Data Collection"
          icon={Target}
          isOpen={openSections.goals}
          onToggle={() => toggleSection('goals')}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="campaignGoal" className="block text-sm font-medium text-gray-700">
                Define Goal
              </label>
              <input
                id="campaignGoal"
                name="campaignGoal"
                type="text"
                value={formData.campaignGoal}
                onChange={handleCampaignGoalChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the main objective of this campaign..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dataToCollect" className="block text-sm font-medium text-gray-700">
                Data you want to collect
              </label>
              <textarea
                id="dataToCollect"
                name="dataToCollect"
                value={formData.dataToCollect}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Specify what information you want to gather from calls (one per line)..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="mandatoryAdherence" className="block text-sm font-medium text-gray-700">
                Mandatory Adherence
              </label>
              <textarea
                id="mandatoryAdherence"
                name="mandatoryAdherence"
                value={formData.mandatoryAdherence}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Define compliance requirements and mandatory protocols..."
              />
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Recipients File</label>
              <label
                htmlFor="recipientsFile"
                className="block p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:border-indigo-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {fileName ? (
                  <span className="text-green-600 font-medium">{fileName}</span>
                ) : (
                  <span className="text-gray-500">
                    Drop CSV file here or click to upload
                  </span>
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
          </div>
        </CollapsibleSection>

      </div>
    </div>
  );
});

export default EditForm; 
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Campaign } from '../types';
import { Info, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
interface SendModalProps {
  onClose: () => void;
  campaign: Campaign;
}

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type Weekday = typeof weekdays[number];

export const SendModal: React.FC<SendModalProps> = ({ onClose, campaign }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const [callTiming, setCallTiming] = useState<'fullDay'|'firstHalf'|'secondHalf'|'custom'>('fullDay');
  const [customStartTime, setCustomStartTime] = useState('10:00');
  const [customEndTime, setCustomEndTime] = useState('18:00');
  const [sendOption, setSendOption] = useState<'now'|'schedule'>('now');
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [expectedInfo, setExpectedInfo] = useState<{ startDateTime?: string; totalCalls?: number; maxConcurrency?: number; noOfCallLoops?: number; avgTimePerCall?: number; avgTimeCampaignMins?: number; avgTimeCampaignHrs?: number; expectedEndDateTime?: string }>({});
  const [showDetails, setShowDetails] = useState(false);

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDay = (day: Weekday) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  // Calculate expected end date whenever relevant options change
  useEffect(() => {
    calculateExpected();
  }, [selectedDays, callTiming, customStartTime, customEndTime, sendOption, scheduleDateTime]);

  const calculateExpected = () => {
    const startDateTime = sendOption === 'now' ? new Date().toISOString() : new Date(scheduleDateTime || new Date()).toISOString();
    const totalCalls = 1000;  // TODO: replace with real data
    const maxConcurrency = 10; // TODO: replace with real data
    const noOfCallLoops = 1;   // TODO: replace with real data
    const avgTimePerCall = 2;  // minutes, TODO: replace with real data
    const avgTimeCampaignMins = (totalCalls * avgTimePerCall) / maxConcurrency;
    const avgTimeCampaignHrs = avgTimeCampaignMins / 60;
    const expectedEndDateTime = new Date(Date.parse(startDateTime) + avgTimeCampaignMins * 60000).toISOString();

    setExpectedInfo({ startDateTime, totalCalls, maxConcurrency, noOfCallLoops, avgTimePerCall, avgTimeCampaignMins, avgTimeCampaignHrs, expectedEndDateTime });
  };
  const API_URL = process.env.NEXT_PUBLIC_CALL_URL!;
  const API_KEY = 'supersecretapikey123';
  
  const triggerFastApiCall = async (campId: string) => {
    try {
      const payload = {
        agentId: campaign.agentId,
        fromPhone: campaign.fromNumber,
        numberofFollowup: campaign.noOfFollowUps,
        campaignid: campId,
                
      }
      console.log("payload", payload);
      const response = await axios.post(
        API_URL,
        payload,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      );
  
      return response.data;
    } catch (error: any) {
      console.error('❌ Axios Error:', error.response?.data || error.message);
      throw error;
    }
  };
  const handleSend = () => {
    console.log(campaign);
    triggerFastApiCall(campaign._id);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Calculating...";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-700/50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[90%] max-w-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="py-4 px-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl font-semibold">Send Campaign</h2>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-6 flex-1 overflow-auto">
          {/* Schedule call days */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Schedule your call days</h3>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {weekdays.map(day => (
                <label key={day} className="inline-flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600" 
                    checked={selectedDays.includes(day)} 
                    onChange={() => toggleDay(day)} 
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Call timings */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Select call timings during the day</h3>
            <div className="mt-3 space-y-3">
              <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="callTiming" 
                  className="w-4 h-4 text-blue-600" 
                  value="fullDay" 
                  checked={callTiming==='fullDay'} 
                  onChange={() => setCallTiming('fullDay')} 
                />
                <span className="ml-2">Full day - 10 AM to 6 PM</span>
              </label>
              <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="callTiming" 
                  className="w-4 h-4 text-blue-600" 
                  value="firstHalf" 
                  checked={callTiming==='firstHalf'} 
                  onChange={() => setCallTiming('firstHalf')} 
                />
                <span className="ml-2">1st Half only - 10 AM to 2 PM</span>
              </label>
              <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="callTiming" 
                  className="w-4 h-4 text-blue-600" 
                  value="secondHalf" 
                  checked={callTiming==='secondHalf'} 
                  onChange={() => setCallTiming('secondHalf')} 
                />
                <span className="ml-2">2nd Half only - 2 PM to 6 PM</span>
              </label>
              <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="callTiming" 
                  className="w-4 h-4 text-blue-600" 
                  value="custom" 
                  checked={callTiming==='custom'} 
                  onChange={() => setCallTiming('custom')} 
                />
                <span className="ml-2">Custom</span>
              </label>
              
              {callTiming==='custom' && (
                <div className="flex items-center mt-3 space-x-4 ml-8">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <input 
                      type="time" 
                      value={customStartTime} 
                      onChange={e => setCustomStartTime(e.target.value)} 
                      className="border border-gray-300 rounded p-2"
                    />
                  </div>
                  <span>to</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <input 
                      type="time" 
                      value={customEndTime} 
                      onChange={e => setCustomEndTime(e.target.value)} 
                      className="border border-gray-300 rounded p-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Send option */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Send Option</h3>
            <div className="mt-3 space-y-3">
              <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="sendOption" 
                  className="w-4 h-4 text-blue-600" 
                  value="now" 
                  checked={sendOption==='now'} 
                  onChange={() => setSendOption('now')} 
                />
                <span className="ml-2">Send Now</span>
              </label>
              <label className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="sendOption" 
                  className="w-4 h-4 text-blue-600" 
                  value="schedule" 
                  checked={sendOption==='schedule'} 
                  onChange={() => setSendOption('schedule')} 
                />
                <span className="ml-2">Schedule</span>
              </label>
            </div>
            
            {sendOption==='schedule' && (
              <div className="mt-4 ml-8">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <input 
                    type="datetime-local" 
                    value={scheduleDateTime} 
                    onChange={e => setScheduleDateTime(e.target.value)} 
                    className="border border-gray-300 rounded p-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Fixed Footer */}
        <div className="py-2 px-6 border-t sticky bottom-0 bg-white z-10 rounded-b-2xl">
          <div className="flex flex-col mb-4 relative">
            <div className="flex items-center">
              <h3 className="font-medium mr-2">Expected End Date & Time:</h3>
              <span className="text-blue-800 font-semibold">{formatDate(expectedInfo.expectedEndDateTime)}</span>
              <button 
                className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            
            {/* Calculation Details Popup */}
            {showDetails && (
              <div className="absolute bottom-full mb-2 bg-white border rounded-lg shadow-lg p-4 w-full">
                <h4 className="font-medium mb-2">Campaign Details</h4>
                <div className="space-y-1 text-sm">
                  <p>Campaign start date and time: {formatDate(expectedInfo.startDateTime)}</p>
                  <p>Total calls scheduled: {expectedInfo.totalCalls}</p>
                  <p>Max concurrency: {expectedInfo.maxConcurrency}</p>
                  <p>No of call loops: {expectedInfo.noOfCallLoops}</p>
                  <p>Avg time per call (mins): {expectedInfo.avgTimePerCall}</p>
                  <p>Avg time for your campaign (mins): {expectedInfo.avgTimeCampaignMins}</p>
                  <p>Avg time for your campaign (hrs): {expectedInfo.avgTimeCampaignHrs?.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
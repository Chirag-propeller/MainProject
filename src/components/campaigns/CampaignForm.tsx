"use client";

import TimeZoneDropdown from "@/components/newAgent/timeZoneDropdown";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from "react";
import { createCampaign } from '@/utils/api';
import Papa from 'papaparse'; 
import axios from 'axios';

type Contact = {
  phonenumber: string;
  metadata: {
    follow_up_date_time: string,
    [key: string]: any;
  };
};

const CampaignForm: React.FC = () => {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedPhones, setExtractedPhones] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [agentList, setAgentList] = useState([]);
  const [timeZones, setTimeZones] = useState<string[]>([]);
  const [contact, setContact] = useState<any>();
  const [fromNumberList, setFromNumberList] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    agent: "",
    campaignName: "",
    fromNumber: "",
    sendOption: "now",
    scheduleDate: "",
    timeZone: "",
    recipientsFile: null as File | null,
    recipients: extractedPhones,
    followUp: false,
    noOfFollowUps: "0",
    status: "ongoing"
  });

  function transformDynamicData(data: any): { contacts: Contact[] } {
    console.log(data);
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
    console.log(contacts);
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
      setFormData({ ...formData, recipientsFile: file });
  
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const temp = transformDynamicData(results.data);
          setContact(temp.contacts);
          const phoneNumbers = extractPhoneNumbers(results.data);
          setExtractedPhones(phoneNumbers);
        },
      });
    }
  };

  // const API_URL = process.env.NEXT_PUBLIC_CALL_URL!;
  const API_URL = 'http://localhost:8000/process-numbers/';
  const API_KEY = 'supersecretapikey123';
  
  const triggerFastApiCall = async (campId: string) => {
    try {
      const response = await axios.post(
        API_URL,
        {
          agentId: formData.agent,
          fromPhone: formData.fromNumber,
          numberofFollowup: formData.noOfFollowUps,
          campaignid: campId,
          contacts: contact,
        },
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
  
  const [response, setResponse] = useState<any>(null);

  const handleCreateCampaign = async (status: 'ongoing' | 'draft',  redirect = true) => {
    // Check if agent is selected
    if (status === 'ongoing' && (!formData.agent || formData.agent.trim() === "")) {
      alert("Please attach an Agent");
      return;
    }
  
    // For draft status, don't require recipients
    if (status === 'ongoing' && extractedPhones.length === 0) {
      alert("Please Enter some Recipient List To Create Campaign");
      return;
    }

    const transformedData = {
      campaignCallName: formData.campaignName || 'Untitled Campaign',
      agentId: formData.agent,
      fromNumber: formData.fromNumber,
      callTimezone: formData.timeZone,
      callScheduledOrNot: formData.sendOption === 'schedule',
      callDate: formData.sendOption === 'schedule' ? new Date(formData.scheduleDate) : null,
      recipients: extractedPhones,
      status: status,
      followUp: formData.followUp,
      noOfFollowUps: formData.noOfFollowUps,
    };
    
    try {
      const res = await createCampaign(transformedData);
      setResponse(res);
      
      // Only trigger API call for ongoing campaigns
      if (status === 'ongoing' && extractedPhones.length > 0) {
        await triggerFastApiCall(res.data._id);
      }
      if (redirect) {
        router.push('/dashboard/campaigns');
      }
    } catch (err: any) {
      console.error('❌ Error:', err);
      setResponse({ error: err.message || 'Something went wrong' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateCampaign('ongoing');
  };

  const handleSaveAsDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateCampaign('draft');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFollowUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "Yes";
    setFormData(prev => ({ ...prev, followUp: value }));
  };

  const handleCancel = () => {
    router.push('/dashboard/campaigns');
  };

  return (
    <div className="h-full overflow-auto bg-white dark:bg-gray-950">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create New Campaign</h2>
      </div>
      <div className="p-4 bg-white dark:bg-gray-950">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <label htmlFor="campaignName" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Campaign Name
            </label>
            <input
              type="text"
              id="campaignName"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              placeholder="Enter campaign name"
              required
            />
          </div>

          {/* Agent Selection */}
          <div className="space-y-2">
            <label htmlFor="agent" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Select Agent
            </label>
            <select
              id="agent"
              name="agent"
              value={formData.agent}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
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

          {/* From Number */}
          <div className="space-y-2">
            <label htmlFor="fromNumber" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              From Number
            </label>
            <select
              id="fromNumber"
              name="fromNumber"
              value={formData.fromNumber}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
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

          {/* Send Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Send Options</label>
            <div className="flex gap-4">
              <label className="flex items-center text-gray-900 dark:text-gray-100">
                <input
                  type="radio"
                  name="sendOption"
                  value="now"
                  checked={formData.sendOption === "now"}
                  onChange={handleInputChange}
                  className="mr-2 text-indigo-600 dark:text-indigo-400"
                />
                Send Now
              </label>
              <label className="flex items-center text-gray-900 dark:text-gray-100">
                <input
                  type="radio"
                  name="sendOption"
                  value="schedule"
                  checked={formData.sendOption === "schedule"}
                  onChange={handleInputChange}
                  className="mr-2 text-indigo-600 dark:text-indigo-400"
                />
                Schedule
              </label>
            </div>

            {formData.sendOption === "schedule" && (
              <div className="flex gap-4 mt-2">
                <input
                  type="datetime-local"
                  name="scheduleDate"
                  value={formData.scheduleDate}
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  required={formData.sendOption === "schedule"}
                />
                <select
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  required={formData.sendOption === "schedule"}
                >
                  <option value="">Select Time Zone</option>
                  {timeZones.map((zone: string) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Recipients File */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Recipients</label>
            <label
              htmlFor="recipientsFile"
              className="block p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {fileName ? (
                <span className="text-green-600 dark:text-green-400">{fileName}</span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
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
            {/* {extractedPhones.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {extractedPhones.length} phone numbers extracted
              </div>
            )} */}
          </div>

          {/* Follow-up Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Follow-ups</label>
            <div className="flex gap-4">
              <label className="flex items-center text-gray-900 dark:text-gray-100">
                <input
                  type="radio"
                  name="followUp"
                  value="Yes"
                  checked={formData.followUp === true}
                  onChange={handleFollowUpChange}
                  className="mr-2 text-indigo-600 dark:text-indigo-400"
                />
                Yes
              </label>
              <label className="flex items-center text-gray-900 dark:text-gray-100">
                <input
                  type="radio"
                  name="followUp"
                  value="No"
                  checked={formData.followUp === false}
                  onChange={handleFollowUpChange}
                  className="mr-2 text-indigo-600 dark:text-indigo-400"
                />
                No
              </label>
            </div>

            {formData.followUp === true && (
              <div className="mt-2">
                <label htmlFor="noOfFollowUps" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Number of Follow-ups
                </label>
                <input
                  type="number"
                  id="noOfFollowUps"
                  name="noOfFollowUps"
                  value={formData.noOfFollowUps}
                  min="1"
                  max="5"
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 w-24 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="default" className="">
              Create Campaign
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveAsDraft}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm; 
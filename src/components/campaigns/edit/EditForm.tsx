"use client";

import TimeZoneDropdown from "@/components/newAgent/timeZoneDropdown";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from "react";
import { createCampaign } from '@/utils/api';
import Papa from 'papaparse'; 
import axios from 'axios';
import { Campaign } from "../types";

type Contact = {
  phonenumber: string;
  metadata: {
    follow_up_date_time: string,
    [key: string]: any;
  };
};


const EditForm: React.FC<{ 
  campaign: Campaign; 
  onSave?: (formData: any) => void;
}> = ({ campaign, onSave }) => {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedPhones, setExtractedPhones] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [agentList, setAgentList] = useState([]);
  const [timeZones, setTimeZones] = useState<string[]>([]);
  const [contact, setContact] = useState<any>();
  const [fromNumberList, setFromNumberList] = useState<string[]>([]);
  const [concurrentCalls, setConcurrentCalls] = useState<number>((campaign as any).concurrentCalls ?? 0);
  const [formData, setFormData] = useState({
    agent: campaign.agentId || "",
    campaignName: campaign.campaignCallName || "",
    fromNumber: campaign.fromNumber || "",
    sendOption: "now", // Default to now as these aren't in the Campaign type
    scheduleDate: "",
    timeZone: "",
    recipientsFile: null as File | null,
    recipients: [] as string[],
    followUp: campaign.noOfFollowUps === "" ? "No" : "Yes",
    noOfFollowUps:  campaign.noOfFollowUps || "0",
    status: campaign.status || "ongoing",
    concurrentCalls: campaign.concurrentCalls || 0
  });

  // Update form data when campaign changes, including concurrentCalls if present
//   useEffect(() => {
//     setFormData(prev => ({
//       ...prev,
//       agent: campaign.agentId || "",
//       campaignName: campaign.campaignCallName || "",
//       fromNumber: campaign.fromNumber || "",
//       status: campaign.status || "ongoing",
//       concurrentCalls: (campaign as any).concurrentCalls ?? 0
//     }));
//     setConcurrentCalls((campaign as any).concurrentCalls ?? 0);
//   }, [campaign]);

  function transformDynamicData(data: any): { contacts: Contact[] } {
    const contacts = data
      .filter((item: any) => item["Phone Number "]?.trim())
      .map((item: any) => {
        const { ["Phone Number "]: phoneNumber, ...restMetadata } = item;
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

//     sendOption: "now", // Default to now as these aren't in the Campaign type
//     scheduleDate: "",
//     timeZone: "",
//     recipientsFile: null as File | null,
//     recipients: [] as string[],
//     followUp: "No",
//     noOfFollowUps: "0",
//     status: campaign.status || "ongoing",
//     concurrentCalls: 0
//   });

  // New function to handle internal save
  const handleSave = () => {
    if (onSave) {
      const campaignData = {
        _id: campaign._id,
        campaignCallName: formData.campaignName,
        agentId: formData.agent,
        fromNumber: formData.fromNumber,

        // Additional fields that may not be in the Campaign type but needed for the API
        followUp: formData.followUp,
        noOfFollowUps: formData.noOfFollowUps,
        callTimezone: formData.timeZone,
        callScheduledOrNot: formData.sendOption === 'schedule',
        callDate: formData.sendOption === 'schedule' ? new Date(formData.scheduleDate) : null,
        recipients: extractedPhones.length > 0 ? extractedPhones : [],
        status: formData.status,
        concurrentCalls: formData.concurrentCalls,
      };
      console.log(campaignData);
      onSave(campaignData);
    }
  };
  
  // Setup side effect to call save when parent requests it
  useEffect(() => {
    if (campaign && onSave) {
      // Expose the save method to parent through ref
      const saveButton = document.getElementById('campaign-save-button');
      if (saveButton) {
        saveButton.addEventListener('click', handleSave);
        return () => {
          saveButton.removeEventListener('click', handleSave);
        };
      }
    }
  }, [campaign, formData, extractedPhones, onSave]);

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 pt-0">
        <form className="space-y-6">
         <div className="flex gap-2">
            {/* Agent Selection */}
            <div className="space-y-2 w-1/2">
                <label htmlFor="agent" className="block text-sm font-medium">
                Select Agent
                </label>
                <select
                id="agent"
                name="agent"
                value={formData.agent}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
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
            <div className="space-y-2 w-1/2">
                <label htmlFor="fromNumber" className="block text-sm font-medium">
                From Number
                </label>
                <select
                id="fromNumber"
                name="fromNumber"
                value={formData.fromNumber}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
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

          {/* Recipients File */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Recipients</label>
            <label
              htmlFor="recipientsFile"
              className="block p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {fileName ? (
                <span className="text-green-600">{fileName}</span>
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
              <div className="mt-2 text-sm text-gray-600">
                {extractedPhones.length} phone numbers extracted
              </div>
            )}
          </div>

          {/* Concurrent Calls */}
          <div className="space-y-2">
            <label htmlFor="concurrentCalls" className="block text-sm font-medium">
              Concurrent Calls
            </label>
            <input
              type="number"
              id="concurrentCalls"
              name="concurrentCalls"
              min="0"
              value={formData.concurrentCalls}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Follow-up Options */}
          <div className="flex gap-8">
            <div className="space-y-2 ">
                <label className="block text-sm font-medium">Follow-ups</label>
                <div className="flex gap-4">
                <label className="flex items-center">
                    <input
                    type="radio"
                    name="followUp"
                    value="Yes"
                    checked={formData.followUp === "Yes"}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="mr-2"
                    />
                    No
                </label>
                </div>
            </div>
            {formData.followUp === "Yes" && (
                <div className="">
                    <label htmlFor="noOfFollowUps" className="block text-sm font-medium mb-2">
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
                    className="rounded-md border border-gray-300 px-1 w-24"
                    />
                </div>
                )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm; 
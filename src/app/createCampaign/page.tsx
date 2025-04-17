"use client";

import TimeZoneDropdown from "@/components/newAgent/timeZoneDropdown";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowLeft, Backpack } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from "react";
import { createCampaign } from '@/utils/api'; // if you moved the function to utils
import Papa from 'papaparse'; 
import axios from 'axios';


// import Button from "@/components/ui/button";



const BatchCallForm: React.FC = () => {

  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedPhones, setExtractedPhones] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    batchName: "",
    fromNumber: "",
    sendOption: "now",
    scheduleDate: "",
    timeZone: "",
    recipientsFile: null as File | null,
    recipients: extractedPhones,
  });
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFormData({ ...formData, recipientsFile: file });
  
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const phoneNumbers = extractPhoneNumbers(results.data);
          setExtractedPhones(phoneNumbers); // <== store them
        },
      });
    }
  };
  const CALL_URL = process.env.NEXT_PUBLIC_CALL_URL 
  const triggerFastApiCall = async (numbers: string[]) => {
    try {
      // const response = await axios.post('http://localhost:8000/start-campaign', {
      const response = await axios.post(`${CALL_URL}/start-campaign`, {
        phoneNumbers: numbers, // adjust to match your FastAPI endpoint
      });
  
      console.log('🚀 FastAPI response:', response.data);
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
            const cleaned = phone.replace(/[^+\d]/g, ''); // remove unwanted characters
            if (cleaned.length >= 10) { // simple length validation
              phoneNumbers.push(cleaned);
            }
          });
        }
      });
    });
    console.log(phoneNumbers);
    return [...new Set(phoneNumbers)];

    // data.forEach(row => {
    //   Object.values(row).forEach(value => {
    //     const matches = String(value).match(phoneRegex);
    //     if (matches) {
    //       phoneNumbers.push(...matches);
    //     }
    //   });
    // });
    // console.log(phoneNumbers);
    // return phoneNumbers;
  };
  
  const [response, setResponse] = useState<any>(null);

  const handleClicker = async (e: React.FormEvent) => {
    const transformedData = {
      campaignCallName: formData.batchName,
      fromNumber: formData.fromNumber,
      callTimezone: formData.timeZone,
      callScheduledOrNot: formData.sendOption === 'schedule',
      callDate: formData.sendOption === 'schedule' ? new Date(formData.scheduleDate) : null,
      recipients: extractedPhones,
      // You can optionally add:
      // campaignCallId: crypto.randomUUID() or something similar
    };
    e.preventDefault();
    if(extractedPhones.length === 0){
      alert("Please Enter some Recepient List To Create Campaign")
      return;
    }
    try {
      const res = await createCampaign(transformedData);
      setResponse(res);
      console.log('✅ Campaign created:', res);
      console.log(extractedPhones)
      await triggerFastApiCall(extractedPhones); 
      console.log("Number send Successfully")
      router.push('/dashboard/campaigns');

    } catch (err: any) {
      console.error('❌ Error:', err);
      setResponse({ error: err.message || 'Something went wrong' });
    }
  };
  return (
    <form className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow">
        <div className="flex">
            
            <Link href="/dashboard/campaigns"> <Button variant="ghost" className="border-1 w-12 h-8 text-sm cursor-pointer"> Back</Button> </Link>
            
            <h2 className="text-2xl font-semibold mx-4">Create Campaign calls</h2>
        </div>
 

      <div>
        <label className="block text-sm font-medium mb-1">Batch Call Name</label>
        <input
          type="text"
          value={formData.batchName}
          onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}        
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">From Number</label>
        <input
          type="text"
          value={formData.fromNumber}
          onChange={(e) => setFormData({ ...formData, fromNumber: e.target.value })}
        
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+91XXXXXXXXXX"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Upload Recipients</label>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Up to 50 MB</span>
        </div>

        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded cursor-pointer text-center text-gray-500 hover:border-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0l-4 4m4-4l4 4m6 4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <span>{fileName || "Choose a CSV or drag & drop it here"}</span>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">When to send the calls</label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="now"
              checked={formData.sendOption === "now"}
              onChange={() => setFormData({ ...formData, sendOption: "now" })}
              className="accent-blue-600"
            />
            <span>Send Now</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="schedule"
              checked={formData.sendOption === "schedule"}
              onChange={() => setFormData({ ...formData, sendOption: "schedule" })}            
              className="accent-blue-600"
            />
            <span>Schedule</span>
          </label>
        </div>

        {formData.sendOption === "schedule" && (
          <div className="flex justify-between">
            <div className="w-[50%] p-4 ps-0"> 
                <label className="block text-sm font-medium mb-1">Select Date</label>
                <input
                type="datetime-local"
                value={formData.scheduleDate}
                onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}              
                className="w-full border border-gray-300 rounded px-3 py-2"
                />
            </div>
            <div>
                {/* <p><strong>Time Zone:</strong></p> */}
                <TimeZoneDropdown
                    selectedZone={formData.timeZone}
                    setSelectedZone={(zone) => setFormData({ ...formData, timeZone: zone })}
                />
            </div>
            
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600 mt-2">
        
        <p className="mt-1"><strong>Estimated Time to complete calls:</strong> </p>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter"
        ></input>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        {/* <Button>Save as Draft</Button> */}
        <Button className="cursor-pointer" onClick={handleClicker}>Send</Button>
      </div>
    </form>
  );
};

export default BatchCallForm;

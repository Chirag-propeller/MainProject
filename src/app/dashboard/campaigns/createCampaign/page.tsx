"use client";

import TimeZoneDropdown from "@/components/newAgent/timeZoneDropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from "react";
import { createCampaign } from '@/utils/api'; // if you moved the function to utils
import Papa from 'papaparse'; 
import axios from 'axios';



type Contact = {
  phonenumber: string;
  metadata: {
    follow_up_date_time: string,
    [key: string]: any; // <-- this allows any additional dynamic fields
  };
};




const BatchCallForm: React.FC = () => {

  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedPhones, setExtractedPhones] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [agentList, setAgentList] = useState([]);
  const [timeZones, setTimeZones] = useState<string[]>([]);
  // const [csvData, setCsvData] = useState<any>([]);
  const [contact , setContact] = useState<any>();
  const [fromNumberList, setFromNumberList] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    agent:"",
    campaignName: "",
    fromNumber: "",
    sendOption: "now",
    scheduleDate: "",
    timeZone: "",
    recipientsFile: null as File | null,
    recipients: extractedPhones,
    followUp: "No",
    noOfFollowUps: "0",
  });


  function transformDynamicData(data: any): { contacts: Contact[] } {
    const contacts = data
      .filter((item:any) => item["Phone Number "]?.trim()) // Ignore blank phone numbers
      .map((item:any) => {
        const { ["Phone Number "]: phoneNumber, ...restMetadata } = item;
  
        return {
          phonenumber: phoneNumber,
          metadata: {
            follow_up_date_time: "",
            ...restMetadata, // Add all other fields dynamically
          }
        };
      });
  
    return { contacts };
  }

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agent/get');
      const data = await res.json();
      console.log(data)
      setAgentList(data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } 
  };
  const fetchNumbers = async () => {
    try {
      const res = await fetch('/api/phoneNumber/get');
      const data = await res.json();
      console.log(data)

      const numbers = data.map((item: any) => item.phoneNumber);
      console.log(data)
  
      setFromNumberList(numbers);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } 
  };
  const fetchTimeZones = async () => {
    try {
      // const res = await axios.get('https://worldtimeapi.org/api/timezone');
      const res = await axios.get('https://timeapi.io/api/timezone/availabletimezones');
      setTimeZones(res.data);
    } catch (error) {
      console.error('Failed to fetch time zones:', error);
    }
  };
  
  useEffect(
    ()=>{
        fetchAgents();
        fetchNumbers();
        fetchTimeZones();
    }
    
    ,[])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFormData({ ...formData, recipientsFile: file });
  
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log(results);
          // setCsvData(results);
          const temp = transformDynamicData(results.data);
          setContact(temp.contacts);
          console.log(temp.contacts);
          const phoneNumbers = extractPhoneNumbers(results.data);
          setExtractedPhones(phoneNumbers); // <== store them
        },
      });
    }
  };
  // const CALL_URL = process.env.NEXT_PUBLIC_CALL_URL 
  // const API_URL = 'http://20.81.150.170:8000/process-numbers/';
  // const API_URL = 'https://numbersfetchfastapi-f4hba2arduckbmf8.eastus2-01.azurewebsites.net/process-numbers/';
  const API_URL =  process.env.NEXT_PUBLIC_CALL_URL!;
  const API_KEY = 'supersecretapikey123';
  
  const triggerFastApiCall = async ( campId : string ) => {
    try {
      const response = await axios.post(
        API_URL,
        {
          // phone_numbers: numbers, // match the expected payload
          agentId: formData.agent,
          fromPhone: formData.fromNumber,
          numberofFollowup: formData.noOfFollowUps,
          campaignid: campId,
          contacts:contact,
          
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      );
  
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
  };
  
  const [response, setResponse] = useState<any>(null);

  const handleClicker = async (e: React.FormEvent) => {
    const transformedData = {
      campaignCallName: formData.campaignName,
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
      console.log('✅ Campaign created:', res.data._id);
      console.log(extractedPhones);
      await triggerFastApiCall(res.data._id); 
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
        <label className="block text-sm font-medium mb-1">Campaign Name</label>
        <input
          type="text"
          value={formData.campaignName}
          onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}        
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter"
        />
      </div>
      <div className="flex justify-between">
      <div className="flex flex-col gap-1 w-[40%]">
      {/* <div className=""> */}
      <label className="w-32 text-sm font-medium mt-1 ">From Number</label>
        {/* <label className="block text-sm font-medium mb-1">From Number</label> */}

        <select 
            className="flex-1 p-1.5 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.fromNumber}
            onChange={(e) => setFormData({ ...formData, fromNumber: e.target.value })}
            required
        >
            <option value="">Select Number</option>
            {fromNumberList?.map((option: any, idx:any) => (
              <option key={idx} value={option} className='p-1'> {option} </option>
            ))}
        </select>
      </div>
      
      
      <div className="flex flex-col gap-1 w-[40%] mr-4">
      {/* <div className=""> */}
        <label className="w-32 text-sm font-medium mt-1  ">From Agent</label>
        <select 
            className="flex-1 p-1.5 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none "
            value={formData.agent}
            onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
            required
        >
            <option value="">Select agent</option>
            {agentList.map((agent:any) => (
            <option key={agent._id} value={agent.agentId}>
                {agent.agentName}
            </option>
            ))}
        </select>
        </div>

        </div>
      <div className="space-y-2">
        <div className="flex gap-2">
        <label className="block text-sm font-medium">Upload Recipients (CSV)</label>
        <a
          href="/data/template.csv"
          download
          className="text-sm text-blue-600 hover:underline"
        >
          Download Template
        </a>
        </div>


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
          <span>{fileName || "Choose a CSV"}</span>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex justify-between">
      <div className="flex flex-col gap-1 w-[40%] ">
      {/* <div className=""> */}
      <label className="w-32 text-sm font-medium mt-1 ">Follow Up (Yes/No)</label>
        {/* <label className="block text-sm font-medium mb-1">From Number</label> */}

        <select 
            className="flex-1 p-1.5 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.followUp}
            onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
            required
        >
            {/* <option value="">Select Number</option> */}
            {["Yes", "No"].map((option: any, idx:any) => (
              <option key={idx} value={option} className='p-1'> {option} </option>
            ))}
        </select>
      </div>
      {
        formData.followUp === "Yes" && (
          <div className="flex flex-col gap-1 w-[40%] mr-4">
          {/* <div className=""> */}
            <label className=" text-sm font-medium mt-1  ">Number of follow ups</label> 
            <input type="text" className="flex-1 p-1.5 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={(e)=>setFormData({...formData, noOfFollowUps: e.target.value})}/>
            </div>
        )
      }
      


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
                    timeZones={timeZones}
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

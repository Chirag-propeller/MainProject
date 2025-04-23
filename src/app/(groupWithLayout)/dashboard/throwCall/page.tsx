'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import AgentDetail from '@/components/throwCall/AgentDetail';
import axios from 'axios';
// import { useRouter } from 'next/router';


export default function ContactForm() {
  
  const [fromNumber, setFromNumber] = useState('');
  const [fromNumberList, setFromNumberList] = useState<string[]>([]);
  const [agentList, setAgentList] = useState([]);
  const [toNumber, setToNumber] = useState('');
  const [fromAgent, setFromAgent] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);


  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agentId = e.target.value;
    setFromAgent(agentId);
  
    // Find the full agent object
    const agent = agentList.find((a:any) => a._id === agentId);
    setSelectedAgent(agent || null);
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
  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agent/get');
      const data = await res.json();
      console.log(data)
      setAgentList(data);

    //   const numbers = data.map((item: any) => item.phoneNumber);
    //   console.log(numbers)
  
    //   setFromNumberList(numbers);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } 
  };

  // const API_URL = 'https://numbersfetchfastapi-f4hba2arduckbmf8.eastus2-01.azurewebsites.net/process-numbers/';
  const API_URL = process.env.NEXT_PUBLIC_CALL_URL!;
  const API_KEY = 'supersecretapikey123';
  
  const triggerFastApiCall = async () => {
    
    try {
      const response = await axios.post(
        API_URL,
        {
          // phone_numbers: numbers, 
          agentId: selectedAgent._id,
          fromPhone: fromNumber,
          contacts: [{
            phonenumber : toNumber,
            metadata : {},
          }]

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

  const handleClicker = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerFastApiCall();

  }

  useEffect(
    ()=>{
        fetchNumbers();
        fetchAgents();
    }
    
    ,[])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ fromNumber, toNumber, fromAgent });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Throw a Call</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 space-y-6 max-w-xl"
      >
        {/* From Number */}
        <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">From Number</label>


        <select 
            className="flex-1 p-2.5 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={fromNumber}
            onChange={(e) => setFromNumber(e.target.value)}
            required
        >
            <option value="">Select Number</option>
            {fromNumberList?.map((option: any, idx:any) => (
              <option key={idx} value={option} className='p-1'> {option} </option>
            ))}
        </select>
        {/* <SelectOptions options={fromNumberList} selectedOption={fromNumber} setOption={setFromNumber} /> */}
        </div>

        {/* To Number */}
        <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">To Number</label>
        <input
            type="text"
            placeholder="Enter phone number"
            value={toNumber}
            onChange={(e) => setToNumber(e.target.value)}
            className="flex-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
        />
        </div>


        <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">From Agent</label>
        <select 
            className="flex-1 p-2.5 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={fromAgent}
            onChange={handleAgentChange}
            required
        >
            <option value="">Select agent</option>
            {agentList.map((agent:any) => (
            <option key={agent._id} value={agent._id}>
                {agent.agentName}
            </option>
            ))}
        </select>
        </div>

        {/* {selectedAgent && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Agent Details</h3>
            <p><strong>Name:</strong> {selectedAgent.agentName}</p>
            <p><strong>LLM:</strong> {selectedAgent.llm}</p>
            <p><strong>Language:</strong> {selectedAgent.inputLanguage}</p>
            
        </div>
        )} */}

        {selectedAgent && (
          <AgentDetail selectedAgent={selectedAgent}/>
        )}
        
        {/* Submit */}
        <Button type="submit" className="w-full" onClick={handleClicker}>
          Submit
        </Button>
      </form>
    </div>
  );
}

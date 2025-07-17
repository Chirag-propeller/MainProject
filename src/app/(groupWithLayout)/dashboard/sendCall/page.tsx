'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import AgentDetail from '@/components/sendCall/AgentDetail';
import axios from 'axios';

export default function ContactForm() {
  const [fromNumber, setFromNumber] = useState('');
  const [fromNumberList, setFromNumberList] = useState<string[]>([]);
  const [agentList, setAgentList] = useState([]);
  const [workflowList, setWorkflowList] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any|null>(null);
  const [agentName , setAgentName] = useState("");
  
  const [toNumber, setToNumber] = useState('');
  const [fromAgent, setFromAgent] = useState('');
  const [fromWorkflow, setFromWorkflow] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [isSending, setIsSending] = useState(false);  // State to track if the call is being sent
  const [callSent, setCallSent] = useState(false);  // State to track if the call was sent successfully
  const [loading, setLoading] = useState(true);

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agentId = e.target.value;
    setFromAgent(agentId);
  
    const agent = agentList.find((a: any) => a.agentId === agentId);
    setSelectedAgent(agent || null);
    setSelectedWorkflow(null);
    setAgentName("outbound-caller");
  };
  const handleWorkflowChange = (e: React.ChangeEvent<HTMLSelectElement>)=>{
    const workflowId = e.target.value;

    const workflow = workflowList.find((flow)=> flow._id == workflowId)
    setSelectedWorkflow(workflow);
    setFromAgent("");
    setSelectedAgent(null);
    setAgentName("outbound-workflow");
  }

  useEffect (
    ()=> console.log(selectedWorkflow)
  ,[selectedWorkflow])

  const fetchNumbers = async () => {
    try {
      const res = await fetch('/api/phoneNumber/get');
      const data = await res.json();
      const numbers = data.map((item: any) => item.phoneNumber);
      setFromNumberList(numbers);
    } catch (err) {
      console.error('Failed to fetch numbers:', err);
    }
  };
  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/workflow/get-all');
      const data = await res.json();
      // const workflows = data.map((item: any) => item.phoneNumber);
      // setWorkflowList(workflows);
      setWorkflowList(data.data);
      console.log(data.data);
    } catch (err) {
      console.error('Failed to fetch numbers:', err);
    }
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

  const API_URL = process.env.NEXT_PUBLIC_CALL_URL!;
  const API_KEY = 'supersecretapikey123';
  
  const triggerFastApiCall = async () => {
    const user = await axios.get('/api/user/getCurrentUser');
    console.log(user);
    const credits = parseFloat(user.data?.credits?.$numberDecimal) || 0;
    const creditsUsed = parseFloat(user.data?.creditsUsed?.$numberDecimal) || 0;  
    // const credits = user.data?.credits || 0 ;
    // const creditsUsed = user.data?.creditsUsed || 0;
    if(credits - creditsUsed <= 0){
      alert("You have no credits left");
      setIsSending(false);
      return;
    }
    if((!selectedAgent) && (!selectedWorkflow)){
      alert("Select either agent or workflow.");
      setIsSending(false);
      return;
    }
    try {
      const response = await axios.post(
        // API_URL,
        "www.google.com",
        {
          agentId: selectedAgent?.agentId ? selectedAgent?.agentId : selectedWorkflow?._id,
          fromPhone: fromNumber,
          numberofFollowup: "0",
          campaignid: "",
          agentName: agentName ,
          // agentName : agentName ? "outbound-call" : "outbound-workflow",
          contacts: [{ phonenumber: toNumber, metadata: {} }],
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
    setIsSending(true);  // Disable the button and show loading message
    setCallSent(false);  // Reset the "call sent" state

    try {
      await triggerFastApiCall();
      setCallSent(true);  // Successfully sent the call
    } catch (error) {
      setCallSent(false);  // Handle error scenario
    }

    setTimeout(() => {
      setIsSending(false);  // Re-enable the button after 10 seconds
      setFromNumber('');
      setToNumber('');
      setFromAgent('');
      setSelectedAgent(null);  // Reset form to default values
      setSelectedWorkflow(null);
    }, 10000);  // Wait for 10 seconds before allowing another call
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchNumbers(), fetchAgents(), fetchWorkflows()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Send a Call</h2>
        <div className="flex justify-center items-center h-32">
          <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Send a Call</h2>

      <form onSubmit={handleClicker} className="bg-white rounded-2xl p-6 space-y-6 max-w-xl">
        {/* From Number */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700">From Number</label>
          <select
            className="w-[375px] p-2.5 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none truncate"
            value={fromNumber}
            onChange={(e) => setFromNumber(e.target.value)}
            required
            disabled={isSending}  // Disable while sending
            style={{ width: '375px', maxWidth: '375px', minWidth: '375px' }}
          >
            <option value="">Select Number</option>
            {fromNumberList.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* To Number */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700">To Number</label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={toNumber}
            onChange={(e) => setToNumber(e.target.value)}
            className="w-[375px] p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            style={{ width: '375px', maxWidth: '375px', minWidth: '375px' }}
            required
            disabled={isSending}  // Disable while sending
          />
        </div>

        {/* From Agent */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700 text-nowrap ">From Agent</label>
          <select
            className="w-[375px] p-2.5 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none truncate"
            value={fromAgent}
            onChange={handleAgentChange}
            // required
            disabled={isSending}  // Disable while sending
            style={{ width: '375px', maxWidth: '375px', minWidth: '375px' }}
          >
            <option value="">Select agent</option>
            {agentList.map((agent: any) => (
              <option key={agent._id} value={agent.agentId}>
                {agent.agentName}
              </option>
            ))}
          </select>
        </div>

        {/* Select workflow */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium text-gray-700 text-nowrap ">From Workflow</label>
          <select
            className="w-[375px] p-2.5 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none truncate"
            value={selectedWorkflow?._id || ""}
            onChange={handleWorkflowChange}
            // required
            disabled={isSending}  // Disable while sending
            style={{ width: '375px', maxWidth: '375px', minWidth: '375px' }}
            >
            <option value="">Select workflow</option>
            {workflowList.map((workflow: any) => (
              <option key={workflow._id} value={workflow._id}>
                {workflow.name}
              </option>
            ))}
          </select>
        </div>
            
                    {/* Agent Details */}
                    {selectedAgent && <AgentDetail selectedAgent={selectedAgent} />}
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSending}  // Disable the button while sending
        >
          {isSending ? 'Sending Call... Please wait' : 'Submit'}
        </Button>


        {/* Feedback Message */}
        {callSent && !isSending 
        // && (<div className="mt-4 text-green-600">Call has been sent successfully. Please wait...</div>)
        }
        
      </form>
    </div>
  );
}

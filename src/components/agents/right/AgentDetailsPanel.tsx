"use client";
import React, { useState } from 'react';
import { Agent } from '../types';
import { Button } from '@/components/ui/button';
import AgentGeneralTab from './AgentGeneralTab';
import AgentPromptTab from './AgentPromptTab';
import { useRouter } from 'next/navigation';

interface AgentDetailsPanelProps {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}

const AgentDetailsPanel: React.FC<AgentDetailsPanelProps> = ({ agent, setAgent }) => {
    const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Tabs available for this agent
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'prompt', label: 'Prompt' },
    { id: 'settings', label: 'Settings' },
    { id: 'conversations', label: 'Conversations' },
    { id: 'analytics', label: 'Analytics' }
  ];

  const handleUpdate = async () => {
    setIsUpdating(true);
    const res = await fetch(`/api/agent/${agent._id}`, {
        method: 'PUT', // or PATCH if your backend prefers
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });
    
      if (res.ok) {
        setIsUpdating(false);
        alert('Agent updated successfully');
        const data = await res.json();
        console.log('Agent updated:', data);
        router.refresh();
        // router.push('/dashboard/agents');
      } else {
        alert('Failed to update agent');
      }
    // setActiveTab('settings'); // Navigate to settings tab for updating
  };

  const handleTest = () => {
    setIsTesting(true);
    setActiveTab('conversations'); // Navigate to conversations tab for testing
  };

  return (
    <div className="flex flex-col bg-white rounded-lg border border-slate-200 h-full ">
      {/* Header with agent name, ID and buttons */}
      <div className="flex justify-between items-start p-4 pb-1">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">{agent.agentName}</h2>
          <p className="text-xs text-gray-500 mb-1 ">ID: {agent._id}</p>
        </div>
        <div className="flex space-x-2 gap-1">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleUpdate}
          >
            Update
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleTest}
          >
            Test
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex text-sm space-x-4 px-4 pb-2 border-b border-gray-300">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-0.5 cursor-pointer ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'general' && <AgentGeneralTab agent={agent} setAgent={setAgent} />}
        
        {activeTab === 'prompt' && <AgentPromptTab agent={agent} />}
        
        {activeTab === 'settings' && (
          <div className="text-center py-10 text-gray-500">
            {isUpdating ? (
              <div>
                <p className="mb-4">Update your agent settings here</p>
                <Button variant="ghost" size="sm" onClick={() => setIsUpdating(false)}>
                  Cancel Update
                </Button>
              </div>
            ) : (
              "Settings panel content will be displayed here"
            )}
          </div>
        )}
        
        {activeTab === 'conversations' && (
          <div className="text-center py-10 text-gray-500">
            {isTesting ? (
              <div>
                <p className="mb-4">Test your agent with a conversation</p>
                <div className="border rounded-md p-4 bg-gray-50 mx-auto max-w-lg">
                  <div className="flex flex-col space-y-3 mb-4">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-md self-start max-w-[80%]">
                      Hello! How can I help you today?
                    </div>
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 p-2 border rounded-l-md focus:outline-none"
                    />
                    <Button className="rounded-l-none">Send</Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setIsTesting(false)}
                  >
                    End Test
                  </Button>
                </div>
              </div>
            ) : (
              "Conversations history will be displayed here"
            )}
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="text-center py-10 text-gray-500">
            Analytics dashboard will be displayed here
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDetailsPanel; 
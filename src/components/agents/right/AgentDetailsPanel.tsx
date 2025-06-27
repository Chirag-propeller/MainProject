"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Agent } from '../types';
import { Button } from '@/components/ui/button';
import AgentGeneralTab from './AgentGeneralTab';
import AgentPromptTab from './AgentPromptTab';
import { useRouter } from 'next/navigation';
import Test from './Test';
import { Play, Pencil } from 'lucide-react';

interface AgentDetailsPanelProps {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}

const AgentDetailsPanel: React.FC<AgentDetailsPanelProps> = ({ agent, setAgent }) => {
    const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isNameUpdating, setIsNameUpdating] = useState(false);
  const [name, setName] = useState(agent.agentName);
  const nameRef = useRef<HTMLInputElement>(null);

  // Tabs available for this agent
  const tabs = [
    { id: 'general', label: 'General' },
    // { id: 'prompt', label: 'Prompt' },
    // { id: 'settings', label: 'Settings' },
    // { id: 'conversations', label: 'Conversations' },
    // { id: 'analytics', label: 'Analytics' }
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
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isNameUpdating && nameRef.current && !nameRef.current.contains(event.target as Node)) {
        setIsNameUpdating(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNameUpdating]);
  
  const handleCloseTest = () => {
    setIsTesting(false);
  };

  // Sync local state when agent changes from external source
  useEffect(() => {
    setName(agent.agentName);
  }, [agent.agentName]);

  // Debounced update for name input (avoids updating on every keystroke)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (agent.agentName !== name) {
        setAgent({...agent, agentName: name});
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeout);
  }, [name]);

  return (
    <div className="flex flex-col bg-white rounded-lg border border-t-0 border-gray-200 h-full ">
      {/* Header with agent name, ID and buttons */}
      <div className="flex justify-between items-start p-4 pb-1">
        <div className="flex flex-col">
          <div className='flex items-center gap-2'>
            {isNameUpdating ? ( 
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='border-gray-300 rounded-md border-1 px-2 py-1' ref={nameRef} />
            ) : (
              <h2 className="text-2xl text-ellipsis overflow-hidden max-w-124 text-nowrap font-semibold">{name}</h2>
            )}
            <Pencil className='w-4 h-4 text-gray-500 cursor-pointer' onClick={() => setIsNameUpdating(true)} />
          </div>
          
          <p className="text-xs text-gray-500 mb-1 ">ID: {agent._id}</p>
        </div>
        <div className="flex space-x-2 gap-1">
          <Button 
            variant="default" 
            size="md"
            onClick={handleUpdate}
            // className='px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-100 border-1 bg-indigo-600/50 hover:bg-indigo-600/50  border-gray-300'
            className='px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-100 border-1 '
          >
            Update
          </Button>
          {/* <Button 
            variant="secondary" 
            size="md"
            onClick={handleUpdate}
            className='border-gray-300 px-10 rounded-[4px]  border-1'
          >
            Update
          </Button> */}
          <Button 
            variant="secondary" 
            size="md"
            onClick={handleTest}
            className='px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-300 border-1 text-indigo-600 border-indigo-500 hover:bg-indigo-50'
          >
            Test
            <Play className='text-indigo-600 pl-1 w-4 h-4 ml-0.5' />
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
            "Conversations history will be displayed here"
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="text-center py-10 text-gray-500">
            Analytics dashboard will be displayed here
          </div>
        )}

      </div>

      {/* Test Modal */}
      <Test isOpen={isTesting} onClose={handleCloseTest} agent={agent} />
    </div>
  );
};

export default AgentDetailsPanel; 
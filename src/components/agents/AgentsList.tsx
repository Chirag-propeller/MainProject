"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Agent } from './types';
import { createAgent, deleteAgent } from './api';
import { Button } from '@/components/ui/button';
import { Trash2, Users } from 'lucide-react';

// Simple agent card component for the list
const AgentListItem = ({ 
  agent, 
  isSelected, 
  onDelete, 
  isDeleting 
}: { 
  agent: Agent; 
  isSelected: boolean; 
  onDelete: (id: string) => Promise<void>; 
  isDeleting: string | null;
}) => (
  <Link href={`/dashboard/agents/${agent._id}`} className={`block`}>
    <div className={`group p-2 px-2 border rounded-md mb-2 hover:border-indigo-500 transition-colors ${
      isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start ">
        <div>
          <h3 className="text-xs overflow-hidden text-ellipsis max-w-48 text-gray-900 text-nowrap">{agent.agentName}</h3>
          {/* <p className="text-[10px] overflow-hidden text-ellipsis w-32 text-gray-600 mt-1 text-nowrap">ID: {agent._id}</p> */}
          <p className="text-[10px] text-gray-600 mt-0.5">
            Created At: {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'Unknown'}
          </p>
        </div>

        {/* Delete button with animation */}
        <div 
            // className={
            //     `absolute right-2 top-2 transition-all duration-200  scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100`

            // }
            //     ${
            //   isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            // }`   }
          >
            <button
              disabled={isDeleting === agent._id}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(agent._id);
              }}
              className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
            >
              {isDeleting === agent._id ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>

        {/* <Button 
          variant="ghost" 
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation
            onDelete(agent._id);
          }}
          disabled={isDeleting === agent._id}
        >
          {isDeleting === agent._id ? 'Deleting...' : 'Delete'}
        </Button> */}
      </div>
    </div>
  </Link>
);

// Main AgentsList component
const AgentsList = ({ agents, selectedId, setAgents }: { agents: Agent[], selectedId?: string, setAgents: (agents: Agent[]) => void }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();

  // Handle creating a new agent
  const handleCreateAgent = async () => {
    try {
      setLoading(true);
      const newAgent = await createAgent({ 
        agentName: 'New Agent',
        llm: "OpenAI",
        llmModel: "gpt-4o-mini",
        inputLanguage: "en-US",
        stt: "Deepgram",
        sttModel: "nova-2",
        sttLanguage: "en-US",
        tts: "AWS",
        ttsVoiceName: "Amy",
        ttsModel: "generative",
        speed: 1,
        welcomeMessage: "Hi",
        knowledgeBaseAttached: false,
        knowledgeBase: [],
        prompt: "You are a helpful assistant",
        gender: "Female",
        ttsLanguage: "en-GB"
    });
      // Navigate to the new agent page
      setAgents([newAgent.data, ...agents]);
      router.push(`/dashboard/agents/${newAgent.data._id}`);
    } catch (err) {
      console.error('Failed to create agent:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an agent
  const handleDeleteAgent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    // let agentId = id;
    // if(id === selectedId) {
    //     if(agents[0]._id === id) {
    //         agentId = agents[1]._id;
    //     } else {
    //         agentId = agents[0]._id;
    //     }
    // }
    
    setDeleteLoading(id);
    
    try {
      const success = await deleteAgent(id);
    //   console.log("Agent deleted successfully handleDeleteAgent" , success);
      
      if (success) {
        alert("Agent deleted successfully");
        setAgents(agents.filter(agent => agent._id !== id));
        router.push(`/dashboard/agents/${agents[0]._id}`);
        // router.refresh();
        // Refresh the page to get updated data
        // router.push('/dashboard/agents');
        // const agent = agents[0];
        // setSelectedId(agentId);
        // router.push(`/dashboard/agents/${agentId}`);
        
        // If we deleted the currently viewed agent, go back to the main agents page
        if (selectedId === id) {
          router.push('/dashboard/agents');
        }
      } else {
        alert('Failed to delete agent');
        // router.refresh();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="w-full border-gray-200 border-t-0 flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
      {/* Header with title and create button */}
      <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <div className='flex gap-1.5'>
          <Users className='w-3.5 h-3.5  self-center text-indigo-600' />
          <h1 className="text-lg  self-center text-indigo-600">Agents</h1>
        </div>

        <Button 
          onClick={handleCreateAgent}
          disabled={loading}
          className='px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-300 '
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </div>

      {/* List of agents */}
      <div className="flex-1 overflow-y-auto p-3">
        {agents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No agents found. Click Create to add your first agent.
          </div>
        ) : (
          agents.map(agent => (
            <AgentListItem 
              key={agent._id}
              agent={agent}
              isSelected={selectedId === agent._id}
              onDelete={handleDeleteAgent}
              isDeleting={deleteLoading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AgentsList; 
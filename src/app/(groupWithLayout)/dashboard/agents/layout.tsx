"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AgentsList from '@/components/agents/AgentsList';
import { Agent } from '@/components/agents/types';
import { fetchAgents } from '@/components/agents/api';

// The layout for the agents section of the dashboard
export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  

  // Extract the selected agent ID from the URL
  const selectedId = pathname?.split('/').pop();
  // const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch the list of agents when the component mounts
  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      try {
        const agentsData = await fetchAgents();
        setAgents(agentsData);
        console.log("agentsData", agentsData);
        if(agentsData.length > 0) {
          router.push(`/dashboard/agents/${agentsData[0]._id}`);
        }
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  return (
    <div className="flex h-full" style={{ height: 'calc(100vh - 12px)' }}>
      {/* Left sidebar with agents list (25% width) */}
      <div className="w-1/4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <AgentsList agents={agents} setAgents={setAgents} selectedId={selectedId} />
        )}
      </div>
      
      {/* Main content area (75% width) */}
      <div className="w-3/4 overflow-auto">
        {children}
      </div>
    </div>
  );
} 
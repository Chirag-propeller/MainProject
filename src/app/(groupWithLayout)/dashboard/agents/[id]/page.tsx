"use client";
import React, { useEffect, useState } from "react";
import { Agent } from "@/components/agents/types";
import { fetchAgentById } from "@/components/agents/api";
import { useParams } from "next/navigation";
import AgentDetailsPanel from "@/components/agents/right/AgentDetailsPanel";
import { useAgentsContext } from "../layout";
import AgentPageSkeletonLoader from "@/components/agents/AgentPageSkeletonLoader";

// This component displays the details of a single agent
export default function AgentDetailsPage() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const agentId = params?.id as string;
  const { updateAgentInList } = useAgentsContext();

  // Fetch the agent details when the component mounts or ID changes
  useEffect(() => {
    const loadAgent = async () => {
      setLoading(true);
      try {
        // This is a new function we need to add to the API
        const agentData = await fetchAgentById(agentId);
        // console.log("agentData --  --- ", agentData);
        setAgent(agentData);
      } catch (error) {
        console.error("Failed to load agent:", error);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      loadAgent();
    }
  }, [agentId]);

  // Function to handle agent updates and propagate to the list
  const handleAgentUpdate = (updatedAgent: Agent) => {
    setAgent(updatedAgent);
    updateAgentInList(updatedAgent);
  };

  // Show loading state
  if (loading) {
    return <AgentPageSkeletonLoader />;
  }

  // Show error if agent not found
  if (!agent) {
    return (
      <div className="text-center py-10 text-red-500 bg-white dark:bg-gray-900 dark:text-red-400">
        Agent not found. It may have been deleted or the ID is invalid.
      </div>
    );
  }

  // Show agent details panel
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-full">
      <AgentDetailsPanel agent={agent} setAgent={handleAgentUpdate} />
    </div>
  );
}

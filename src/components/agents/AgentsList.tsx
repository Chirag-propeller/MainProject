"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Agent } from "./types";
import { createAgent, deleteAgent } from "./api";
import { Button } from "@/components/ui/button";
import { Trash2, Users } from "lucide-react";

// Simple agent card component for the list
const AgentListItem = ({
  agent,
  isSelected,
  onDelete,
  isDeleting,
}: {
  agent: Agent;
  isSelected: boolean;
  onDelete: (id: string) => Promise<void>;
  isDeleting: string | null;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Hide on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowConfirm(false);
      }
    };

    if (showConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirm]);

  return (
    <Link href={`/dashboard/agents/${agent._id}`} className="block relative">
      <div
        className={`p-2 px-2 border rounded-[6px] mb-2 hover:border-indigo-500 transition-colors ${
          isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
        }`}
      >
        <div className="flex justify-between items-start ">
          {/* Left: Agent Info */}
          <div>
            <h3 className="text-[14px] overflow-hidden text-ellipsis max-w-48 text-gray-900 text-nowrap p-2">
              {agent.agentName}
            </h3>
            <p className="text-[10px] text-gray-600 pl-2">
              Created At:{" "}
              {agent.createdAt
                ? new Date(agent.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>

          {/* Right: Trash Icon + Confirm */}
          <div className="relative" ref={popoverRef}>
            <button
              disabled={isDeleting === agent._id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm((prev) => !prev);
              }}
              className="text-gray-500 hover:text-red-600 transition-colors p-3 pt-5 group"
            >
              {isDeleting === agent._id ? (
                <div className="w-4 h-4 border-t-transparent animate-spin"></div>
              ) : (
                <div className="w-6 h-6 relative">
                  <svg
                    viewBox="0 0 30 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full text-current"
                  >
                    {/* Lid */}
                    <g className="transition-transform duration-300 ease-in-out group-hover:-translate-y-0.5 group-hover:-rotate-20 origin-center">
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <path d="M3 6h18" />
                    </g>

                    {/* Body */}
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />

                    {/* Trash lines */}
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </div>
              )}
            </button>

            {/* Confirmation Box */}
            {showConfirm && (
              <div className="absolute top-8 right-0 w-max bg-white border border-gray-300 shadow-lg rounded-md z-50">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(agent._id);
                    setShowConfirm(false);
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-normal px-4 py-2 m-0.5 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Delete Agent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Main AgentsList component
const AgentsList = ({
  agents,
  selectedId,
  setAgents,
}: {
  agents: Agent[];
  selectedId?: string;
  setAgents: (agents: Agent[]) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();

  // Handle creating a new agent
  const handleCreateAgent = async () => {
    try {
      setLoading(true);
      const newAgent = await createAgent({
        agentName: "New Agent",
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
        ttsLanguage: "en-GB",
      });
      // Navigate to the new agent page
      setAgents([newAgent.data, ...agents]);
      router.push(`/dashboard/agents/${newAgent.data._id}`);
    } catch (err) {
      console.error("Failed to create agent:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an agent
  const handleDeleteAgent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;
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
        setAgents(agents.filter((agent) => agent._id !== id));
        router.push(`/dashboard/agents/${agents[0]._id}`);
        // router.refresh();
        // Refresh the page to get updated data
        // router.push('/dashboard/agents');
        // const agent = agents[0];
        // setSelectedId(agentId);
        // router.push(`/dashboard/agents/${agentId}`);

        // If we deleted the currently viewed agent, go back to the main agents page
        if (selectedId === id) {
          router.push("/dashboard/agents");
        }
      } else {
        alert("Failed to delete agent");
        // router.refresh();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div
      className="w-full border-gray-200 border-t-0 flex flex-col"
      style={{ height: "100%", overflow: "hidden" }}
    >
      {/* Header with title and create button */}
      <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex gap-1.5">
          <Users className="w-3.5 h-3.5  self-center text-indigo-600" />
          <h1 className="text-lg  self-center text-indigo-600">Agents</h1>
        </div>

        <Button
          onClick={handleCreateAgent}
          disabled={loading}
          className="px-5 py-1 text-md rounded-[4px]"
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>

      {/* List of agents */}
      <div className="flex-1 overflow-y-auto p-3">
        {agents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No agents found. Click Create to add your first agent.
          </div>
        ) : (
          agents.map((agent) => (
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

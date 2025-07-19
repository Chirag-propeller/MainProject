"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Agent } from "./types";
import { createAgent, deleteAgent } from "./api";
import { Button } from "@/components/ui/button";
import { Copy, Users } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
// Simple agent card component for the list
const AgentListItem = ({
  agent,
  isSelected,
  onDelete,
  onDuplicate, // NEW
  isDeleting,
  isDuplicating,
}: {
  agent: Agent;
  isSelected: boolean;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (agent: Agent) => Promise<void>; // NEW
  isDeleting: string | null;
  isDuplicating: string | null;
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
        className={`p-2 px-2 border rounded-[6px] mb-1 transition-colors ${
          isSelected
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-500 dark:hover:border-indigo-400"
        }`}
      >
        <div className="flex justify-between items-start ">
          {/* Left: Agent Info */}
          <div>
            <h3 className="text-[14px] overflow-hidden text-ellipsis max-w-32 text-gray-900 dark:text-white text-nowrap p-1">
              {agent.agentName}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 pl-1">
              Created At:{" "}
              {agent.createdAt
                ? new Date(agent.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>

          {/* Right: Trash Icon + Confirm */}
          <div className="relative gap-2" ref={popoverRef}>
            <button
              disabled={isDuplicating === agent._id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDuplicate(agent);
              }}
              className="text-gray-500 hover:text-indigo-600 transition-colors p-1 pt-1"
            >
              {isDuplicating === agent._id ? (
                <div className="w-6 h-6 border-t-transparent animate-spin"></div>
              ) : (
                <div className="w-6 h-6 relative">
                  <Copy className="pr-2" />
                </div>
              )}
            </button>
            <button
              disabled={isDeleting === agent._id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm((prev) => !prev);
              }}
              className="text-gray-500 hover:text-red-600 transition-colors p-1 pt-5 group"
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
              <div className="absolute top-8 right-0 w-max bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-[6px] z-25">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(agent._id);
                    setShowConfirm(false);
                  }}
                  className="text-red-600 hover:text-red-700 dark:hover:text-red-400 text-[10px] font-light px-1 pb-1 transition-colors rounded-[6px]"
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
  collapsed,
}: {
  agents: Agent[];
  selectedId?: string;
  setAgents: (agents: Agent[]) => void;
  collapsed?: boolean;
}) => {
  // const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [dupLoading, setDupLoading] = useState<string | null>(null);
  const router = useRouter();

  // Handle creating a new agent
  // const handleCreateAgent = async () => {
  //   try {
  //     setLoading(true);
  //     const newAgent = await createAgent({
  //       agentName: "New Agent",
  //       llm: "OpenAI",
  //       llmModel: "gpt-4o-mini",
  //       inputLanguage: "en-US",
  //       stt: "Deepgram",
  //       sttModel: "nova-2",
  //       sttLanguage: "en-US",
  //       tts: "AWS",
  //       ttsVoiceName: "Amy",
  //       ttsModel: "generative",
  //       speed: 1,
  //       welcomeMessage: "Hi",
  //       knowledgeBaseAttached: false,
  //       knowledgeBase: [],
  //       prompt: "You are a helpful assistant",
  //       gender: "Female",
  //       ttsLanguage: "en-GB",
  //     });
  //     // Navigate to the new agent page
  //     setAgents([newAgent.data, ...agents]);
  //     router.push(`/dashboard/agents/${newAgent.data._id}`);
  //   } catch (err) {
  //     console.error("Failed to create agent:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleCreateAgent = async () => {
    setCreateLoading(true);
    try {
      const res = await createAgent({
        agentName: "New Agent",
        llm: "OpenAI",
        llmModel: "gpt-4o-mini",
        inputLanguage: "en-US",
        stt: "Deepgram",
        sttModel: "nova-2",
        sttLanguage: "en-US",
        tts: "Google",
        ttsVoiceName: "en-IN-Chirp3-HD-Aoede",
        ttsModel: "Chirp3-HD",
        speed: 1,
        welcomeMessage: "Hi",
        knowledgeBaseAttached: false,
        knowledgeBase: [],
        prompt: "You are a helpful assistant",
        gender: "Female",
        ttsLanguage: "en-IN",
      });

      setAgents([res.data, ...agents]);
      router.push(`/dashboard/agents/${res.data._id}`);
    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDuplicateAgent = async (src: Agent) => {
    setDupLoading(src._id);
    try {
      const {
        _id,
        createdAt,
        updatedAt,
        __v, // mongoose version field if any
        ...cloneable
      } = src as any;

      const duplicatedAgent = {
        ...cloneable,
        agentName: `${src.agentName} (copy)`,
        agentId: Date.now().toString(), // generate new unique agentId
        knowledgeBase: Array.isArray(src.knowledgeBase)
          ? [...src.knowledgeBase]
          : [],
        knowledgeBaseAttached: src.knowledgeBaseAttached ?? false,
      };

      console.log("Duplicated agent payload →", duplicatedAgent);

      const res = await createAgent(duplicatedAgent);

      setAgents([res.data, ...agents]);
      router.push(`/dashboard/agents/${res.data._id}`);
    } catch (err) {
      console.error("Duplication failed:", err);
      alert("Could not duplicate agent.");
    } finally {
      setDupLoading(null);
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
      if (success) {
        const updatedAgents = agents.filter((agent) => agent._id !== id);
        setAgents(updatedAgents);

        if (selectedId === id) {
          // If the deleted agent was the selected one
          if (updatedAgents.length > 0) {
            // Navigate to the first available agent
            router.push(`/dashboard/agents/${updatedAgents[0]._id}`);
          } else {
            // No agents left
            router.push(`/dashboard/agents`);
          }
        }
      } else {
        alert("Failed to delete agent");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div
      className="w-full border-gray-200 dark:border-gray-800 border-t-0 flex flex-col bg-white dark:bg-gray-900"
      style={{ height: "100%", overflow: "hidden" }}
    >
      {/* Header with title and create button */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 p-4 pt-6 border-b border-gray-200 dark:border-gray-800 flex flex-row justify-between items-center gap-2">
        <div className="flex gap-1.5 items-center">
          <Users className="w-4 h-4 self-center text-indigo-600" />
          <h1 className="text-base text-[16px]sm:text-sm self-center text-indigo-600 dark:text-indigo-500">
            Agents
          </h1>
        </div>
        <Button
          onClick={handleCreateAgent}
          disabled={createLoading}
          className="flex items-center justify-center w-8 h-8 p-0 rounded-[4px] text-lg lg:w-auto lg:h-auto lg:px-5 lg:py-1 lg:rounded-[4px] lg:text-md bg-indigo-500 dark:bg-indigo-800"
        >
          {createLoading ? (
            <>
              <span className="hidden lg:inline">Creating...</span>
              <span className="inline lg:hidden animate-spin">+</span>
            </>
          ) : (
            <>
              <span className="hidden lg:inline">Create</span>
              <span className="inline lg:hidden text-lg font-bold">+</span>
            </>
          )}
        </Button>
      </div>

      {/* List of agents */}
      <div className="flex-1 overflow-y-auto p-3 bg-white dark:bg-gray-900">
        {agents.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-300">
            No agents found. Click Create to add your first agent.
          </div>
        ) : (
          agents.map((agent) => (
            <AgentListItem
              key={agent._id}
              agent={agent}
              isSelected={selectedId === agent._id}
              onDelete={handleDeleteAgent}
              onDuplicate={handleDuplicateAgent}
              isDeleting={deleteLoading}
              isDuplicating={dupLoading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AgentsList;

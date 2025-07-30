"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Agent } from "./types";
import { createAgent, deleteAgent } from "./api";
import { Button } from "@/components/ui/button";
import { Copy, Users, MoreVertical, Pin, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { languageFillers as fillers } from "./Constants";

// Simple agent card component for the list
const AgentListItem = ({
  agent,
  isSelected,
  onDelete,
  onDuplicate,
  isDeleting,
  isDuplicating,
  onPin,
  isPinned,
}: {
  agent: Agent;
  isSelected: boolean;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (agent: Agent) => Promise<void>;
  isDeleting: string | null;
  isDuplicating: string | null;
  onPin: (id: string) => void;
  isPinned: boolean;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

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

          {/* Right: Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDropdownOpen((open) => !open);
              }}
              className="p-1 text-gray-500 hover:text-indigo-600"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-7 w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-[6px] z-30 flex flex-col py-1">
                <button
                  disabled={isDuplicating === agent._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onDuplicate(agent);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button
                  disabled={isDeleting === agent._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onDelete(agent._id);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onPin(agent._id);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  <Pin className="w-4 h-4" /> {isPinned ? "Unpin" : "Pin"}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Pin icon at bottom right if pinned */}
        {isPinned && (
          <div className="absolute bottom-2 right-4">
            <Pin className="w-3 h-3 text-gray-400" fill="#adb5bd" />
          </div>
        )}
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
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [dupLoading, setDupLoading] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pinnedAgentIds");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const router = useRouter();

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/agents/get");
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleCreateAgent = async () => {
    setCreateLoading(true);
    const languageFillers = fillers["en-IN"]["Female"];
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
        languageFillers: languageFillers,
        callHangup: false,
        callHangupPhase: [],
        hangupMessage: "",
        maxCallDuration: 1200,
        numberTransfer: false,
        numberTransferNumber: "",
        userAwayTimeOut: 10,
        isLanguageFillersActive: false,
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

  // Pin/unpin agent
  const handlePinAgent = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [id, ...prev]
    );
  };

  useEffect(() => {
    // Check for your JWT token (adjust the regex if your cookie name is different)
    const isLoggedIn =
      typeof document !== "undefined" && document.cookie.includes("token=");

    if (isLoggedIn) {
      fetch("/api/user/pinnedAgents")
        .then((res) => res.json())
        .then((ids) => {
          if (Array.isArray(ids)) setPinnedIds(ids);
        });
    } else {
      // Fallback to localStorage for guests
      const stored = localStorage.getItem("pinnedAgentIds");
      setPinnedIds(stored ? JSON.parse(stored) : []);
    }
  }, []);

  useEffect(() => {
    const isLoggedIn =
      typeof document !== "undefined" && document.cookie.includes("token=");

    if (isLoggedIn) {
      fetch("/api/user/pinnedAgents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinnedAgents: pinnedIds }),
      });
    } else {
      localStorage.setItem("pinnedAgentIds", JSON.stringify(pinnedIds));
    }
  }, [pinnedIds]);

  // Sort agents: pinned first, then others
  const sortedAgents = [
    ...agents.filter((a) => pinnedIds.includes(a._id)),
    ...agents.filter((a) => !pinnedIds.includes(a._id)),
  ];

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
        {sortedAgents.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-300">
            No agents found. Click Create to add your first agent.
          </div>
        ) : (
          sortedAgents.map((agent) => (
            <AgentListItem
              key={agent._id}
              agent={agent}
              isSelected={selectedId === agent._id}
              onDelete={handleDeleteAgent}
              onDuplicate={handleDuplicateAgent}
              isDeleting={deleteLoading}
              isDuplicating={dupLoading}
              onPin={handlePinAgent}
              isPinned={pinnedIds.includes(agent._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AgentsList;

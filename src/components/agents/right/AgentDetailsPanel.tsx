"use client";
import React, { useState, useEffect, useRef } from "react";
import { Agent } from "../types";
import { Button } from "@/components/ui/button";
import AgentGeneralTab from "./AgentGeneralTab";
import AgentPromptTab from "./AgentPromptTab";
import { useRouter } from "next/navigation";
import Test from "./Test";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import _ from "lodash";
import Pricing from "./general/Pricing";

interface AgentDetailsPanelProps {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}

const AgentDetailsPanel: React.FC<AgentDetailsPanelProps> = ({
  agent,
  setAgent,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isNameUpdating, setIsNameUpdating] = useState(false);
  const [name, setName] = useState(agent.agentName);
  const [initialAgent, setInitialAgent] = useState<Agent>(() =>
    _.cloneDeep(agent)
  );
  const [isModified, setIsModified] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  // Tabs available for this agent
  const tabs = [
    { id: "general", label: "General" },
    // { id: "prompt", label: "Prompt" },
    // { id: "settings", label: "Settings" },
    // { id: "conversations", label: "Conversations" },
    // { id: "analytics", label: "Analytics" },
  ];
  useEffect(() => {
    setInitialAgent(_.cloneDeep(agent));
    setIsModified(false);
  }, [agent._id]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    const newBaseline = _.cloneDeep(agent);
    const res = await fetch(`/api/agent/${agent._id}`, {
      method: "PUT", // or PATCH if your backend prefers
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agent),
    });

    if (res.ok) {
      const data = await res.json();
      setInitialAgent(newBaseline);
      setIsModified(false);
      setIsUpdating(false);
      alert("Agent updated successfully");
      console.log("Agent updated:", data);
      router.refresh();
      // router.push('/dashboard/agents');
    } else {
      // setIsUpdating(false);
      alert("Failed to update agent");
    }
    // setActiveTab('settings'); // Navigate to settings tab for updating
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsModified(!_.isEqual(agent, initialAgent));
    }, 300);

    return () => clearTimeout(timeout);
  }, [agent, initialAgent]);

  const handleTest = () => {
    setIsTesting(true);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isNameUpdating &&
        nameRef.current &&
        !nameRef.current.contains(event.target as Node)
      ) {
        setIsNameUpdating(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    const timeout = setTimeout(async () => {
      if (agent.agentName !== name) {
        const updatedAgent = { ...agent, agentName: name };
        setAgent(updatedAgent); // local update

        // Backend update
        await fetch(`/api/agent/${agent._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAgent),
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [agent, name, setAgent]);

  return (
    <div className="flex flex-col bg-gray-50 border border-t-0 border-gray-200 h-full p-5">
      {/* Header with agent name, ID and buttons */}
      <div className="flex justify-between items-start flex-wrap gap-y-1">
        {/* Left: Agent Name and ID */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {isNameUpdating ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300 rounded-md border px-2 py-1"
                ref={nameRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsNameUpdating(false);
                    nameRef.current?.blur();
                  }
                }}
              />
            ) : (
              <h2 className="text-2xl font-semibold truncate overflow-hidden text-ellipsis max-w-80 text-gray-900 text-nowrap">
                {name}
              </h2>
            )}
            <FaRegEdit
              className="w-4 h-4 text-gray-500 cursor-pointer"
              onClick={() => setIsNameUpdating(true)}
            />
          </div>
          <div className="flex justify-between items-center px-1 mt-1">
            <p className="text-xs text-gray-500">ID: {agent._id}</p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex space-x-2 mt-1">
          <Button
            variant="default"
            size="md"
            onClick={handleUpdate}
            className="px-5 py-1 text-md rounded-[4px]"
            disabled={!isModified}
          >
            Update
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleTest}
            className="px-3 py-1 text-md rounded-[4px] border text-indigo-600 border-indigo-500 hover:bg-indigo-50 bg-white"
          >
            Test
            <MdKeyboardArrowRight className="text-indigo-600 w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex text-sm space-x-4 px-4 pb-2 py-4 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={` cursor-pointer ${activeTab === tab.id ? "text-indigo-600 border-b-1 border-indigo-600" : "text-gray-600"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "general" && (
          <AgentGeneralTab agent={agent} setAgent={setAgent} />
        )}

        {activeTab === "prompt" && <AgentPromptTab agent={agent} />}

        {activeTab === "settings" && (
          <div className="text-center py-10 text-gray-500">
            {isUpdating ? (
              <div>
                <p className="mb-4">Update your agent settings here</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUpdating(false)}
                >
                  Cancel Update
                </Button>
              </div>
            ) : (
              "Settings panel content will be displayed here"
            )}
          </div>
        )}

        {activeTab === "conversations" && (
          <div className="text-center py-10 text-gray-500">
            Conversations history will be displayed here
          </div>
        )}

        {activeTab === "analytics" && (
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

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
    try {
      // // Only update if name has actually changed
      // if (agent.agentName === name) {
      //   setIsUpdating(false);
      //   return;
      // }

      // Create updated agent with current name
      const updatedAgent = { ...agent, agentName: name };
      const newBaseline = _.cloneDeep(updatedAgent);

      const res = await fetch(`/api/agent/${agent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAgent),
      });

      if (res.ok) {
        const data = await res.json();
        // Update the agent in the parent component to reflect in the agents list
        setAgent(updatedAgent);
        setInitialAgent(newBaseline);
        setIsModified(false);
        setIsUpdating(false);
        alert("Agent updated successfully");
        // console.log("Agent updated:", data);
        router.refresh();
      } else {
        setIsUpdating(false);
        alert("Failed to update agent");
      }
    } catch (error) {
      setIsUpdating(false);
      alert("Failed to update agent");
      console.error("Update error:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Check if agent has changed OR if name has changed
      const agentChanged = !_.isEqual(agent, initialAgent);
      const nameChanged = agent.agentName !== name;
      setIsModified(agentChanged || nameChanged);
    }, 300);

    return () => clearTimeout(timeout);
  }, [agent, initialAgent, name]);

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
  // useEffect(() => {
  //   const timeout = setTimeout(async () => {
  //     if (agent.agentName !== name) {
  //       const updatedAgent = { ...agent, agentName: name };
  //       setAgent(updatedAgent); // local update

  //       // Backend update
  //       await fetch(`/api/agent/${agent._id}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatedAgent),
  //       });
  //     }
  //   }, 500);

  //   return () => clearTimeout(timeout);
  // }, [agent, name, setAgent]);

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 border border-t-0 border-gray-200 dark:border-gray-800 h-screen p-5">
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
                className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md border px-2 py-1"
                ref={nameRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsNameUpdating(false);
                    nameRef.current?.blur();
                  }
                }}
              />
            ) : (
              <h2 className="text-2xl font-semibold truncate overflow-hidden text-ellipsis max-w-80 text-gray-900 dark:text-white text-nowrap">
                {name}
              </h2>
            )}
            <FaRegEdit
              className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
              onClick={() => setIsNameUpdating(true)}
            />
          </div>
          <div className="flex justify-between items-center px-1 mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID: {agent._id}
            </p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex space-x-2 mt-1">
          <Button
            variant="default"
            size="md"
            onClick={handleUpdate}
            className="px-5 py-1 text-md rounded-[4px] bg-indigo-500 dark:bg-indigo-800"
            disabled={!isModified}
          >
            Update
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleTest}
            className="px-3 py-1 text-md rounded-[4px] border text-indigo-600 border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 dark:text-indigo-300"
          >
            Test
            <MdKeyboardArrowRight className="text-indigo-600 dark:text-indigo-300 w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex text-sm space-x-4 px-4 pb-2 py-4 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={` cursor-pointer ${activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400 border-b-1 border-indigo-600 dark:border-indigo-400" : "text-gray-600 dark:text-gray-300"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-x-hidden">
        {activeTab === "general" && (
          <AgentGeneralTab agent={agent} setAgent={setAgent} />
        )}

        {activeTab === "prompt" && <AgentPromptTab agent={agent} />}

        {activeTab === "settings" && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-300">
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
          <div className="text-center py-10 text-gray-500 dark:text-gray-300">
            Conversations history will be displayed here
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-300">
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

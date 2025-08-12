"use client";
import React, { useState, useRef, useEffect } from "react";
import { Campaign, Agent } from "../types";
import { Button } from "@/components/ui/button";
import { Pencil, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import CampaignGeneralTab from "@/components/campaigns/right/CampaignGeneralTab";
import CampaignAnalytics from "./CampaignAnalytics";
import { toast } from "react-hot-toast";
import axios from "axios";
import Analytics from "./analytics/Analytics";
import { FaRegEdit } from "react-icons/fa";
import _ from "lodash";
import { useCampaignStore } from "@/store/campaignStore";
import CampaignCallHistoryEmbedded from "./callHistory/CampaignCallHistoryEmbedded";
import FlexibleCallHistory from "@/components/callHistory/FlexibleCallHistory";

interface CampaignDetailsPanelProps {
  campaign: Campaign;
  // setCampaign: (campaign: Campaign) => void;
  agents: Agent[];
}

interface Workflow {
  _id: string;
  name: string;
  globalPrompt: string;
  nodes: any[];
  edges: any[];
  globalNodes: string[];
  createdAt: string;
  updatedAt: string;
}

const CampaignDetailsPanel: React.FC<CampaignDetailsPanelProps> = ({
  campaign,
  // setCampaign,
  agents,
}) => {
  const { updateCampaign } = useCampaignStore();
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isNameUpdating, setIsNameUpdating] = useState(false);
  const [name, setName] = useState(campaign.campaignCallName);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialCampaign, setInitialCampaign] = useState<Campaign>(() =>
    _.cloneDeep(campaign)
  );
  const { campaigns } = useCampaignStore();
  const [currentCampaign, setCurrentCampaign] = useState<Campaign>(campaign);

  // Workflow-related state variables
  const [workflowList, setWorkflowList] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [agentName, setAgentName] = useState<string>("outbound-caller");

  useEffect(() => {
    const fromStore = campaigns.find((c) => c._id === campaign._id);
    if (fromStore) setCurrentCampaign(fromStore);
  }, [campaigns, campaign._id]);

  const nameRef = useRef<HTMLInputElement>(null);

  // Check if campaign is draft and therefore editable
  const isDraft = campaign.status === "draft";
  const isEditable = isDraft;

  // Tabs available for this campaign
  const tabs = [
    { id: "general", label: "General" },
    { id: "analytics", label: "Analytics" },
    { id: "call-history", label: "Call History" },
  ];

  const statusStyles: Record<string, string> = {
    ongoing: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
  };

  // Fetch workflows from API
  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/workflow/get-all');
      const data = await res.json();
      if (data.success) {
        setWorkflowList(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
    }
  };

  // Initialize workflows on component mount
  useEffect(() => {
    fetchWorkflows();
  }, []);

  // Initialize selectedWorkflow and agentName based on current campaign
  useEffect(() => {
    if (workflowList.length > 0 && currentCampaign.agentId) {
      // Check if the current agentId is actually a workflow ID
      const workflow = workflowList.find((flow) => flow._id === currentCampaign.agentId);
      if (workflow) {
        setSelectedWorkflow(workflow);
        setAgentName("outbound-workflow");
      } else {
        // Check if it's an agent ID
        const agent = agents.find((a) => a.agentId === currentCampaign.agentId);
        if (agent) {
          setSelectedWorkflow(null);
          setAgentName("outbound-caller");
        }
      }
    }
  }, [workflowList, currentCampaign.agentId, agents]);

  // Handle agent selection
  const handleAgentChange = (agentId: string) => {
    setSelectedWorkflow(null);
    setAgentName("outbound-caller");
    // Update campaign with agent ID
    const updatedCampaign = { ...currentCampaign, agentId };
    setCurrentCampaign(updatedCampaign);
  };

  // Handle workflow selection
  const handleWorkflowChange = (workflowId: string) => {
    const workflow = workflowList.find((flow) => flow._id === workflowId);
    setSelectedWorkflow(workflow || null);
    setAgentName("outbound-workflow");
    // Update campaign with workflow ID as agentId
    const updatedCampaign = { ...currentCampaign, agentId: workflowId };
    setCurrentCampaign(updatedCampaign);
  };

  const handleUpdate = async () => {
    if (!hasChanges && !isNameUpdating) {
      return;
    }
    setIsUpdating(true);
    try {
      const updatedCampaign = { ...currentCampaign, campaignCallName: name };
      console.log("📤 Sending campaign update:", updatedCampaign);

      const response = await axios.put(
        "/api/createCampaign/update",
        updatedCampaign
      );
      console.log("📥 Update response:", response.data);

      if (response.data.success) {
        // setCampaign(response.data.data);
        updateCampaign(response.data.data);
        setInitialCampaign(_.cloneDeep(response.data.data));
        setHasChanges(false);
        setIsNameUpdating(false);
        toast.success("Campaign updated successfully");
      } else {
        toast.error("Failed to update campaign");
      }
    } catch (error) {
      console.error("❌ Failed to update campaign:", error);
      toast.error("Failed to update campaign");
    } finally {
      setIsUpdating(false);
    }
  };

  const validateCampaignData = () => {
    const errors = [];

    // Check if agent or workflow is selected
    if (!currentCampaign.agentId || currentCampaign.agentId.trim() === "") {
      errors.push("Please select an agent or workflow");
    } else {
      // Check if the selected agentId is valid (either an agent or workflow)
      const isAgent = agents.find((a) => a.agentId === currentCampaign.agentId);
      const isWorkflow = workflowList.find((w) => w._id === currentCampaign.agentId);
      
      if (!isAgent && !isWorkflow) {
        errors.push("The selected agent/workflow is no longer available. Please select a valid agent or workflow.");
      }
    }

    // Check if from number is selected
    if (
      !currentCampaign.fromNumber ||
      currentCampaign.fromNumber.trim() === ""
    ) {
      errors.push("Please select a from number");
    }

    // Check if at least 1 recipient exists
    const recipientCount = currentCampaign.recipients?.length || 0;
    if (recipientCount === 0) {
      errors.push("Please add at least 1 recipient/contact");
    }

    return errors;
  };
  // const API_URL = process.env.NEXT_PUBLIC_CALL_URL!;
  const API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_URL!;
  const API_KEY = "supersecretapikey123";

  const triggerFastApiCall = async (campId: string) => {
    try {
      const payload = {
        agent_id: currentCampaign.agentId,
        from_phone: currentCampaign.fromNumber,
        user_id: currentCampaign.userId,
        campaign_id: campId,
        max_concurrent_calls: currentCampaign.concurrentCalls,
        numberoffollowup: currentCampaign.noOfFollowUps,
        agentName: agentName, // Use the agentName state variable
      };
      console.log("payload", payload);

      const response = await axios.post(API_URL, payload, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ Axios Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleSend = async () => {
    // Validate required fields
    const validationErrors = validateCampaignData();

    if (validationErrors.length > 0) {
      // Show all validation errors
      const errorMessage = validationErrors.join("\n");
      toast.error(errorMessage);
      return;
    }
    // setCampaign({...campaign, status: 'ongoing'});
    // setHasChanges(true);

    setIsSending(true);
    try {
      // First save any pending changes
      // if (hasChanges || isNameUpdating)
      {
        const updatedCampaign = {
          ...currentCampaign,
          campaignCallName: name,
          status: "ongoing",
        };
        const updateResponse = await axios.put(
          "/api/createCampaign/update",
          updatedCampaign
        );
        if (!updateResponse.data.success) {
          toast.error("Failed to save changes before sending");
          return;
        }
        // setCampaign(updateResponse.data.data);
        updateCampaign(updateResponse.data.data);
        setHasChanges(false);
        setIsNameUpdating(false);
      }
      console.log("campaign._id", currentCampaign);
      try {
        const response = await triggerFastApiCall(currentCampaign._id);
        console.log("response", response);
        toast.success("Campaign sent successfully");
      } catch (error) {
        console.error("❌ Failed to send campaign:", error);
        toast.error("Failed to send campaign");
      }
    } catch (error) {
      console.error("❌ Failed to send campaign:", error);
      toast.error("Failed to send campaign");
    } finally {
      setIsSending(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setHasChanges(true);
  };

  const handleCampaignChange = (updatedCampaign: Campaign) => {
    // setCampaign(updatedCampaign);
    setCurrentCampaign(updatedCampaign);
    // updateCampaign(updatedCampaign);
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

  // Sync initialCampaign when campaign._id changes
  useEffect(() => {
    setName(currentCampaign.campaignCallName);
    setInitialCampaign(_.cloneDeep(currentCampaign));
    setHasChanges(false);
  }, [currentCampaign._id]);

  // Debounced check for changes (campaign or name)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const campaignChanged = !_.isEqual(currentCampaign, initialCampaign);
      const nameChanged = currentCampaign.campaignCallName !== name;
      setHasChanges(campaignChanged || nameChanged);
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentCampaign, initialCampaign, name]);

  return (
    <div className="flex flex-col bg-gray-50 rounded-[6px] border border-t-0 border-gray-200 h-full dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700">
      {/* Header with campaign name, ID, status and buttons */}
      <div className="flex justify-between items-start p-4 pb-1 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900">
            {isNameUpdating && isEditable ? (
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="border-gray-300 rounded-[6px] border px-2 py-1 text-xl font-semibold"
                ref={nameRef}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsNameUpdating(false);
                    nameRef.current?.blur();
                  }
                }}
              />
            ) : (
              <h2 className="text-2xl font-semibold truncate overflow-hidden text-ellipsis max-w-80 text-gray-900 text-nowrap dark:text-gray-100">
                {name}
              </h2>
            )}
            {isEditable && (
              <FaRegEdit
                className="w-4 h-4 text-gray-500 cursor-pointer"
                onClick={() => setIsNameUpdating(true)}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID: {currentCampaign._id}
            </p>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[currentCampaign.status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}
            >
              {currentCampaign.status.charAt(0).toUpperCase() +
                currentCampaign.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 gap-1">
          {isEditable ? (
            <>
              <Button
                variant="default"
                size="md"
                onClick={handleUpdate}
                disabled={isUpdating || (!hasChanges && !isNameUpdating)}
                className={`px-5 py-1 text-md rounded-[4px] border-1 dark:bg-indigo-700 dark:hover:bg-indigo-800 dark:text-white dark:border-indigo-700 ${
                  hasChanges || isNameUpdating
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-600/50 text-white cursor-not-allowed"
                }`}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleSend}
                disabled={isSending}
                className="px-4.5 py-0.5 text-md rounded-[4px] shadow-xs text-indigo-600 border-2 border-indigo-600 dark:border-indigo-400 dark:text-indigo-200 dark:bg-gray-800"
              >
                <Send className="w-4 h-4 mr-1" />
                {isSending ? "Sending..." : "Send"}
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="md"
              className="px-4.5 py-0.5 text-md rounded-[4px] shadow-xs text-indigo-300 border-2 cursor-not-allowed border-indigo-200 hover:bg-gray-100 hover:text-indigo-300 dark:bg-gray-800 dark:text-indigo-200 dark:border-indigo-400"
            >
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex text-sm space-x-4 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-0.5 cursor-pointer ${activeTab === tab.id ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400" : "text-gray-600 dark:text-gray-400"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "general" && (
          <CampaignGeneralTab
            campaign={currentCampaign}
            setCampaign={handleCampaignChange}
            agents={agents}
            isEditable={isEditable}
            workflowList={workflowList}
            selectedWorkflow={selectedWorkflow}
            onAgentChange={handleAgentChange}
            onWorkflowChange={handleWorkflowChange}
          />
        )}

        {activeTab === "analytics" && (
          // <CampaignAnalytics campaign={campaign} agents={agents} />
          <Analytics
            campaign={currentCampaign}
            setHasChanges={setHasChanges}
            // setCampaign={setCampaign}
            setCampaign={updateCampaign}
            campaignId={currentCampaign._id}
            handleUpdate={handleUpdate}
            status={currentCampaign.status}
          />
        )}

        {activeTab === "call-history" && (
          <div className="p-4 pt-2">
            <FlexibleCallHistory campaignId={currentCampaign._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailsPanel;

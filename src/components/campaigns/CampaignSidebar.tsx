"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Campaign } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignHeader from "./CampaignHeader";
import CampaignCard from "./CampaignCard";
import { deleteCampaign } from "./api";
import { createCampaign } from "@/utils/api";
import { useCampaignStore } from "@/store/campaignStore";

interface CampaignSidebarProps {
  // campaigns: Campaign[];
  // setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  selectedId?: string;
  isCreatePage?: boolean;
}

const CampaignSidebar: React.FC<CampaignSidebarProps> = ({
  selectedId,
  isCreatePage,
}) => {
  const { campaigns, setCampaigns } = useCampaignStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [dupLoading, setDupLoading] = useState<string | null>(null);

  // Filter campaigns based on active tab
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (activeTab === "all") return true;
    if (activeTab === "outgoing") return campaign.status === "ongoing";
    return campaign.status === activeTab;
  });

  const handleCreateCampaign = async () => {
    const transformedData = {
      campaignCallName: "Untitled Campaign",
      agentId: "",
      fromNumber: "",
      callTimezone: "",
      callScheduledOrNot: true,
      callDate: null,
      status: "draft",
      concurrentCalls: 1,
    };

    try {
      const newCampaign = await createCampaign(transformedData);
      console.log(newCampaign.data);

      // Add the new campaign to the list and navigate to it
      setCampaigns([newCampaign.data as Campaign, ...campaigns]);
      router.push(`/dashboard/campaigns/${newCampaign.data._id}`);
    } catch (err: any) {
      console.error("❌ Error creating campaign:", err);
      alert("Failed to create campaign");
    }
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    router.push(`/dashboard/campaigns/${campaign._id}`);
  };

  const handleDeleteCampaign = async (id: string) => {
    setDeleteLoading(id);
    try {
      await deleteCampaign(id);
      setCampaigns(
        campaigns.filter((campaign: Campaign) => campaign._id !== id)
      );

      // If we deleted the currently selected campaign, navigate to campaigns list
      if (selectedId === id) {
        router.push("/dashboard/campaigns");
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDuplicateCampaign = async (src: Campaign) => {
    setDupLoading(src._id);
    try {
      const {
        _id,
        createdAt,
        updatedAt,
        __v, // mongoose version field if any
        ...cloneable
      } = src as any;

      const duplicatedCampaign = {
        ...cloneable,
        campaignCallName: `${src.campaignCallName} (copy)`,
        // Remove or regenerate any unique fields as needed
        // You may want to clear recipients, status, etc. if desired
        status: "draft",
      };

      const newCampaign = await createCampaign(duplicatedCampaign);
      setCampaigns([newCampaign.data as Campaign, ...campaigns]);
      router.push(`/dashboard/campaigns/${newCampaign.data._id}`);
    } catch (err) {
      console.error("Duplication failed:", err);
      alert("Could not duplicate campaign.");
    } finally {
      setDupLoading(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-1/4">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-100">
        <CampaignHeader title="Campaigns" onCreate={handleCreateCampaign} />
      </div>

      {/* Tabs and Campaign List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <div className="sticky top-0 z-10 bg-white p-2 pb-2">
            <TabsList className="bg-white border border-gray-200 rounded-[6px] p-0.5 shadow-sm w-full flex gap-1 md:gap-2 px-0 md:px-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-[4px] text-xs flex-1 min-w-0 truncate"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="outgoing"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none rounded-[4px] text-xs flex-1 min-w-0"
              >
                Outgoing
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700 data-[state=active]:shadow-none rounded-[4px] text-xs flex-1 min-w-0"
              >
                Draft
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-none rounded-[4px] text-xs flex-1 min-w-0"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Campaign Lists */}
          <div className="flex-1 overflow-y-auto px-2 md:px-4 pb-4">
            {["all", "outgoing", "draft", "completed"].map((tab) => (
              <TabsContent key={tab} value={tab} className="h-full m-0 p-0">
                <CampaignList
                  campaigns={filteredCampaigns}
                  emptyMessage={`No ${tab === "all" ? "" : tab} campaigns found`}
                  selectedId={selectedId}
                  onSelect={handleSelectCampaign}
                  deleteLoading={deleteLoading}
                  onDeleteCampaign={handleDeleteCampaign}
                  onDuplicate={handleDuplicateCampaign}
                  isDuplicating={dupLoading}
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

// Campaign List Component
interface CampaignListProps {
  campaigns: Campaign[];
  emptyMessage: string;
  selectedId?: string;
  onSelect: (campaign: Campaign) => void;
  deleteLoading: string | null;
  onDeleteCampaign: (id: string) => void;
  onDuplicate: (campaign: Campaign) => void;
  isDuplicating: string | null;
}

const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  emptyMessage,
  selectedId,
  onSelect,
  deleteLoading,
  onDeleteCampaign,
  onDuplicate,
  isDuplicating,
}) => {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign._id}
          campaign={campaign}
          isSelected={selectedId === campaign._id}
          onSelect={onSelect}
          onDelete={onDeleteCampaign}
          isDeleting={deleteLoading}
          setNewCampaign={() => {}}
          onDuplicate={onDuplicate}
          isDuplicating={isDuplicating}
        />
      ))}
    </div>
  );
};

export default CampaignSidebar;

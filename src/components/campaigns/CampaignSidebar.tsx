"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Campaign } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignHeader from './CampaignHeader';
import CampaignCard from './CampaignCard';
import { deleteCampaign } from './api';
import { createCampaign } from '@/utils/api';

interface CampaignSidebarProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  selectedId?: string;
  isCreatePage?: boolean;
}

const CampaignSidebar: React.FC<CampaignSidebarProps> = ({ 
  campaigns, 
  setCampaigns, 
  selectedId,
  isCreatePage 
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Filter campaigns based on active tab
  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === "all") return true;
    if (activeTab === "outgoing") return campaign.status === "ongoing";
    return campaign.status === activeTab;
  });

  const handleCreateCampaign = async () => {
    const transformedData = {
      campaignCallName: 'Untitled Campaign',
      agentId: "",
      fromNumber: "",
      callTimezone: "",
      callScheduledOrNot: true,
      callDate: null,
      status: 'draft',
      concurrentCalls: 1,
    };
    
    try {
      const newCampaign = await createCampaign(transformedData);
      console.log(newCampaign.data);
      
      // Add the new campaign to the list and navigate to it
      setCampaigns(prev => [newCampaign.data as Campaign, ...prev]);
      router.push(`/dashboard/campaigns/${newCampaign.data._id}`);
      
    } catch (err: any) {
      console.error('❌ Error creating campaign:', err);
      alert('Failed to create campaign');
    }
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    router.push(`/dashboard/campaigns/${campaign._id}`);
  };

  const handleDeleteCampaign = async (id: string) => {
    setDeleteLoading(id);
    try {
      await deleteCampaign(id);
      setCampaigns(prev => prev.filter(campaign => campaign._id !== id));
      
      // If we deleted the currently selected campaign, navigate to campaigns list
      if (selectedId === id) {
        router.push('/dashboard/campaigns');
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="border-r border-gray-200 dark:border-gray-700 flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-950 p-4 border-b border-gray-100 dark:border-gray-700">
        <CampaignHeader 
          title="Campaigns"
          onCreate={handleCreateCampaign}
        />
      </div>

      {/* Tabs and Campaign List */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-gray-950">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 p-2 pb-2">
            <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5 shadow-sm w-full">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-md text-xs text-gray-700 dark:text-gray-300"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="outgoing" 
                className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 data-[state=active]:shadow-none rounded-md text-xs text-gray-700 dark:text-gray-300"
              >
                Outgoing
              </TabsTrigger>
              <TabsTrigger 
                value="draft" 
                className="data-[state=active]:bg-gray-50 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-700 dark:data-[state=active]:text-gray-300 data-[state=active]:shadow-none rounded-md text-xs text-gray-700 dark:text-gray-300"
              >
                Draft
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/30 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-300 data-[state=active]:shadow-none rounded-md text-xs text-gray-700 dark:text-gray-300"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Campaign Lists */}
          <div className="flex-1 overflow-auto bg-white dark:bg-gray-950">
            {['all', 'outgoing', 'draft', 'completed'].map(tab => (
              <TabsContent key={tab} value={tab} className="h-full m-0 p-2">
                <CampaignList 
                  campaigns={filteredCampaigns}
                  emptyMessage={`No ${tab === 'all' ? '' : tab} campaigns found`}
                  selectedId={selectedId}
                  onSelect={handleSelectCampaign}
                  deleteLoading={deleteLoading}
                  onDeleteCampaign={handleDeleteCampaign}
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
}

const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  emptyMessage,
  selectedId,
  onSelect,
  deleteLoading,
  onDeleteCampaign
}) => {
  if (campaigns.length === 0) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">{emptyMessage}</div>;
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
          setNewCampaign={() => {}} // Not needed in this context
        />
      ))}
    </div>
  );
};

export default CampaignSidebar; 
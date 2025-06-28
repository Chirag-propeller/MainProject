"use client";
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignCard from './CampaignCard';
import { Campaign } from './types';

interface CampaignTabsProps {
  campaigns: Campaign[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loading: boolean;
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (campaign: Campaign) => void;
  deleteLoading: string | null;
  onDeleteCampaign: (id: string) => void;
  setNewCampaign: (newCampaign: boolean) => void;
}

const CampaignTabs: React.FC<CampaignTabsProps> = ({
  campaigns,
  activeTab,
  setActiveTab,
  loading,
  selectedCampaign,
  setSelectedCampaign,
  deleteLoading,
  onDeleteCampaign,
  setNewCampaign
}) => {
  // Filter campaigns based on active tab
  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === "all") return true;
    return campaign.status === activeTab;
  });

  return (
    <div className="h-full">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 pb-2">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5 shadow-sm w-full">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-md text-gray-700 dark:text-gray-300"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="ongoing" 
              className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 data-[state=active]:shadow-none rounded-md text-gray-700 dark:text-gray-300"
            >
              Ongoing
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/30 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-300 data-[state=active]:shadow-none rounded-md text-gray-700 dark:text-gray-300"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger 
              value="draft" 
              className="data-[state=active]:bg-gray-50 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-700 dark:data-[state=active]:text-gray-300 data-[state=active]:shadow-none rounded-md text-gray-700 dark:text-gray-300"
            >
              Drafts
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Simple tabs content with scroll */}
        <div className="h-[calc(100%-50px)] overflow-hidden">
          <TabsContent value="all" className="h-full">
            <CampaignList 
              loading={loading}
              campaigns={filteredCampaigns}
              emptyMessage="No campaigns found"
              selectedCampaign={selectedCampaign}
              setSelectedCampaign={setSelectedCampaign}
              deleteLoading={deleteLoading}
              onDeleteCampaign={onDeleteCampaign}
              setNewCampaign={setNewCampaign}
            />
          </TabsContent>

          <TabsContent value="ongoing" className="h-full">
            <CampaignList 
              loading={loading}
              campaigns={filteredCampaigns}
              emptyMessage="No ongoing campaigns found"
              selectedCampaign={selectedCampaign}
              setSelectedCampaign={setSelectedCampaign}
              deleteLoading={deleteLoading}
              onDeleteCampaign={onDeleteCampaign}
              setNewCampaign={setNewCampaign}
            />
          </TabsContent>

          <TabsContent value="completed" className="h-full">
            <CampaignList 
              loading={loading}
              campaigns={filteredCampaigns}
              emptyMessage="No completed campaigns found"
              selectedCampaign={selectedCampaign}
              setSelectedCampaign={setSelectedCampaign}
              deleteLoading={deleteLoading}
              onDeleteCampaign={onDeleteCampaign}
              setNewCampaign={setNewCampaign}
            />
          </TabsContent>

          <TabsContent value="draft" className="h-full">
            <CampaignList 
              loading={loading}
              campaigns={filteredCampaigns}
              emptyMessage="No draft campaigns found"
              selectedCampaign={selectedCampaign}
              setSelectedCampaign={setSelectedCampaign}
              deleteLoading={deleteLoading}
              onDeleteCampaign={onDeleteCampaign}
              setNewCampaign={setNewCampaign}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

// Separate scrollable list component
interface CampaignListProps {
  loading: boolean;
  campaigns: Campaign[];
  emptyMessage: string;
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (campaign: Campaign) => void;
  deleteLoading: string | null;
  onDeleteCampaign: (id: string) => void;
  setNewCampaign: (newCampaign: boolean) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({
  loading,
  campaigns,
  emptyMessage,
  selectedCampaign,
  setSelectedCampaign,
  deleteLoading,
  onDeleteCampaign,
  setNewCampaign
}) => {
  if (loading) {
    return <div className="text-center py-8 text-gray-700 dark:text-gray-300">Loading campaigns...</div>;
  }
  
  if (campaigns.length === 0) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">{emptyMessage}</div>;
  }
  
  return (
    <div className="overflow-y-auto h-full py-2">
      {campaigns.map((campaign) => (
        <CampaignCard 
          key={campaign._id} 
          campaign={campaign}
          isSelected={selectedCampaign?._id === campaign._id}
          onSelect={setSelectedCampaign}
          onDelete={onDeleteCampaign}
          isDeleting={deleteLoading}
          setNewCampaign={setNewCampaign}
        />
      ))}
    </div>
  );
};

export default CampaignTabs; 
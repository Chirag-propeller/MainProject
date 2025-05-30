"use client";
import React, { useState, useEffect } from 'react';
import CampaignHeader from './CampaignHeader';
import CampaignTabs from './CampaignTabs';
import CampaignDetails from './right/CampaignDetails';
import CampaignForm from './CampaignForm';
import { Campaign, Agent } from './types';
import { fetchCampaigns, fetchAgents, deleteCampaign } from './api';
import { createCampaign } from '@/utils/api';
import { usePathname } from 'next/navigation';

const CampaignDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCampaign, setNewCampaign] = useState<boolean>(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const pathname = usePathname();
  
  // Check if we're on the create campaign page
  const isCreateCampaignPage = pathname?.includes('createCampaign');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Load campaigns and agents in parallel
      const [campaignsData, agentsData] = await Promise.all([
        fetchCampaigns(),
        fetchAgents()
      ]);
      
      setCampaigns(campaignsData);
      setAgents(agentsData);
      
      // Select first campaign if available and not on create page
      if (campaignsData.length > 0 && !isCreateCampaignPage) {
        setSelectedCampaign(campaignsData[0]);
      }
      
      setLoading(false);
    };

    loadData();
  }, [isCreateCampaignPage]);

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    setDeleteLoading(id);
    
    try {
      const success = await deleteCampaign(id);
      
      if (success) {
        setCampaigns(prev => prev.filter(campaign => campaign._id !== id));
        
        // If we delete the selected campaign, select another one
        if (selectedCampaign?._id === id) {
          const remaining = campaigns.filter(campaign => campaign._id !== id);
          setSelectedCampaign(remaining.length > 0 ? remaining[0] : null);
        }
      } else {
        alert('Failed to delete campaign');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('An error occurred while deleting the campaign.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle creation of a new campaign and activate it
  const handleCreateCampaign = async () => {
    const transformedData = {
      campaignCallName: 'Untitled Campaign',
      agentId: "",
      fromNumber: "",
      callTimezone: "",
      callScheduledOrNot: true,
      callDate: null,
      status: 'draft',
      concurrentCalls: 0,
    };
    try {
      const newCampaign = await createCampaign(transformedData);
      console.log(newCampaign.data);
      setNewCampaign(true);
      setCampaigns(prev => [newCampaign.data, ...prev]);
      setSelectedCampaign(newCampaign.data);
      
    } catch (err: any) {
      console.error('❌ Error creating campaign:', err);
      alert('Failed to create campaign');
    }
  };

  return (
    <div className="flex h-[calc(100vh-12px)]">
      {/* Campaigns list section (25-40% width) */}
      <div className="w-1/4 border-r border-gray-200 px-2 flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
        <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-100">
          <CampaignHeader 
            title="Campaigns"
            onCreate={handleCreateCampaign}
            
          />
        </div>

        <div className="flex-1" style={{ height: 'calc(100% - 70px)', overflow: 'hidden' }}>
          <CampaignTabs 
            campaigns={campaigns}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={loading}
            selectedCampaign={selectedCampaign}
            setSelectedCampaign={setSelectedCampaign}
            deleteLoading={deleteLoading}
            onDeleteCampaign={handleDeleteCampaign}
            setNewCampaign={setNewCampaign}
          />
        </div>
      </div>

      {/* Campaign details section (approximately 60% width) */}
      <div className="w-3/4 overflow-auto">
        {isCreateCampaignPage ? (
          <CampaignForm />
        ) : selectedCampaign ? (
          <CampaignDetails 
            campaign={selectedCampaign}
            agents={agents}
            newCampaign={newCampaign}
            setSelectedCampaign={setSelectedCampaign}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a campaign to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDashboard; 
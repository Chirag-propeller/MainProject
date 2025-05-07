"use client";
import React, { useState, useEffect } from 'react';
import CampaignHeader from './CampaignHeader';
import CampaignTabs from './CampaignTabs';
import CampaignDetails from './CampaignDetails';
import CampaignForm from './CampaignForm';
import { Campaign, Agent } from './types';
import { fetchCampaigns, fetchAgents, deleteCampaign } from './api';
import { usePathname } from 'next/navigation';

const CampaignDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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

  return (
    <div className="flex h-[calc(100vh-80px)]" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Campaigns list section (25-40% width) */}
      <div className="w-1/4 border-r border-gray-200 flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
        <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-100">
          <CampaignHeader 
            title="Campaigns"
            createButtonLink="/dashboard/campaigns/createCampaign"
            createButtonText="+ Create"
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
          />
        </div>
      </div>

      {/* Campaign details section (approximately 60% width) */}
      <div className="w-3/4 p-4 overflow-auto">
        {isCreateCampaignPage ? (
          <CampaignForm />
        ) : selectedCampaign ? (
          <CampaignDetails 
            campaign={selectedCampaign}
            agents={agents}
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
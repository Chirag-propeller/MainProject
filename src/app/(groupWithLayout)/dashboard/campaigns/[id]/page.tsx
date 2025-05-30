"use client";
import React, { useEffect, useState } from 'react';
import { Campaign, Agent } from '@/components/campaigns/types';
import { useParams } from 'next/navigation';
import { fetchCampaigns, fetchAgents } from '@/components/campaigns/api';
// import CampaignDetailsPanel from '@/components/campaigns/right/CampaignDetailsPanel';
import CampaignDetailsPanel from '@/components/campaigns/right/CampaignDetailsPanel';

// This component displays the details of a single campaign
export default function CampaignDetailsPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const campaignId = params?.id as string;

  // Fetch the campaign details when the component mounts or ID changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [campaignsData, agentsData] = await Promise.all([
          fetchCampaigns(),
          fetchAgents()
        ]);
        
        const foundCampaign = campaignsData.find(c => c._id === campaignId);
        setCampaign(foundCampaign || null);
        setAgents(agentsData);
      } catch (error) {
        console.error('Failed to load campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      loadData();
    }
  }, [campaignId]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show error if campaign not found
  if (!campaign) {
    return (
      <div className="text-center py-10 text-red-500">
        Campaign not found. It may have been deleted or the ID is invalid.
      </div>
    );
  }

  // Show campaign details panel
  return <CampaignDetailsPanel campaign={campaign} setCampaign={setCampaign} agents={agents} />;
} 
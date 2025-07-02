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
      <div className="flex flex-col bg-white rounded-lg border border-t-0 border-gray-200 h-full animate-pulse">
        {/* Header skeleton */}
        <div className="flex justify-between items-start p-4 pb-1">
          <div className="flex flex-col">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="flex items-center gap-2">
              <div className="h-3 bg-gray-200 rounded w-32"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
          <div className="flex space-x-2 gap-1">
            <div className="h-9 bg-gray-200 rounded w-20"></div>
            <div className="h-9 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        {/* Tabs navigation skeleton */}
        <div className="flex text-sm space-x-4 px-4 pb-2 border-b border-gray-300">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {/* Section 1 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-2 bg-gray-50">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-2 bg-gray-50">
                <div className="h-5 bg-gray-200 rounded w-40"></div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-2 bg-gray-50">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-2 bg-gray-50">
                <div className="h-5 bg-gray-200 rounded w-28"></div>
              </div>
            </div>
          </div>
        </div>
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
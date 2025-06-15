"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import CampaignSidebar from '@/components/campaigns/CampaignSidebar';
import { Campaign } from '@/components/campaigns/types';
import { fetchCampaigns } from '@/components/campaigns/api';

// The layout for the campaigns section of the dashboard
export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  // Extract the selected campaign ID from the URL
  const selectedId = pathname?.split('/').pop();
  const isCreatePage = pathname?.includes('createCampaign');

  // Fetch the list of campaigns when the component mounts
  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      try {
        const campaignsData = await fetchCampaigns();
        setCampaigns(campaignsData);
        if(campaignsData.length > 0) {
          router.push(`/dashboard/campaigns/${campaignsData[0]._id}`);
        }
      } catch (error) {
        console.error('Failed to load campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  return (
    <div className="flex h-full" style={{ height: 'calc(100vh - 12px)' }}>
      {/* Left sidebar with campaigns list (25% width) */}
      <div className="w-1/4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <CampaignSidebar 
            campaigns={campaigns} 
            setCampaigns={setCampaigns} 
            selectedId={selectedId}
            isCreatePage={isCreatePage}
          />
        )}
      </div>
      
      {/* Main content area (75% width) */}
      <div className="w-3/4 overflow-auto">
        {children}
      </div>
    </div>
  );
} 
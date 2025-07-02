"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import CampaignSidebar from '@/components/campaigns/CampaignSidebar';
import CampaignHeader from '@/components/campaigns/CampaignHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Campaign } from '@/components/campaigns/types';
import { fetchCampaigns } from '@/components/campaigns/api';
import { createCampaign } from '@/utils/api';

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

  // Handle create campaign during loading
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

  return (
    <div className="flex h-full" style={{ height: 'calc(100vh - 12px)' }}>
      {/* Left sidebar with campaigns list (25% width) */}
      <div className="w-1/4">
        {loading ? (
          <div className="border-r border-gray-200 flex flex-col h-full">
            {/* Real Header */}
            <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-100">
              <CampaignHeader 
                title="Campaigns"
                onCreate={handleCreateCampaign}
              />
            </div>

            {/* Real Tabs with Skeleton Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="all" className="h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-white p-2 pb-2">
                  <TabsList className="bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm w-full">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-md text-xs"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger 
                      value="outgoing" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none rounded-md text-xs"
                    >
                      Outgoing
                    </TabsTrigger>
                    <TabsTrigger 
                      value="draft" 
                      className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700 data-[state=active]:shadow-none rounded-md text-xs"
                    >
                      Draft
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed" 
                      className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-none rounded-md text-xs"
                    >
                      Completed
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Skeleton Campaign Lists */}
                <div className="flex-1 overflow-auto">
                  <TabsContent value="all" className="h-full m-0 p-2">
                    <SkeletonCampaignList />
                  </TabsContent>
                  <TabsContent value="outgoing" className="h-full m-0 p-2">
                    <SkeletonCampaignList />
                  </TabsContent>
                  <TabsContent value="draft" className="h-full m-0 p-2">
                    <SkeletonCampaignList />
                  </TabsContent>
                  <TabsContent value="completed" className="h-full m-0 p-2">
                    <SkeletonCampaignList />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
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

// Skeleton Campaign List Component
const SkeletonCampaignList: React.FC = () => {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="mb-1">
          <div className="p-2 relative">
            <div className="mb-0.5 flex">
              {/* Campaign name skeleton */}
              <div className="h-3 bg-gray-200 rounded w-2/3 mr-2"></div>
              {/* Status badge skeleton */}
              <div className="h-5 bg-gray-200 rounded-lg w-12"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                {/* Started date skeleton */}
                <div className="h-2.5 bg-gray-200 rounded w-20"></div>
                {/* ID skeleton */}
                <div className="h-2.5 bg-gray-200 rounded w-16"></div>
              </div>
              
              {/* Delete button area skeleton */}
              <div className="absolute right-2 top-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 
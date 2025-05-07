"use client";
import React from 'react';
import { Campaign, Agent } from './types';

interface CampaignDetailsProps {
  campaign: Campaign;
  agents: Agent[];
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign, agents }) => {
  const agentName = agents.find(a => a.agentId === campaign.agentId)?.agentName || 'No Agent Attached';
  
  const statusStyles = {
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <div className="p-6 bg-white rounded-lg border border-slate-200 h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold">{campaign.campaignCallName}</h2>
        <span 
          className={`px-2 py-1 text-xs rounded-full ${statusStyles[campaign.status]}`}
        >
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Campaign ID</h3>
          <p>{campaign.campaignCallId}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Created At</h3>
          <p>{new Date(campaign.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">From Number</h3>
          <p>{campaign.fromNumber || '-'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Agent</h3>
          <p>{agentName}</p>
        </div>
        {/* <CampaignAnalytics /> */}
      </div>
    </div>
  );
};

// Separate component for analytics section
const CampaignAnalytics: React.FC = () => {
  return (
    <div className="pt-4">
      <h3 className="text-lg font-medium mb-2">Campaign Analytics</h3>
      <div className="grid grid-cols-2 gap-4">
        <AnalyticCard title="Call Success Rate" value="76%" />
        <AnalyticCard title="Total Calls" value="124" />
        <AnalyticCard title="Avg. Call Duration" value="2m 45s" />
        <AnalyticCard title="Remaining Calls" value="42" />
      </div>
    </div>
  );
};

// Component for individual analytic cards
const AnalyticCard: React.FC<{ title: string; value: string }> = ({ title, value }) => {
  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default CampaignDetails; 
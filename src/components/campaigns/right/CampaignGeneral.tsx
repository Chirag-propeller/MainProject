"use client";
import React from 'react';
import { Campaign, Agent } from '../types';

interface CampaignGeneralProps {
  campaign: Campaign;
  agents: Agent[];
}

const CampaignGeneral: React.FC<CampaignGeneralProps> = ({ campaign, agents }) => {
  const agentName = agents.find(a => a._id === campaign.agentId)?.agentName || 'No Agent Attached';
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CampaignGeneral; 
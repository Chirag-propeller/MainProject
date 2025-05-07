"use client";
import React from 'react';
import { Campaign } from '../types';

interface CampaignDataProps {
  campaign: Campaign;
}

const CampaignData: React.FC<CampaignDataProps> = ({ campaign }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">Campaign Data</h3>
      <pre className="bg-gray-100 rounded p-4 overflow-auto text-xs">
        {JSON.stringify(campaign, null, 2)}
      </pre>
    </div>
  );
};

export default CampaignData; 
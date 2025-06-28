"use client";
import React from 'react';
import { Campaign } from '../types';
import EditForm from '../edit/EditForm';

interface CampaignDataProps {
  campaign: Campaign;
}

const CampaignData: React.FC<CampaignDataProps> = ({ campaign }) => {
  return (
    <div className="p-4 pt-0">

      {/* <EditForm /> */}
      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Campaign Data</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded p-4 overflow-auto text-xs border border-gray-200 dark:border-gray-700">
        {JSON.stringify(campaign, null, 2)}
      </pre>
    </div>
  );
};

export default CampaignData; 
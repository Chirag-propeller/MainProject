"use client";
import React from "react";
import { Campaign, Agent } from "../types";

interface AnalyticCardProps {
  title: string;
  value: string;
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({ title, value }) => (
  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <h4 className="text-sm font-medium text-gray-500 dark:text-indigo-300">
      {title}
    </h4>
    <p className="text-2xl font-bold text-gray-900 dark:text-indigo-300">
      {value}
    </p>
  </div>
);

interface CampaignAnalyticsProps {
  campaign: Campaign;
  agents: Agent[];
}

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({
  campaign,
  agents,
}) => {
  // Placeholder metrics; replace with real data as needed
  return (
    <div className="pt-4">
      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-indigo-300">
        Campaign Analytics
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <AnalyticCard title="Call Success Rate" value="76%" />
        <AnalyticCard title="Total Calls" value="124" />
        <AnalyticCard title="Avg. Call Duration" value="2m 45s" />
        <AnalyticCard title="Remaining Calls" value="42" />
      </div>
    </div>
  );
};

export default CampaignAnalytics;

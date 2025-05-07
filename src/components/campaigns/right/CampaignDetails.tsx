"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Campaign, Agent } from '../types';
import { Edit2, Send } from 'lucide-react';
import { Button } from '../../ui/button';
import CampaignGeneral from './CampaignGeneral';
import CampaignAnalytics from './CampaignAnalytics';
import CampaignData from './CampaignData';

interface CampaignDetailsProps {
  campaign: Campaign;
  agents: Agent[];
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign, agents }) => {
  const agentName = agents.find(a => a.agentId === campaign.agentId)?.agentName || 'No Agent Attached';
  const [isEditing, setIsEditing] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [title, setTitle] = useState(campaign.campaignCallName);
  const [activeTab, setActiveTab] = useState<'general'|'analytics'|'data'>('general');
  const titleRef = useRef<HTMLInputElement>(null);
  
  const statusStyles: Record<string, string> = {
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800'
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isTitleEditing && titleRef.current && !titleRef.current.contains(event.target as Node)) {
        setIsTitleEditing(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTitleEditing]);
  
  return (
    <div className="flex flex-col bg-white rounded-lg border border-slate-200 h-full">
      {/* Fixed header */}
      <div className="flex justify-between items-start p-4 pb-1 ">
        {/* Title and ID */}
        <div className="flex flex-col">
          {/* Editable title with pencil icon */}
          {isTitleEditing ? (
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-xl font-semibold border-b border-gray-300 focus:outline-none"
            />
          ) : (
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">{title}</h2>
              {
                isEditing && (
                  <Edit2
                  className="ml-0.5 h-2.5 top-0 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => isEditing && setIsTitleEditing(true)}
                />
                )
              }

            </div>
          )}
          <p className="text-sm text-gray-500 mt-1">ID: {campaign.campaignCallId}</p>
        </div>
        {/* Action buttons */}
        <div className="flex space-x-2 gap-1">
          <Button
            onClick={() => setIsEditing(prev => !prev)}
            variant="secondary"
            size="sm"
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
          <Button variant="default" size="sm">
            <Send className="w-4 h-4 mr-1" />
            Send
          </Button>
        </div>
      </div>
      {/* Tabs navigation */}
      <div className="flex text-sm space-x-4 px-4 pb-2 border-b border-gray-300">
        {['general','analytics','data'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'general'|'analytics'|'data')}
            className={`pb-0.5 cursor-pointer ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'general' && <CampaignGeneral campaign={campaign} agents={agents} />}
        {activeTab === 'analytics' && <CampaignAnalytics campaign={campaign} agents={agents} />}
        {activeTab === 'data' && <CampaignData campaign={campaign} />}
      </div>
    </div>
  );
};

export default CampaignDetails; 
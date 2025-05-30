"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Campaign, Agent } from '../types';
import { Edit2, Send } from 'lucide-react';
import { Button } from '../../ui/button';
import CampaignGeneral from './CampaignGeneral';
import CampaignAnalytics from './CampaignAnalytics';
import CampaignData from './CampaignData';
import EditForm from '../edit/EditForm';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CampaignGoal from './CampaignGoal';

import { SendModal } from '../sendModal/SendModal';

interface CampaignDetailsProps {
  campaign: Campaign;
  agents: Agent[];
  newCampaign : boolean;
  setSelectedCampaign: (campaign: Campaign) => void;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign, agents, newCampaign, setSelectedCampaign }) => {
  const agentName = agents.find(a => a.agentId === campaign.agentId)?.agentName || 'No Agent Attached';
  const [isEditing, setIsEditing] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [title, setTitle] = useState(campaign.campaignCallName);
  const [activeTab, setActiveTab] = useState<'general'|'analytics'|'data'|'edit'|'campaigns goals'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const editFormRef = useRef<{ save: () => void }>(null);
  
  const statusStyles: Record<string, string> = {
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800'
  };
  useEffect(()=>{
    console.log(newCampaign);
    if(newCampaign){
      setActiveTab('edit');
      setIsEditing(true);

    }
  }, [newCampaign])
  // Handle the form data save from EditForm
  const handleFormSave = async (formData: any) => {
    try {
      setIsLoading(true);
      
      // Combine form data with title if it was edited
      const updatedData = {
        ...formData,
        campaignCallName: title // Use the current title from state
      };
      
      // Send PUT request to update campaign
      const response = await axios.put('/api/createCampaign/update', updatedData);
      
      if (response.data.success) {
        toast.success('Campaign updated successfully');
        // Update the local state
        setSelectedCampaign(response.data.data);
        console.log(response.data.data);
        setActiveTab('general');
        setIsEditing(false);
      } else {
        toast.error(response.data.error || 'Failed to update campaign');
      }
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      toast.error(error.response?.data?.error || 'Failed to update campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Use ref to call save function in EditForm
    if (editFormRef.current) {
      editFormRef.current.save();
    }
  };

  const handleSend = async () => {
    const user = await axios.get('/api/user/getCurrentUser');
    // console.log(user);
    const credits = parseFloat(user.data?.credits?.$numberDecimal) || 0;
    const creditsUsed = parseFloat(user.data?.creditsUsed?.$numberDecimal) || 0;
    // const credits = user.data?.credits || 0 ;
    // const creditsUsed = user.data?.creditsUsed || 0;
    if(credits - creditsUsed <= 0){
      alert("You have no credits left");
      return;
    }
    if(campaign.status === "completed"){
      alert("Campaign is already completed");
      return;
    }
    if(campaign.status === "ongoing"){
      alert("Campaign is already ongoing");
      return;
    }
    setIsSendModalOpen(true);
  }

  const handleEditAndSave = () => {
    if(isEditing){
      handleSave();
      return;
    }
    setActiveTab('edit');
    setIsEditing(true);
  };

  useEffect(() => {
    if (!newCampaign) {
      setActiveTab('general');
      setIsEditing(false);
      setTitle(campaign.campaignCallName);
    }
  }, [campaign, newCampaign]);
  
  
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
    <div className="flex flex-col bg-white rounded-lg h-full">
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
              <h2 className="text-2xl font-semibold">{campaign.campaignCallName}</h2>
              {
                isEditing && (
                  <Edit2
                  className="ml-0.5 h-2.5 top-0 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setIsTitleEditing(true)}
                />
                )
              }

            </div>
          )}
          <p className="text-xs text-gray-500 mt-0.5">ID: {campaign._id}</p>
        </div>
        {/* Action buttons */}
        <div className="flex space-x-2 gap-1">
          <Button
            onClick={handleEditAndSave}
            variant="secondary"
            size="sm"
            disabled={isLoading}
          >
            {isEditing ? (isLoading ? 'Saving...' : 'Save') : 'Edit'}
          </Button>
          {
            !isEditing && (
              <Button variant="default" size="sm" onClick={handleSend}>
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            )
          }
        </div>
      </div>
      {/* Tabs navigation */}
      {
        !isEditing && (
          <div className="flex text-sm space-x-4 px-4 pb-2 border-b border-gray-300">
          {['general','campaigns goals', 'analytics','data'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'general'|'analytics'|'data'|'campaigns goals')}
              className={`pb-0.5 cursor-pointer ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        )
      }

      {/* Edit tab */}
      {
        isEditing && (
          <div className="flex text-sm space-x-4 px-4 pb-2 border-b border-gray-300">
          <button
                key="edit"
                onClick={() => setActiveTab('edit')}
                className={`pb-0.5 cursor-pointer ${activeTab === 'edit' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
              >
                Edit
              </button>
          </div>
        )
      }

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'general' && <CampaignGeneral campaign={campaign} agents={agents} />}
        {activeTab === 'campaigns goals' && <CampaignGoal campaign={campaign} agents={agents} />}
        {activeTab === 'analytics' && <CampaignAnalytics campaign={campaign} agents={agents} />}
        {activeTab === 'data' && <CampaignData campaign={campaign} />}

        {activeTab === 'edit' && <EditForm campaign={campaign} onSave={handleFormSave} ref={editFormRef} />}
      </div>
      {isSendModalOpen && <SendModal onClose={() => setIsSendModalOpen(false)} campaign={campaign}  />}
    </div>
  );
};

export default CampaignDetails; 
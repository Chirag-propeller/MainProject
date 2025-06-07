"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Campaign, Agent } from '../types';
import { Button } from '@/components/ui/button';
import { Pencil, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CampaignGeneralTab from '@/components/campaigns/right/CampaignGeneralTab';
import CampaignAnalytics from './CampaignAnalytics';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface CampaignDetailsPanelProps {
  campaign: Campaign;
  setCampaign: (campaign: Campaign) => void;
  agents: Agent[];
}

const CampaignDetailsPanel: React.FC<CampaignDetailsPanelProps> = ({ 
  campaign, 
  setCampaign, 
  agents 
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isNameUpdating, setIsNameUpdating] = useState(false);
  const [name, setName] = useState(campaign.campaignCallName);
  const [hasChanges, setHasChanges] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  // Check if campaign is draft and therefore editable
  const isDraft = campaign.status === 'draft';
  const isEditable = isDraft;

  // Tabs available for this campaign
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const statusStyles: Record<string, string> = {
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800'
  };

  const handleUpdate = async () => {
    if (!hasChanges && !isNameUpdating) {
      toast.error('No changes to save');
      return;
    }

    setIsUpdating(true);
    try {
      const updatedCampaign = { ...campaign, campaignCallName: name };
      console.log('📤 Sending campaign update:', updatedCampaign);
      
      const response = await axios.put('/api/createCampaign/update', updatedCampaign);
      console.log('📥 Update response:', response.data);
      
      if (response.data.success) {
        setCampaign(response.data.data);
        setHasChanges(false);
        setIsNameUpdating(false);
        toast.success('Campaign updated successfully');
      } else {
        toast.error('Failed to update campaign');
      }
    } catch (error) {
      console.error('❌ Failed to update campaign:', error);
      toast.error('Failed to update campaign');
    } finally {
      setIsUpdating(false);
    }
  };

  const validateCampaignData = () => {
    const errors = [];

    // Check if agent is selected
    if (!campaign.agentId || campaign.agentId.trim() === '') {
      errors.push('Please select an agent');
    }

    // Check if from number is selected
    if (!campaign.fromNumber || campaign.fromNumber.trim() === '') {
      errors.push('Please select a from number');
    }

    // Check if at least 1 recipient exists
    const recipientCount = (campaign.recipients?.length || 0);
    if (recipientCount === 0) {
      errors.push('Please add at least 1 recipient/contact');
    }

    return errors;
  };
  // const API_URL = process.env.NEXT_PUBLIC_CALL_URL!;
  const API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_URL!;
  const API_KEY = 'supersecretapikey123';
  
  const triggerFastApiCall = async (campId: string) => {
    try {
      const payload = {
        agent_id: campaign.agentId,
        from_phone: campaign.fromNumber,
        user_id: campaign.userId,
        campaign_id: campId, 
        max_concurrent_calls: campaign.concurrentCalls,
        numberoffollowup: campaign.noOfFollowUps,
      }
      console.log("payload", payload);

      const response = await axios.post(
        API_URL,
        payload,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      );
  
      return response.data;
    } catch (error: any) {
      console.error('❌ Axios Error:', error.response?.data || error.message);
      throw error;
    }
  };

  const handleSend = async () => {
    // Validate required fields
    const validationErrors = validateCampaignData();
    
    if (validationErrors.length > 0) {
      // Show all validation errors
      const errorMessage = validationErrors.join('\n');
      toast.error(errorMessage);
      return;
    }
    // setCampaign({...campaign, status: 'ongoing'});
    // setHasChanges(true);

    setIsSending(true);
    try {
      // First save any pending changes
      // if (hasChanges || isNameUpdating) 
        {
        const updatedCampaign = { ...campaign, campaignCallName: name, status: 'ongoing' };
        const updateResponse = await axios.put('/api/createCampaign/update', updatedCampaign);
        if (!updateResponse.data.success) {
          toast.error('Failed to save changes before sending');
          return;
        }
        setCampaign(updateResponse.data.data);
        setHasChanges(false);
        setIsNameUpdating(false);
      }
      console.log("campaign._id", campaign);
      try {
        const response = await triggerFastApiCall(campaign._id);
        console.log("response", response);
        toast.success('Campaign sent successfully');
      } catch (error) {
        console.error('❌ Failed to send campaign:', error);
        toast.error('Failed to send campaign');
      }
    } catch (error) {
      console.error('❌ Failed to send campaign:', error);
      toast.error('Failed to send campaign');
    } finally {
      setIsSending(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setHasChanges(true);
  };

  const handleCampaignChange = (updatedCampaign: Campaign) => {
    setCampaign(updatedCampaign);
    setHasChanges(true);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isNameUpdating && nameRef.current && !nameRef.current.contains(event.target as Node)) {
        setIsNameUpdating(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNameUpdating]);

  // Update hasChanges when campaign data changes
  useEffect(() => {
    if (name !== campaign.campaignCallName) {
      setHasChanges(true);
    }
  }, [name, campaign.campaignCallName]);

  return (
    <div className="flex flex-col bg-white rounded-lg border border-t-0 border-gray-200 h-full">
      {/* Header with campaign name, ID, status and buttons */}
      <div className="flex justify-between items-start p-4 pb-1">
        <div className="flex flex-col">
          <div className='flex items-center gap-2'>
            {isNameUpdating && isEditable ? ( 
              <input 
                type="text" 
                value={name} 
                onChange={handleNameChange}
                className='border-gray-300 rounded-md border-1 px-2 py-1 text-xl font-semibold' 
                ref={nameRef} 
              />
            ) : (
              <h2 className="text-2xl font-semibold">{name}</h2>
            )}
            {isEditable && (
              <Pencil 
                className='w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700' 
                onClick={() => setIsNameUpdating(true)} 
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">ID: {campaign._id}</p>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[campaign.status] || 'bg-gray-100 text-gray-800'}`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 gap-1">
          {isEditable ? (
            <>
              <Button 
                variant="default" 
                size="md"
                onClick={handleUpdate}
                disabled={isUpdating || (!hasChanges && !isNameUpdating)}
                className={`px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-100 border-1 ${
                  hasChanges || isNameUpdating 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-indigo-600/50 text-white cursor-not-allowed'
                }`}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
              <Button 
                variant="secondary" 
                size="md"
                onClick={handleSend}
                disabled={isSending}
                // className="px-5 py-1 text-md rounded-[4px] shadow-xs text-indigo-600 outline-2  outline-indigo-600"
                className="px-4.5 py-0.5 text-md rounded-[4px] shadow-xs text-indigo-600 border-2  border-indigo-600"
              >
                <Send className="w-4 h-4 mr-1" />
                {isSending ? 'Sending...' : 'Send'}
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="md" className="px-4.5 py-0.5 text-md rounded-[4px] shadow-xs text-indigo-300 border-2 cursor-not-allowed border-indigo-200 hover:bg-gray-100 hover:text-indigo-300">
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex text-sm space-x-4 px-4 pb-2 border-b border-gray-300">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-0.5 cursor-pointer ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'general' && (
          <CampaignGeneralTab 
            campaign={campaign} 
            setCampaign={handleCampaignChange} 
            agents={agents}
            isEditable={isEditable}
          />
        )}
        
        {activeTab === 'analytics' && (
          <CampaignAnalytics campaign={campaign} agents={agents} />
        )}
      </div>
    </div>
  );
};

export default CampaignDetailsPanel; 
"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Campaign } from './types';

interface CampaignCardProps {
  campaign: Campaign;
  isSelected: boolean;
  onSelect: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  isDeleting: string | null;
  setNewCampaign: (newCampaign: boolean) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
  setNewCampaign
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusStyles = {
    // ongoing: 'bg-yellow-200 text-blue-800',
    // completed: 'bg-green-200 text-green-800',
    // draft: 'bg-gray-200 text-gray-800'
    ongoing: 'bg-yellow-600 text-white',
    completed: 'bg-green-600 text-white',
    draft: 'bg-gray-600 text-white'
  };
  const handleClick = () => {
    onSelect(campaign);
    setNewCampaign(false);
  }
  
  return (
    <Card 
      className={`mb-1 hover:shadow-sm transition-shadow cursor-pointer ${isSelected ? 'border-indigo-600 bg-indigo-50 border-2' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-2 relative">
        <div className="mb-0.5 flex">
          <h3 className="text-xs font-medium truncate pr-6">{campaign.campaignCallName}</h3>
          <span 
              className={`inline-block px-1.5 py-0.5 text-[9px] rounded-lg ${statusStyles[campaign.status]}`}
            >
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <p className="text-[10px] text-gray-500">Started: {new Date(campaign.createdAt).toLocaleDateString()}</p>
            <p className="text-[10px] text-gray-500">ID: {campaign._id}</p>

          </div>
          
          {/* Delete button with animation */}
          <div 
            className={`absolute right-2 top-2 transition-all duration-200 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <button
              disabled={isDeleting === campaign._id}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(campaign._id);
              }}
              className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
            >
              {isDeleting === campaign._id ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CampaignCard; 
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Trash2, Copy } from "lucide-react";
import { Campaign } from "./types";

interface CampaignCardProps {
  campaign: Campaign;
  isSelected: boolean;
  onSelect: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  isDeleting: string | null;
  setNewCampaign: (newCampaign: boolean) => void;
  onDuplicate: (campaign: Campaign) => void;
  isDuplicating: string | null;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
  setNewCampaign,
  onDuplicate,
  isDuplicating,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Hide on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowConfirm(false);
      }
    };

    if (showConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirm]);

  const statusStyles = {
    // ongoing: 'bg-yellow-200 text-blue-800',
    // completed: 'bg-green-200 text-green-800',
    // draft: 'bg-gray-200 text-gray-800'
    ongoing: "bg-yellow-600 text-white dark:bg-yellow-500/50 dark:text-white",
    completed: "bg-green-600 text-white dark:bg-green-500/80 dark:text-white",
    draft: "bg-gray-600 text-white dark:bg-gray-500 dark:text-white",
  };
  const handleClick = () => {
    onSelect(campaign);
    setNewCampaign(false);
  };

  return (
    <Card
      className={`mb-2 rounded-[6px] border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer relative max-w-lvw mx-auto ${isSelected ? "border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-gray-900" : "dark:bg-gray-900 dark:border-gray-700"} dark:text-gray-200`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status badge: top right */}
      <span
        className={`absolute top-2 right-2 z-10 inline-block px-2 py-0.5 text-[10px] rounded-[4px] opacity-75 font-semibold whitespace-nowrap ${statusStyles[campaign.status]} dark:bg-gray-700 dark:text-gray-200`}
      >
        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
      </span>
      <div className="p-3 flex flex-col gap-1 min-w-0 pb-2 pr-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-medium flex-1 pr-2 truncate overflow-hidden text-ellipsis max-w-50 text-nowrap">
            {campaign.campaignCallName}
          </h3>
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-[11px] text-gray-500 truncate">
            Started: {new Date(campaign.createdAt).toLocaleDateString()}
          </p>
          <p className="text-[11px] text-gray-400 truncate">
            ID: {campaign._id}
          </p>
        </div>
      </div>
      {/* Delete and Copy buttons: bottom right */}
      <div
        className={`absolute bottom-1 right-2 z-10 flex flex-row items-end gap-1 transition-all duration-200
          opacity-100 scale-100
        `}
        ref={popoverRef}
      >
        {/* Copy button */}
        <button
          disabled={isDuplicating === campaign._id}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDuplicate(campaign);
          }}
          className="text-gray-500 hover:text-indigo-600 transition-colors p-1"
          title="Duplicate campaign"
        >
          {isDuplicating === campaign._id ? (
            <div className="w-4 h-4 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
          ) : (
            <Copy className="w-4.5 h-4.5 pb-1" />
          )}
        </button>
        {/* Delete button */}
        <button
          disabled={isDeleting === campaign._id}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowConfirm((prev) => !prev);
            // onDelete(campaign._id);
          }}
          className="group text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full"
        >
          {isDeleting === campaign._id ? (
            <div className="w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></div>
          ) : (
            <div className="w-6 h-6 relative pt-1">
              <svg
                viewBox="0 0 30 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full text-current"
              >
                {/* Lid */}
                <g className="transition-transform duration-300 ease-in-out group-hover:-translate-y-0.5 group-hover:-rotate-20 origin-center">
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <path d="M3 6h18" />
                </g>

                {/* Body */}
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />

                {/* Trash lines */}
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
          )}
        </button>
        {showConfirm && (
          <div className="absolute top-5 -right-2 w-max bg-white border border-gray-300 shadow-lg rounded-[6px] z-25">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(campaign._id);
                setShowConfirm(false);
              }}
              className="text-red-600 hover:text-red-700 text-[10px] font-light px-1 pb-1 transition-colors rounded-[6px]"
            >
              Delete Campaign
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CampaignCard;

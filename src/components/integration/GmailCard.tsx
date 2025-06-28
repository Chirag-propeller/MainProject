// components/GmailCard.tsx
"use client"
import React from 'react';
import axios from 'axios';
import { MailIcon } from 'lucide-react';

type GmailCardProps = {
  endpoint: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
};
// window.location.href
const GmailCard: React.FC<GmailCardProps> = ({ endpoint, onSuccess, onError }) => {
  const handleClick = async () => {
    try {
      const response = await axios.post(endpoint, {
        sender_email_name: "Sender 101",
      });
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error('Gmail integration failed', error);
      if (onError) onError(error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-4 w-[30%] rounded-2xl shadow-md hover:shadow-lg dark:hover:shadow-gray-700/20 transition bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center space-x-4 hover:border-red-200 dark:hover:border-red-600"
    >
      <MailIcon className="text-red-600 dark:text-red-400" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Connect Gmail</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Click to authenticate with your Gmail account.</p>
      </div>
    </div>
  );
};

export default GmailCard;

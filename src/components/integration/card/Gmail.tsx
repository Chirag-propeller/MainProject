"use client"
import React from 'react';
import axios from 'axios';
import { Building2, Mail, Zap } from 'lucide-react';

type GmailCardProps = {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
};

const GmailCard: React.FC<GmailCardProps> = ({ onSuccess, onError }) => {
    const endpoint = "/api/integration/gmail/auth"
  const handleClick = async () => {
    try {
        // window.location.href = "/api/integration/crm/zoho/auth"
    //   const response = await axios.get(endpoint);
    window.location.href = endpoint;

    //   if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error('Google Sheet integration failed', error);
      if (onError) onError(error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-4 w-[30%] rounded-2xl shadow-md hover:shadow-lg transition bg-white border flex items-center space-x-4 hover:border-orange-200"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
        <Mail className="text-orange-600 w-6 h-6" />
        {/* <Building2 className="text-orange-600 w-6 h-6" /> */}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">Gmail</h3>
        <p className="text-sm text-gray-500">Connect your Gmail to send emails.</p>
      </div>
      <div className="flex items-center justify-center">
        <Zap className="text-orange-500 w-4 h-4" />
      </div>
    </div>
  );
};

export default GmailCard; 
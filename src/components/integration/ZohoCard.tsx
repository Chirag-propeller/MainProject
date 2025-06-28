"use client"
import React from 'react';
import axios from 'axios';
import { Building2, Zap } from 'lucide-react';

type ZohoCardProps = {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
};

const ZohoCard: React.FC<ZohoCardProps> = ({ onSuccess, onError }) => {
    const endpoint = "/api/integration/crm/zoho/auth"
  const handleClick = async () => {
    try {
        // window.location.href = "/api/integration/crm/zoho/auth"
    //   const response = await axios.get(endpoint);
    window.location.href = endpoint;

    //   if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error('Zoho integration failed', error);
      if (onError) onError(error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-4 w-[30%] rounded-2xl shadow-md hover:shadow-lg dark:hover:shadow-gray-700/20 transition bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center space-x-4 hover:border-orange-200 dark:hover:border-orange-600"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
        <Building2 className="text-orange-600 dark:text-orange-400 w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Zoho CRM</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Connect your Zoho CRM to sync contacts and opportunities.</p>
      </div>
      <div className="flex items-center justify-center">
        <Zap className="text-orange-500 dark:text-orange-400 w-4 h-4" />
      </div>
    </div>
  );
};

export default ZohoCard; 
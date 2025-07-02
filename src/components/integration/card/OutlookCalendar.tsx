"use client"
import React from 'react';
import axios from 'axios';
import { Calendar, Zap } from 'lucide-react';

type OutlookCalendarCardProps = {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
};

const OutlookCalendarCard: React.FC<OutlookCalendarCardProps> = ({ onSuccess, onError }) => {
    const endpoint = "/api/integration/outlookCalendar/auth"
  const handleClick = async () => {
    try {
        // window.location.href = "/api/integration/outlookCalendar/auth"
    //   const response = await axios.get(endpoint);
    window.location.href = endpoint;

    //   if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error('Outlook Calendar integration failed', error);
      if (onError) onError(error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-4 w-[30%] rounded-2xl shadow-md hover:shadow-lg transition bg-white border flex items-center space-x-4 hover:border-blue-200"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
        <Calendar className="text-blue-600 w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">Outlook Calendar</h3>
        <p className="text-sm text-gray-500">Connect your Outlook Calendar to manage events.</p>
      </div>
      <div className="flex items-center justify-center">
        <Zap className="text-blue-500 w-4 h-4" />
      </div>
    </div>
  );
};

export default OutlookCalendarCard; 
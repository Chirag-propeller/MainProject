"use client"
import React from 'react';
import { ZohoCard, GmailCard } from './index';
import { toast } from 'react-hot-toast';

const IntegrationExample: React.FC = () => {
  const handleSuccess = (response: any) => {
    toast.success('Integration connected successfully!');
    console.log('Integration success:', response);
  };

  const handleError = (error: any) => {
    toast.error('Failed to connect integration');
    console.error('Integration error:', error);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h1>
        <p className="text-gray-600">Connect your favorite tools and services to enhance your workflow.</p>
      </div>
      
      <div className="flex flex-wrap gap-6">
        <ZohoCard 
          onSuccess={handleSuccess}
          onError={handleError}
        />
        <GmailCard 
          endpoint="/api/integrations/gmail"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default IntegrationExample; 
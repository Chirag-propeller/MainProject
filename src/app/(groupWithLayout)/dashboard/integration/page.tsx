"use client"
import { ZohoCard } from '@/components/integration';
import GoogleSheetCard from '@/components/integration/card/GoogleSheet';
import GmailCard from '@/components/integration/card/Gmail';
import React, { useState, useEffect } from 'react'

const page = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSuccess = (data: any) => {
    console.log('Integration success:', data);
  };

  const handleError = (error: any) => {
    console.error('Integration error:', error);
  };
  const url = "https://numbersfetchfastapi-f4hba2arduckbmf8.eastus2-01.azurewebsites.net/create-token"

  if (loading) {
    return (
      <div className='pl-2'>
        <div className='text-xl py-2 my-2'>Integration</div>
        <div className='flex flex-row flex-wrap gap-4 animate-pulse'>
          {/* Integration cards skeleton - matching actual card structure */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="cursor-pointer p-4 w-[30%] rounded-2xl shadow-md bg-white border border-gray-200 flex items-center space-x-4">
              {/* Icon container skeleton */}
              <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              
              {/* Right icon skeleton */}
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='pl-2'>
      <div className='text-xl py-2 my-2'>Integration</div>
      <div className='flex flex-row flex-wrap gap-4'>
        <ZohoCard
          onSuccess={handleSuccess}
          onError={handleError}
        />
        {/* Coming soon ...  */}
        
      {/* <GmailCard
        endpoint={url}
        onSuccess={handleSuccess}
        onError={handleError}
      /> */}
      <GoogleSheetCard
        onSuccess={handleSuccess}
        onError={handleError}
      />
      <GmailCard
        onSuccess={handleSuccess}
        onError={handleError}
      />
      </div>
    </div>
  )
}

export default page
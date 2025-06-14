"use client"
import { ZohoCard } from '@/components/integration';
import GoogleSheetCard from '@/components/integration/card/GoogleSheet';
import GmailCard from '@/components/integration/card/Gmail';
import React from 'react'

const page = () => {

  const handleSuccess = (data: any) => {
    console.log('Integration success:', data);
  };

  const handleError = (error: any) => {
    console.error('Integration error:', error);
  };
  const url = "https://numbersfetchfastapi-f4hba2arduckbmf8.eastus2-01.azurewebsites.net/create-token"

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
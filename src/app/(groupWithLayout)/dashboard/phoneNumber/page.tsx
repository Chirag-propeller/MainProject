"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import InputForm from '@/components/phoneNumber/InputForm';
import List from '@/components/phoneNumber/List';
import { Suspense } from 'react'
import { Phone } from 'lucide-react'

interface Phone {
  phoneNumber: string;
  name?: string;
  createdAt?: string;
  // Add other fields here
}

// This component contains all the logic that uses useSearchParams
const PhoneNumberContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPhoneNumber = searchParams?.get('phone') || '';

  const [showInputForm, setShowInputForm] = useState<boolean>(false);
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [selectedPhoneRecord, setSelectedPhoneRecord] = useState<Phone | null>(null);

  const handleModalClose = () => {
    setShowInputForm(false);
    setRefreshList(prev => !prev);
  };

  const setSelectedPhoneNumber = (phone: string) => {
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set('phone', phone);
    router.push(`?${newParams.toString()}`);
  };

  useEffect(() => {
    console.log("Selected phone number from URL:", selectedPhoneNumber);
  }, [selectedPhoneNumber]);

  return (
    <div className="flex h-full" style={{ height: 'calc(100vh - 12px)' }}>
      {/* Left sidebar with phone number list (25% width) */}
      <div className="w-1/4">
        <div className="w-full border-gray-200 border-t-0 flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
          {/* Header with title and create button */}
          <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <div className='flex gap-1.5'>
              <Phone className='w-3.5 h-3.5 self-center text-indigo-600' />
              <h1 className="text-lg self-center text-indigo-600">Phone Numbers</h1>
            </div>

            <Button 
              onClick={() => setShowInputForm(true)}
              className='px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-300'
            >
              Create
            </Button>
          </div>

          {/* List of phone numbers */}
          <div className="flex-1 overflow-y-auto p-3">
            <List
              selectedPhoneNumber={selectedPhoneNumber}
              refreshTrigger={refreshList}
              setSelectedPhoneRecord={(record) => {
                setSelectedPhoneRecord(record);
                const newParams = new URLSearchParams(searchParams?.toString());
                newParams.set('phone', record?.phoneNumber || "");
                router.push(`?${newParams.toString()}`);
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content area (75% width) */}
      <div className="w-3/4 overflow-auto">
        {selectedPhoneRecord ? (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Phone Number Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-lg font-medium text-gray-900">{selectedPhoneRecord.phoneNumber}</p>
                </div>
                {selectedPhoneRecord.name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg font-medium text-gray-900">{selectedPhoneRecord.name}</p>
                  </div>
                )}
                {selectedPhoneRecord.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-lg font-medium text-gray-900">{selectedPhoneRecord.createdAt}</p>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button onClick={() => alert("Edit logic goes here")}>Edit</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            Select a phone number to view details
          </div>
        )}
      </div>

      {showInputForm && <InputForm onClose={handleModalClose} />}
    </div>
  );
};

// This is the main page component that wraps the content in Suspense
const PhoneNumber = () => {
  return (
    <Suspense fallback={<div>Loading phone numbers...</div>}>
      <PhoneNumberContent />
    </Suspense>
  );
};

export default PhoneNumber;
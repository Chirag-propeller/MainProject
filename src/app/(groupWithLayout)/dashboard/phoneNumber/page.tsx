
"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import InputForm from '@/components/phoneNumber/InputForm';
import List from '@/components/phoneNumber/List';
import { Suspense } from 'react'

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
    <div className="flex justify-between">
      <div className="w-[30%] bg-gray-100 p-2 h-[90vh] rounded-md mx-2">
        <div className="flex justify-between">
          <p className="text-xl">Phone Number</p>
          <Button className="cursor-pointer h-7 w-7" onClick={() => setShowInputForm(true)}>+</Button>
        </div>
        <div className="mt-2">
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

      <div className="w-[70%] bg-gray-100 p-2 h-[90vh] rounded-md">
        {selectedPhoneRecord ? (
          <div>
            <p><strong>Phone:</strong> {selectedPhoneRecord.phoneNumber}</p>
            <p><strong>Name:</strong> {selectedPhoneRecord.name}</p>
            <p><strong>Created:</strong> {selectedPhoneRecord.createdAt}</p>
            <Button onClick={() => alert("Edit logic goes here")}>Edit</Button>
          </div>
        ) : (
          <p>Select a phone number to view details</p>
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
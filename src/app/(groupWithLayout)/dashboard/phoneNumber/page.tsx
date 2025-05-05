// "use client"
// import { Button } from '@/components/ui/button'
// import React, { useEffect } from 'react'
// import { useState } from 'react'
// import InputForm from '@/components/phoneNumber/InputForm'
// import List from '@/components/phoneNumber/List'
// // import { useRouter } from 'next/router'
// import { useSearchParams, useRouter  } from 'next/navigation'




// const page = () => {

//   const route = useRouter();
//   const searchParam = useSearchParams();

//   const [showInputForm , setShowInputForm ] = useState<boolean>(false)
//   const [refreshList, setRefreshList] = useState<boolean>(false);
//   const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");

//   const handleModalClose = () => {
//     setShowInputForm(false);
//     setRefreshList((prev) => !prev); // Toggle to trigger List refresh
//   };


//   useEffect(
//     ()=>{
//       console.log(selectedPhoneNumber);
//     }
//     ,[selectedPhoneNumber])

//   return (
//     <div className='flex justify-between'>
//       <div className='w-[30%] bg-gray-100 p-2 h-[90vh] rounded-md mx-2'>
//         <div className='flex justify-between'>
//           <p className='text-xl'> Phone Number </p>
//           {/* <Button className='cursor-pointer' onClick={()=> setShowCreateNewAgent(true)}>+ Create Agent</Button> */}
          
//           <Button className='cursor-pointer h-7 w-7' onClick={()=> setShowInputForm(true)} >+</Button>
//         </div>
//         <div className='mt-2'>
//           <List selectedPhoneNumber={selectedPhoneNumber} refreshTrigger={refreshList} setSelectedPhoneNumber={setSelectedPhoneNumber}/>
//         </div>
//       </div>
//       <div className='flex justify-between w-[70%] bg-gray-100 p-2 h-[90vh] rounded-md '>
        
//       </div>
//       <div>
//         {
//           showInputForm && <InputForm onClose={handleModalClose}  />
//         }
//         {/* {
//           showCreateNewAgent && <CreateNewAgent onClose={()=> setShowCreateNewAgent(false)}/>
//         } */}
//       </div>
//     </div>
//   )
// }

// export default page




"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import InputForm from '@/components/phoneNumber/InputForm';
import List from '@/components/phoneNumber/List';

interface Phone {
  phoneNumber: string;
  name?: string;
  createdAt?: string;
  // Add other fields here
}

const Page = () => {
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

          {/* <List
            selectedPhoneNumber={selectedPhoneNumber}
            refreshTrigger={refreshList}
            setSelectedPhoneNumber={setSelectedPhoneNumber}
          /> */}
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

        {/* {selectedPhoneNumber ? (
          <div>
            <p className="text-lg font-semibold">Details for: {selectedPhoneNumber}</p> */}
            {/* Replace this with your editable form
            <Button onClick={() => alert(`Edit ${selectedPhoneNumber}`)}>Edit</Button>
          </div>
        ) : (
          <p className="text-gray-600">Select a phone number to view details</p>
        )} */}
      </div>

      {showInputForm && <InputForm onClose={handleModalClose} />}
    </div>
  );
};

export default Page;

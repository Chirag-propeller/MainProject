"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import { useState } from 'react'
import InputForm from '@/components/phoneNumber/InputForm'
import List from '@/components/phoneNumber/List'



const page = () => {

  const [showInputForm , setShowInputForm ] = useState<boolean>(false)
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");

  const handleModalClose = () => {
    setShowInputForm(false);
    setRefreshList((prev) => !prev); // Toggle to trigger List refresh
  };


  useEffect(
    ()=>{
      console.log(selectedPhoneNumber);
    }
    ,[selectedPhoneNumber])

  return (
    <div className='flex justify-between'>
      <div className='w-[30%] bg-gray-100 p-2 h-[90vh] rounded-md mx-2'>
        <div className='flex justify-between'>
          <p className='text-xl'> Phone Number </p>
          {/* <Button className='cursor-pointer' onClick={()=> setShowCreateNewAgent(true)}>+ Create Agent</Button> */}
          
          <Button className='cursor-pointer h-7 w-7' onClick={()=> setShowInputForm(true)} >+</Button>
        </div>
        <div className='mt-2'>
          <List selectedPhoneNumber={selectedPhoneNumber} refreshTrigger={refreshList} setSelectedPhoneNumber={setSelectedPhoneNumber}/>
        </div>
      </div>
      <div className='flex justify-between w-[70%] bg-gray-100 p-2 h-[90vh] rounded-md '>
        
      </div>
      <div>
        {
          showInputForm && <InputForm onClose={handleModalClose}  />
        }
        {/* {
          showCreateNewAgent && <CreateNewAgent onClose={()=> setShowCreateNewAgent(false)}/>
        } */}
      </div>
    </div>
  )
}

export default page
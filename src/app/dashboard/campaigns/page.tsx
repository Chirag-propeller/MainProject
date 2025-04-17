"use client"
import CreateNewAgent from '@/components/agent/CreateNewAgent'
import Table from '@/components/campaigns/Table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useState } from 'react'
import InputForm from '@/components/phoneNumber/InputForm'
import List from '@/components/phoneNumber/List'



const page = () => {

  return (
    <div className=''>
         <div className='flex justify-between'>
          <p className='text-xl'> Campaign Calls </p>
          {/* <Button className='cursor-pointer' onClick={()=> setShowCreateNewAgent(true)}>+ Create Agent</Button> */}
          <Link href="/createCampaign">
          <Button className='cursor-pointer' >Create Campaign</Button>
          </Link>
          
        </div>
        <div>
          <Table/>
        </div>
    </div>
  )
}

export default page
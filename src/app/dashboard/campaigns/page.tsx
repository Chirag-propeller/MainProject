"use client"
import CreateNewAgent from '@/components/agent/CreateNewAgent'
import Table from '@/components/campaigns/Table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useState } from 'react'
import InputForm from '@/components/phoneNumber/InputForm'
import List from '@/components/phoneNumber/List'
import Sidebar from '@/components/sidebar'
import Footer from '@/components/Footer'



const page = () => {

  return (
    <>
    <div className='flex'>
      <Sidebar/>
        <div className="ml-64 p-6 w-full">
        <div className='flex justify-between'>
          <p className='text-xl'> Campaign Calls </p>
          {/* <Button className='cursor-pointer' onClick={()=> setShowCreateNewAgent(true)}>+ Create Agent</Button> */}
          {/* src\app\dashboard\campaigns\createCampaign */}
          <Link href="/dashboard/campaigns/createCampaign">
          <Button className='cursor-pointer' >Create Campaign</Button>
          </Link>
          
        </div>
        <div>
          <Table/>
        </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default page
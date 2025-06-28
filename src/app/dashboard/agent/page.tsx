"use client"
import CreateNewAgent from '@/components/agent/CreateNewAgent'
import Table from '@/components/agent/Table'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'



const page = () => {

  const [showCreateNewAgent , setShowCreateNewAgent ] = useState<boolean>(false)


  return (
    <>
    <div className='flex bg-gray-50 dark:bg-gray-950 min-h-screen'>
      {/* <div className='fixed flex justify-between bg-white  '> */}
      {/* <div className="fixed top-0 left-0 w-full bg-white p-4 flex justify-between"> */}
      <Sidebar/>
      <div className="ml-64 p-6 w-full bg-gray-50 dark:bg-gray-950">
        <div className="fixed left-64 top-0 right-0 z-50 bg-gray-50 dark:bg-gray-950 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">


        <p className='text-gray-900 dark:text-gray-100 font-semibold text-lg'> Agent </p>
        {/* <Button className='cursor-pointer' onClick={()=> setShowCreateNewAgent(true)}>+ Create Agent</Button> */}

        <Link href="/dashboard/agent/newAgent"><Button className='cursor-pointer'>+ Create Agent</Button></Link>
        </div>
        <div>
        {
          showCreateNewAgent && <CreateNewAgent onClose={()=> setShowCreateNewAgent(false)}/>
        }
        </div>
        <Table/>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default page
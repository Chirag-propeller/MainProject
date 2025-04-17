"use client"
import CreateNewAgent from '@/components/agent/CreateNewAgent'
import Table from '@/components/agent/Table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'



const page = () => {

  const [showCreateNewAgent , setShowCreateNewAgent ] = useState<boolean>(false)


  return (
    <div>
      {/* <div className='fixed flex justify-between bg-white  '> */}
      {/* <div className="fixed top-0 left-0 w-full bg-white p-4 flex justify-between"> */}
      <div className="fixed left-64 top-0 right-0 z-50 bg-white p-4 flex justify-between items-center">


        <p className='to-blue-700'> Agent </p>
        {/* <Button className='cursor-pointer' onClick={()=> setShowCreateNewAgent(true)}>+ Create Agent</Button> */}
        
        <Link href="/newAgent"><Button className='cursor-pointer'>+ Create Agent</Button></Link>
      </div>
      <div>
        {
          showCreateNewAgent && <CreateNewAgent onClose={()=> setShowCreateNewAgent(false)}/>
        }
      </div>
      <Table/>
    </div>
  )
}

export default page
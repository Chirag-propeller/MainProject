"use client"
import Sidebar from '@/components/sidebar'
import Logout from '@/components/user/Logout'
import React from 'react'

const page = () => {



  return (
    <div className='flex'>
      <Sidebar/>

      <div className="ml-64 p-6 w-full">
        <div className="fixed left-64 top-0 right-0 z-50 bg-white p-4 flex justify-between items-center">


        <p className=''> Profile </p>
        <Logout/>
        </div>
      </div>
    </div>
  )
}

export default page
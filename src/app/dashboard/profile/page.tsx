"use client"
import Sidebar from '@/components/sidebar'
import ProfileDashboard from '@/components/profile/ProfileDashboard'
import React from 'react'

const page = () => {



  return (
    <div className='flex'>
      <Sidebar/>

      <div className="ml-64 p-6 w-full">
        <ProfileDashboard />
      </div>
    </div>
  )
}

export default page
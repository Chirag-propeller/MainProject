"use client"
import Sidebar from '@/components/sidebar'
import ProfileDashboard from '@/components/profile/ProfileDashboard'
import React from 'react'

const page = () => {

  return (
    <div className='p-1 bg-white dark:bg-gray-950 min-h-screen'>
      <ProfileDashboard />
    </div>
  )
}

export default page
import React from 'react'
import Sidebar from '@/components/sidebar'
import ProfileCard from './ProfileCard'
import UserStats from './UserStats'
// import LogoutButton from './LogoutButton'
import { UserDataProvider } from './UserDataContext'
import Logout from '../user/Logout'

const ProfileDashboard = () => {
  return (
    <div className='flex'>
      <div className="fixed left-64 top-0 right-0 z-50 bg-white p-4 flex justify-between items-center border-b border-gray-200">
        <p className='text-xl font-semibold text-gray-800'>Profile</p>
        {/* <LogoutButton /> */}
        <Logout/>
      </div>
      
      <UserDataProvider>
        <div className="mt-20 px-8 pb-8 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Profile information */}
            <div className="lg:col-span-7">
              <ProfileCard />
            </div>
            
            {/* Usage statistics */}
            <div className="lg:col-span-5">
              <UserStats />
            </div>
          </div>
        </div>
      </UserDataProvider>
    </div>
  )
}

export default ProfileDashboard
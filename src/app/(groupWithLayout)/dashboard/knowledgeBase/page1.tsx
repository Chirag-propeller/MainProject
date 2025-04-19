'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import AddKnowledgeBaseModal from '@/components/knowledgeBase/AddKnowledgeBaseModal'

const Page = () => {


  const [showModal, setShowModal] = useState(false)

  return (
    <div className='flex justify-between relative'>
      {/* Sidebar */}
      <div className='w-[30%] bg-gray-100 p-2 h-[90vh] rounded-md mx-2'>
        <div className='flex justify-between items-center'>
          <p className='text-xl'>Knowledge Base</p>
          <Button className='cursor-pointer h-7 w-7' onClick={() => setShowModal(true)}>+</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex justify-center items-center w-[70%] bg-gray-100 p-2 h-[90vh] rounded-md'>

      </div>

      {showModal && (
        <AddKnowledgeBaseModal
          onClose={() => setShowModal(false)}

        />
      )}


    </div>
  )
}

export default Page

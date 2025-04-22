'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import AddKnowledgeBaseModal from '@/components/knowledgeBase/AddKnowledgeBaseModal'
// import KnowledgeBaseList from '@/components/knowledgeBase/KnowledgeBaseList'
import KnowledgeBaseDetails from '@/components/knowledgeBase/KnowledgeBaseDetails'
import KnowledgeBaseList from '@/components/knowledgeBase/KnowledgeBaseList'

const Page = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedKB, setSelectedKB] = useState<any>(null)

  return (
    <div className='flex justify-between relative'>
      {/* Sidebar */}
      <div className='w-[30%] bg-gray-100 p-2 h-[90vh] rounded-md mx-2'>
        <div className='flex justify-between items-center mb-4'>
          <p className='text-xl'>Knowledge Base</p>
          <Button className='cursor-pointer h-7 w-7' onClick={() => setShowModal(true)}>+</Button>
        </div>

        <KnowledgeBaseList
          onSelect={(kb) => setSelectedKB(kb)}
          selectedId={selectedKB?._id}
        />
      </div>

      {/* Main Content */}
      <div className='w-[70%] bg-gray-100 p-2 h-[90vh] rounded-md overflow-y-auto'>
        {selectedKB ? (
          <KnowledgeBaseDetails kb={selectedKB} />
        ) : (
          <div className='flex justify-center items-center h-full text-gray-400'>
            Select a knowledge base to view details
          </div>
        )}
      </div>

      {showModal && (
        <AddKnowledgeBaseModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default Page

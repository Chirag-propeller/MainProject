'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import AddKnowledgeBaseModal from '@/components/knowledgeBase/AddKnowledgeBaseModal'
import KnowledgeBaseDetails from '@/components/knowledgeBase/KnowledgeBaseDetails'
import KnowledgeBaseList from '@/components/knowledgeBase/KnowledgeBaseList'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { BookOpen } from 'lucide-react'

// Create a separate component for the content that uses useSearchParams
const KnowledgeBaseContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedKB, setSelectedKB] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  // Update selectedKB if id param changes
  useEffect(() => {
    const fetchKBById = async (id: string) => {
      try {
        const res = await fetch(`/api/knowledgeBase/get?id=${id}`)
        const data = await res.json()
        setSelectedKB(data.knowledgeBase)
      } catch (err) {
        console.error('Failed to fetch selected KB:', err)
      }
    }

    const id = searchParams?.get('id')
    if (id) {
      fetchKBById(id)
    } else {
      setSelectedKB(null)
    }
  }, [searchParams])

  return (
    <div className="flex h-full" style={{ height: 'calc(100vh - 12px)' }}>
      {/* Left sidebar with knowledge base list (25% width) */}
      <div className="w-1/4">
        <div className="w-full border-gray-200 border-t-0 flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
          {/* Header with title and create button */}
          <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <div className='flex gap-1.5'>
              <BookOpen className='w-3.5 h-3.5 self-center text-indigo-600' />
              <h1 className="text-lg self-center text-indigo-600">Knowledge Base</h1>
            </div>

            <Button 
              onClick={() => setShowModal(true)}
              className='px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-300'
            >
              Create
            </Button>
          </div>

          {/* List of knowledge bases */}
          <div className="flex-1 overflow-y-auto p-3">
            <KnowledgeBaseList
              showModal={showModal}
              onSelect={(kb) => setSelectedKB(kb)}
              selectedId={selectedKB?._id}
            />
          </div>
        </div>
      </div>
      
      {/* Main content area (75% width) */}
      <div className="w-3/4 overflow-auto">
        {selectedKB ? (
          <KnowledgeBaseDetails kb={selectedKB} />
        ) : (
          <div className='flex justify-center items-center h-full text-gray-500'>
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

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KnowledgeBaseContent />
    </Suspense>
  )
}

export default Page


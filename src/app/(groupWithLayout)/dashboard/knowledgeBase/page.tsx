'use client'

import React, { useState , useEffect} from 'react'
import { Button } from '@/components/ui/button'
import AddKnowledgeBaseModal from '@/components/knowledgeBase/AddKnowledgeBaseModal'
// import KnowledgeBaseList from '@/components/knowledgeBase/KnowledgeBaseList'
import KnowledgeBaseDetails from '@/components/knowledgeBase/KnowledgeBaseDetails'
import KnowledgeBaseList from '@/components/knowledgeBase/KnowledgeBaseList'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'


const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [selectedKB, setSelectedKB] = useState<any>(null)

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
    <Suspense fallback={<div>Loading...</div>}>
    <div className='flex justify-between relative'>
      {/* Sidebar */}
      <div className='w-[30%] bg-gray-100 p-2 h-[90vh] rounded-md mx-2'>
        <div className='flex justify-between items-center mb-4'>
          <p className='text-xl'>Knowledge Base</p>
          <Button className='cursor-pointer h-7 w-7' onClick={() => setShowModal(true)}>+</Button>
        </div>

        <KnowledgeBaseList
          showModal={showModal}
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
    </Suspense>
  )
}

export default Page

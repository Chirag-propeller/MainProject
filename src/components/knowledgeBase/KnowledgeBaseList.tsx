// components/knowledgeBase/KnowledgeBaseList.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'

interface KnowledgeBase {
  _id: string
  name: string
  files: { name: string, url?: string }[]
  links: string[]
}

interface Props {
  onSelect: (kb: KnowledgeBase| null) => void
  selectedId?: string 
  showModal?: boolean
}

const KnowledgeBaseList: React.FC<Props> = ({ onSelect, selectedId , showModal}) => {
  const [kbs, setKbs] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        const res = await fetch('/api/knowledgeBase/get')
        const data = await res.json()
        setKbs(data.knowledgeBases || [])
      } catch (err) {
        console.error('Failed to fetch knowledge bases:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchKnowledgeBases()
  }, [showModal])

  
  const deleteKnowledgeBase = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this knowledge base?')
    if (!confirm) return

    try {
      const res = await fetch('/api/knowledgeBase/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await res.json()
      if (result.success) {
        setKbs((prev) => prev.filter((kb) => kb._id !== id))
        onSelect(null);
        
      } else {
        alert(result.error || 'Delete failed')
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Delete failed')
    }
  }

  if (loading) return <p className='p-2'>Loading...</p>

  return (
    <div className='space-y-2'>
      {kbs.map((kb) => (
        <div
          key={kb._id}
          onClick={() => onSelect(kb)}
          className={`flex justify-between items-center cursor-pointer px-3 py-2 rounded-md hover:bg-gray-200 ${
            selectedId === kb._id ? 'bg-gray-300 font-semibold' : ''
          }`}
        >
        <span onClick={() => onSelect(kb)} className=" w-full ">{kb.name}</span>
          <button onClick={() => deleteKnowledgeBase(kb._id)} className="text-gray-600 ml-2 cursor-pointer hover:text-red-700">
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default KnowledgeBaseList

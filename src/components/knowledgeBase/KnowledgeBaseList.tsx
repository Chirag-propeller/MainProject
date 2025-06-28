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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (kbs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No knowledge bases found. Click Create to add your first knowledge base.
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      {kbs.map((kb) => (
        <div
          key={kb._id}
          className={`group p-2 px-2 border rounded-md mb-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer ${
            selectedId === kb._id 
              ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelect(kb)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {kb.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {kb.files?.length || 0} files • {kb.links?.length || 0} links
              </p>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation()
                deleteKnowledgeBase(kb._id)
              }} 
              className="ml-2 p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default KnowledgeBaseList

// components/knowledgeBase/KnowledgeBaseList.tsx
'use client'

import React, { useEffect, useState } from 'react'

interface KnowledgeBase {
  _id: string
  name: string
  files: { name: string, url?: string }[]
  links: string[]
}

interface Props {
  onSelect: (kb: KnowledgeBase) => void
  selectedId?: string
}

const KnowledgeBaseList: React.FC<Props> = ({ onSelect, selectedId }) => {
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
  }, [])

  if (loading) return <p className='p-2'>Loading...</p>

  return (
    <div className='space-y-2'>
      {kbs.map((kb) => (
        <div
          key={kb._id}
          onClick={() => onSelect(kb)}
          className={`cursor-pointer px-3 py-2 rounded-md hover:bg-gray-200 ${
            selectedId === kb._id ? 'bg-gray-300 font-semibold' : ''
          }`}
        >
          {kb.name}
        </div>
      ))}
    </div>
  )
}

export default KnowledgeBaseList

// components/knowledgeBase/KnowledgeBaseDetails.tsx
import React from 'react'

interface KnowledgeBase {
  _id: string
  name: string
  files: { name: string, url?: string }[]
  links: { _id: string; url: string }[];
}

interface Props {
  kb: KnowledgeBase
}

const KnowledgeBaseDetails: React.FC<Props> = ({ kb }) => {
  return (
    <div className='bg-white p-6 w-full h-full rounded shadow overflow-y-auto'>
      <h2 className='text-2xl font-bold mb-4'>{kb.name}</h2>

      {kb.files?.length > 0 && (
        <div className='mb-4'>
          <h3 className='text-lg font-semibold mb-1'>Files</h3>
          <ul className='list-disc list-inside'>
            {kb.files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

        {kb.links?.length > 0 && (
        <div>
            <h3 className='text-lg font-semibold mb-1'>Links</h3>
            <ul className='list-disc list-inside'>
            {kb.links.map((link, idx) => (
                <li key={link._id}>
                <a href={link.url} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>
                    {link.url}
                </a>
                </li>
            ))}
            </ul>
        </div>
        )}
    </div>
  )
}

export default KnowledgeBaseDetails

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
  console.log(kb);
  return (
    <div className='bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 w-full h-full rounded shadow overflow-y-auto'>
      <div className=' mb-4'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{kb.name}</h2>

      </div>
      
      

      {kb.files?.length > 0 && (
        <div className='mb-4'>
          <h3 className='text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100'>Files</h3>
          <ul className='list-disc list-inside text-gray-700 dark:text-gray-300'>
            {kb.files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

        {kb.links?.length > 0 && (
        <div>
            <h3 className='text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100'>Links</h3>
            <ul className='list-disc list-inside'>
            {kb.links.map((link, idx) => (
                <li key={link._id}>
                <a href={link.url} target='_blank' rel='noopener noreferrer' className='text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300'>
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

'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import CrawlModal from './CrawlModal'
import LinkSelectModal from './LinkSelectModal'
import FileCard from './uploads/FileCard'
import TextInputModal from './TextInputModal'


interface Props {
  onClose: () => void
}

const AddKnowledgeBaseModal: React.FC<Props> = ({
onClose,
}) => {
    const [kbName, setKbName] = useState('');
    const [websiteLinks, setWebsiteLinks] = useState<string[]>([])
    const [fileList, setFileList] = useState<File[]>([])
    const [showTextModal, setShowTextModal] = useState(false);
    const [textFiles, setTextFiles] = useState<string[]>([])
    const modalRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [url, setUrl] = useState('')
    const [links, setLinks] = useState<string[]>([])
    const [selectedLinks, setSelectedLinks] = useState<string[]>([])
    const [showCrawlModal, setShowCrawlModal] = useState(false)
    const [showLinksModal, setShowLinksModal] = useState(false)

    // FIle Ref here 
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const selectedFiles = Array.from(e.target.files);
      setFileList((prev) => [...prev, ...selectedFiles]);
    };


// 🔁 Crawl API fetch
const fetchLinks = async (url: string) => {
  try {
    const response = await fetch(`/api/knowledgeBase/get-links?url=${encodeURIComponent(url)}`)
    const data = await response.json()

    if (response.ok) {
      const cleanLinks = data.links
        .map((link: string) => link.split('#')[0])
        .filter((value: any, index: any, self: any) => self.indexOf(value) === index)

      setLinks(cleanLinks)
      setShowCrawlModal(false)
      setShowLinksModal(true)
    } else {
      console.error('Failed to fetch links:', data.error)
    }
  } catch (error) {
    console.error('Error fetching links:', error)
  }
}

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
  
      // ✅ Only close base modal if no other modal is open
      if (showCrawlModal || showLinksModal || showTextModal) return
  
      // if (modalRef.current && !modalRef.current.contains(target)) {
      //   onClose()
      // }

      if (modalRef.current && !modalRef.current.contains(target)) {
        onClose();
      }
      
  
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !document.getElementById('add-docs-button')?.contains(target)
      ) {
        setShowDropdown(false)
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, showCrawlModal, showLinksModal,showTextModal])
  
  // const handleSave = async () => {
  //   if (!kbName.trim()) {
  //     alert("Please enter a knowledge base name.");
  //     return;
  //   }
  
  //   const formData = new FormData();
  //   formData.append("name", kbName);
  //   fileList.forEach((file) => formData.append("files", file));
  //   selectedLinks.forEach((link) => formData.append("links", link));
  
  //   try {
  //     const response = await fetch('/api/knowledgeBase/uploads', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to create knowledge base.');
  //     }
  
  //     const data = await response.json();
  //     console.log("Knowledge Base Created:", data);
  //     onClose();
  //   } catch (err) {
  //     console.error("Error:", err);
  //     alert("Something went wrong. Please try again.");
  //   }
  // };
  
  const handleSave = async () => {
    if (!kbName.trim()) {
      alert("Please enter a knowledge base name.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", kbName);
    formData.append("userId", "Admin01"); // Optional but useful if you're planning multi-user later
  
    // Fix 1: Send file(s) under 'file', not 'files' to match server parsing
    fileList.forEach((file) => formData.append("file", file)); // ✅ use "file" not "files"
  
    // Fix 2: links should be JSON.stringify-ed array
    if (websiteLinks.length > 0) {
      formData.append("links", JSON.stringify(websiteLinks)); // ✅ match server expectation
    }

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    
    console.log(websiteLinks)
    // console.log(selectedLinks)
    try {
      const response = await fetch('/api/knowledgeBase/uploads', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to create knowledge base.');
      }
  
      const data = await response.json();
      console.log("Knowledge Base Created:", data);
      onClose();
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };
  


  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      
      {showTextModal && (
          <TextInputModal
            onClose={() => setShowTextModal(false)}
            onSave={(file) => setFileList((prev) => [...prev, file])}
          />
        )}

        
        {showCrawlModal && (
            <CrawlModal
                onClose={() => setShowCrawlModal(false)}
                onSubmit={() => fetchLinks(url)}
                url={url}
                setUrl={setUrl}
            />
            )}

            {showLinksModal && (
            <LinkSelectModal
                links={links}
                selectedLinks={selectedLinks}
                setSelectedLinks={setSelectedLinks}
                onClose={() => {
                setShowLinksModal(false)
                setSelectedLinks([])
                }}
                onSave={() => {
                setWebsiteLinks((prev) => [...prev, ...selectedLinks])
                setShowLinksModal(false)
                setSelectedLinks([])
                }}
            />
            )}

      <div
        ref={modalRef}
        className='bg-white rounded-md p-6 w-[400px] shadow-lg flex flex-col gap-4 relative'
      >
        <h2 className='text-xl font-semibold'>Add Knowledge Base</h2>

        <div>
          <label className='text-sm font-medium'>Knowledge Base Name</label>
          {/* <input type='text' placeholder='Enter' className='w-full p-2 mt-1 border rounded-md' /> */}
          <input
            type='text'
            placeholder='Enter'
            className='w-full p-2 mt-1 border rounded-md'
            value={kbName}
            onChange={(e) => setKbName(e.target.value)}
          />

        </div>

        <div className='relative'>
            <label className='text-sm font-medium'>Documents</label>
              
            <div className='flex justify-start items-center mt-1'>
                <Button
                id="add-docs-button"
                type='button'
                className='h-8 px-3'
                onClick={() => setShowDropdown(!showDropdown)}
                >
                Add
                </Button>
            </div>
            {/* {fileList.length > 0 && (
                <ul className='mt-2 text-sm text-gray-700 space-y-1'>
                  {fileList.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )} */}
            {fileList.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 max-h-40 overflow-y-auto">
                {fileList.map((file, idx) => (
                  <FileCard
                    key={idx}
                    file={file}
                    onRemove={() =>
                      setFileList((prev) => prev.filter((_, i) => i !== idx))
                    }
                  />
                ))}
              </div>
            )}
            {websiteLinks.length > 0 && (
                <div className="mt-2 text-sm text-blue-600">
                  {websiteLinks.map((link, idx) => (
                    <p key={idx}>{link}</p>
                  ))}
                </div>
              )}

            {/* Dropdown panel */}
            {showDropdown && (
                <div
                ref={dropdownRef}
                
                className='absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-[250px] z-50 p-2'
 
                >
                <div className='text-sm font-medium px-2 py-1 cursor-pointer hover:bg-gray-100 rounded'
                    onClick={() => {
                    setShowDropdown(false)
                    setShowCrawlModal(true)
                  }}
                >
                    Add Web Pages
                    <p className='text-xs text-gray-500 px-2 mb-2'>Crawl and sync your website</p>
                </div>


                <div className='text-sm font-medium px-2 py-1 cursor-pointer hover:bg-gray-100 rounded'
                  onClick={() => {
                    setShowDropdown(false);
                    fileInputRef.current?.click(); // 👈 trigger the file input
                    }}
                >
                    Upload Files
                    <p className='text-xs text-gray-500 px-2 mb-2'>File size should be less than 100MB</p>
                </div>


                <div className='text-sm font-medium px-2 py-1 cursor-pointer hover:bg-gray-100 rounded'
                    onClick={() => {
                      setShowDropdown(false);
                      setShowTextModal(true);
                    }}
                >
                    Add Text
                    <p className='text-xs text-gray-500 px-2'>Add articles manually</p>
                </div>

                </div>
            )}
        </div>


        <div className='flex justify-end gap-2 mt-4'>
          <Button variant='default' onClick={onClose}>
            Cancel
          </Button>
          {/* <Button
            onClick={() => {
              // Save logic here
              onClose()
            }}
          >
            Save
          </Button> */}

          <Button onClick={handleSave}>Save</Button>

        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        hidden
        onChange={handleFileSelect}
      />

    </div>
  )
}

export default AddKnowledgeBaseModal

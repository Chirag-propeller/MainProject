'use client';

import { Button } from '@/components/ui/button';
import React, { useState, useRef, useEffect } from 'react';

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);

  const linksModalRef = useRef<HTMLDivElement | null>(null);
  const urlModalRef = useRef<HTMLDivElement | null>(null);

  // Close only top modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // First check the topmost modal (Links Modal)
      if (showLinksModal) {
        if (
          linksModalRef.current &&
          !linksModalRef.current.contains(event.target as Node)
        ) {
          setShowLinksModal(false);
          return; // Don't continue if you already closed one
        }
      } else if (showModal) {
        if (
          urlModalRef.current &&
          !urlModalRef.current.contains(event.target as Node)
        ) {
          setShowModal(false);
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal, showLinksModal]);
  
  

  const fetchLinks = async (url: string) => {
    try {
      const response = await fetch(`/api/knowledgeBase/get-links?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (response.ok) {
        const cleanLinks = data.links
          .map((link: string) => link.split('#')[0])
          .filter((value: any, index:any, self:any) => self.indexOf(value) === index);
        setLinks(cleanLinks);
        setShowModal(false);
        setShowLinksModal(true);
      } else {
        console.error('Failed to fetch links:', data.error);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLinks(url);
  };

  const handleCheckboxChange = (link: string) => {
    setSelectedLinks((prev) =>
      prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]
    );
  };

  return (
    <div className='flex justify-between'>
      {/* Sidebar */}
      <div className='w-[30%] bg-gray-100 p-2 h-[90vh] rounded-md mx-2'>
        <div className='flex justify-between'>
          <p className='text-xl'>Knowledge Base</p>
          <Button className='cursor-pointer h-7 w-7' onClick={() => setShowModal(true)}>+</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-[70%] bg-gray-100 p-2 h-[90vh] rounded-md'></div>

      {/* URL Input Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-gray-700/50 z-40 flex items-center justify-center'>
          <div
            ref={urlModalRef}
            className='bg-white p-6 rounded-md shadow-lg w-full max-w-md'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-xl font-semibold mb-4'>Enter URL</h2>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder='https://example.com'
                className='border border-gray-300 rounded w-full px-3 py-2 mb-4'
              />
              <div className='flex justify-end gap-2'>
                <Button type='button' onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type='submit'>Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Links Modal */}
      {showLinksModal && (
        <div className='fixed inset-0 bg-gray-800/60 z-50 flex items-center justify-center'>
          <div
            ref={linksModalRef}
            className='bg-white p-6 rounded-md shadow-lg w-[50vw] max-h-[90vh] overflow-y-auto text-sm'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-xl font-semibold mb-4'>Links Fetched</h2>
            <ul className='space-y-2'>
              {links.map((link, index) => (
                <li key={index} className='flex items-center'>
                  <input
                    type='checkbox'
                    id={`link-${index}`}
                    name='link'
                    value={link}
                    checked={selectedLinks.includes(link)}
                    onChange={() => handleCheckboxChange(link)}
                    className='mr-2'
                  />
                  <label htmlFor={`link-${index}`} className='cursor-pointer'>
                    {link}
                  </label>
                </li>
              ))}
            </ul>
            <div className='flex justify-end mt-4 gap-2'>
              <Button variant='default' onClick={() => setShowLinksModal(false)}>Close</Button>
              <Button variant="default">Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

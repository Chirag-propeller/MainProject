'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  onClose: () => void;
  onSave: (textFile: File) => void;
}

const TextInputModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [text, setText] = useState('');

  const handleSave = () => {
    if (!text.trim()) {
      alert('Please type something');
      return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const file = new File([blob], `Text file-${Date.now()}.txt`, { type: 'text/plain' });

    onSave(file);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-gray-700/50 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-md w-[400px] shadow-lg flex flex-col gap-4' 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-lg font-semibold'>Add Text</h2>
        <textarea
          className='w-full h-40 p-2 border rounded resize-none'
          placeholder='Type your content here...'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className='flex justify-end gap-2'>
          <Button variant='ghost' onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default TextInputModal;

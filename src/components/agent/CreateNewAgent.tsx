// components/Popup.tsx
import { useEffect, useRef } from "react";
import { Plus, MoveRight } from 'lucide-react';
import { Button } from '../ui/button';

interface PopupProps {
  onClose: () => void;
}

const CreateNewAgent= ({ onClose }: PopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0  bg-gray-400/60 flex justify-center items-center ">
      
      <div
        ref={popupRef}
        className="bg-white p-4 rounded-lg shadow-lg w-[90%] mb-2"
      >
        <div className="relative">
          <span className="cursor-pointer absolute right-0" onClick={onClose}>X</span>
        </div>
        
        <div >
          <h1  >Create New Agent</h1>
          <div className="bg-gray-200 rounded-md p-3 group hover:shadow-md">
            <div className="flex justify-between ">
                <Plus  />
                <Button size="sm" > Custom </Button>
            </div>
            <div>
                <h1 className="text-sm"> Custom Starter</h1>
                <p className="text-xs">A completely empty agent with basic configuration, designed for creating your unique assistant.</p>
                
            </div>
            <span className="mr-1 mt-20 text-sm text-blue-500 cursor-pointer hover:underline" > Create New  </span>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default CreateNewAgent;
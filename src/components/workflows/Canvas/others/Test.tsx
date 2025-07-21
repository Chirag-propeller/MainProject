import VoiceAssistant from './VoiceAssistant';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Logo from '@/components/sidebar/Logo';
import { useWorkflowStore } from '@/store/workflowStore';

interface Workflow {
  _id: string;
  name: string;
  globalPrompt: string;
  nodes: any[];
  edges: any[];
  globalNodes: string[];
  createdAt: string;
  updatedAt: string;
}

interface TestProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: Workflow;
}

const Test: React.FC<TestProps> = ({ isOpen, onClose, workflow }) => {
  console.log('Test component rendered with isOpen:', isOpen, 'workflow:', workflow?.name);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [token, setToken] = useState("");
  const [roomName, setRoomName] = useState("");
  const { setActiveNode } = useWorkflowStore();
  // Ensure the component is mounted before animations start
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    console.log(workflow);

    // Add body overflow hidden when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    // Handle click outside to close modal
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setActiveNode(null);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent animation on initial render
  if (!mounted) {
    return null;
  }
  
  const fetchToken = async () => {
    try {
      const dataToSend = {
        workflowId: workflow._id,
        workflowName: workflow.name,
        globalPrompt: workflow.globalPrompt,
        nodes: workflow.nodes,
        edges: workflow.edges,
        globalNodes: workflow.globalNodes,
        roomName,
      };
      console.log("Workflow test data:", dataToSend);
      
      const response = await axios.post('/api/livekit/workflow', dataToSend);
      const data = response.data;
      return {
        roomName: data.room_name,
        token: data.token
      }

    } catch (error) {
      alert("Something went wrong..")
      console.error("Error fetching workflow token:", error);
    }
  };

  const handleTestClick = async () => {
    const user = await axios.get('/api/user/getCurrentUser');
    const credits = parseFloat(user.data?.credits?.$numberDecimal) || 0;
    const creditsUsed = parseFloat(user.data?.creditsUsed?.$numberDecimal) || 0;
    
    if(credits - creditsUsed <= 0){
      alert("You have no credits left");
      return;
    }

    const tokenData = await fetchToken();
    if (tokenData) {
      setRoomName(tokenData.roomName);
      setToken(tokenData.token);
      setShowVoiceAssistant(true);
    }
  };

  // Render the component regardless of isOpen state
  // but use opacity and pointer-events to hide it when closed
  console.log('Rendering modal with isOpen:', isOpen, 'workflow:', workflow?.name);
  
  if (!isOpen) {
    console.log('Modal is closed, not rendering');
    return null;
  }
  
  console.log('Modal is open, rendering...');
  return (
    <div 
      className="fixed inset-0 z-[9999] transition-opacity duration-700"
      style={{ 
        transition: 'opacity 700ms ease' 
      }}
    >
      <div 
        ref={modalRef}
        className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg will-change-transform z-[10000]"
        style={{ 
          transform: 'translateX(0)',
          transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
        }}
      >
        <div className="h-full overflow-auto ">
          <div className="sticky top-0 flex justify-between items-center mb-6">
            <Logo collapsed={false}/>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className='w-[95%] h-[90%] text-sm bg-white m-2 rounded-sm '> 

          {showVoiceAssistant ? ( 
              <VoiceAssistant token={token} setShowVoiceAssistant={setShowVoiceAssistant} />) : 
              (<div className='flex flex-col justify-center items-center h-[95%]'>
                <br/>
                <Button 
                  variant="default"
                  size="md"
                  className='px-8 py-2 text-md rounded-[4px] shadow-xs shadow-indigo-100 border-1 border-gray-300'
                  onClick={handleTestClick}
                > 
                  Test Workflow
                </Button>
              </div>
          )}
        </div>

        </div>
      </div>
    </div>
  );
};

export default Test;

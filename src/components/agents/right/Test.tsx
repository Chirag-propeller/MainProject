// import React, { useEffect, useRef } from 'react';

// interface TestProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Test: React.FC<TestProps> = ({ isOpen, onClose }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Add body overflow hidden when modal is open
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     }

//     // Handle click outside to close modal
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
    
//     return () => {
//       document.body.style.overflow = '';
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
//         <div 
//             ref={modalRef}
//             style={{ transitionDuration: '1s' }} // or '3s' for slower
//             className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg transform transition-transform ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
//             >

//       {/* <div 
//         ref={modalRef}
//         className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg transform transition-transform duration-1000 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
//       > */}
//         <div className="h-full overflow-auto p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">Test Agent</h2>
//             <button 
//               onClick={onClose}
//               className="p-2 rounded-full hover:bg-gray-100"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
          
//           <div className="flex flex-col space-y-3 mb-4">
//             <div className="bg-blue-100 text-blue-800 p-3 rounded-md self-start max-w-[80%]">
//               Hello! How can I help you today?
//             </div>
//           </div>
          
//           <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
//             <div className="flex">
//               <input
//                 type="text"
//                 placeholder="Type your message..."
//                 className="flex-1 p-2 border rounded-l-md focus:outline-none"
//               />
//               <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700">
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Test;



// import React, { useEffect, useRef } from 'react';

// interface TestProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Test: React.FC<TestProps> = ({ isOpen, onClose }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Add body overflow hidden when modal is open
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     }

//     // Handle click outside to close modal
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
    
//     return () => {
//       document.body.style.overflow = '';
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   // Render the component regardless of isOpen state
//   // but use opacity and pointer-events to hide it when closed
//   return (
//     <div 
//       className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
//         isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//       }`}
//     >
//       <div 
//         ref={modalRef}
//         className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-out ${
//           isOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         <div className="h-full overflow-auto p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">Test Agent</h2>
//             <button 
//               onClick={onClose}
//               className="p-2 rounded-full hover:bg-gray-100"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
          
//           <div className="flex flex-col space-y-3 mb-4">
//             <div className="bg-blue-100 text-blue-800 p-3 rounded-md self-start max-w-[80%]">
//               Hello! How can I help you today?
//             </div>
//           </div>
          
//           <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
//             <div className="flex">
//               <input
//                 type="text"
//                 placeholder="Type your message..."
//                 className="flex-1 p-2 border rounded-l-md focus:outline-none"
//               />
//               <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700">
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Test;


import VoiceAssistant from '@/components/agent/newAgent/VoiceAssistant';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
// import { url } from 'inspector';
import { Agent } from '../types';
import { Button } from '@/components/ui/button';
import Logo from '@/components/sidebar/Logo';



interface TestProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
}

const Test: React.FC<TestProps> = ({ isOpen, onClose, agent }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [token, setToken] = useState("");
  const [roomName, setRoomName] = useState("");

  // Ensure the component is mounted before animations start
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    // Add body overflow hidden when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    // Handle click outside to close modal
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
  const url = process.env.NEXT_PUBLIC_AZURE_URL;

  // llm?: string;
  // llmModel?: string;
  // inputLanguage?: string;
  // stt?: string;
  // tts?: string;
  // ttsVoiceName?: string;
  // ttsModel?: string;
  // speed?: number;
  // backgroundSound?: string;
  // welcomeMessage?: string;
  // knowledgeBaseAttached?: boolean;
  // knowledgeBase?: any[];
  // prompt?: string;
  // userId?: string;
  // gender?: string;
  // ttsLanguage?: string;
  const sendData = async (roomName: string) => {
    try {
      const data = {
        selectedLLM: agent.llm,
        selectedLLMModel: agent.llmModel,
        selectedInputLang: agent.inputLanguage,
        selectedStt : agent.stt,
        selectedTts : agent.tts,
        selectedTtsModel : agent.ttsModel,
        selectedTtsVoice : agent.ttsVoiceName,
        selectedSpeed : agent.speed,
        selectedBackgroundSound : agent.backgroundSound,
        selectedWelcomeMessage : agent.welcomeMessage,
        selectedKnowledgeBase : agent.knowledgeBaseAttached,
        selectedPrompt : agent.prompt,
        selectedUserId : agent.userId,
        selectedGender : agent.gender,
        selectedTtsLanguage : agent.ttsLanguage,     
        roomName,
      };
      console.log(data);
      const response = await axios.post(`${url}/sendData`,data); 
      // Assuming the server sends a response
      // console.log(text);
      // alert("Update Successful");
    } catch (error) {
      alert("Something went wrong")
      console.error("Error sending data:", error);
      
    }
  };
  const fetchToken = async () => {
    try {
      console.log("run");
      const response = await fetch(`${url}/getToken`);
      // console.log("Url ->", url);
      const data = await response.json();
      return{
        roomName: data.room_name,
        token: data.token
      }

    } catch (error) {
      alert("Something went wrong..")
      console.error("Error fetching token:", error);
    }
  };

  const handleTestClick = async () => {
    const user = await axios.get('/api/user/getCurrentUser');
    // console.log(user);
    const credits = parseFloat(user.data?.credits?.$numberDecimal) || 0;
    const creditsUsed = parseFloat(user.data?.creditsUsed?.$numberDecimal) || 0;
    // const credits = user.data?.credits || 0 ;
    // const creditsUsed = user.data?.creditsUsed || 0;
    if(credits - creditsUsed <= 0){
      alert("You have no credits left");
      return;
    }
    // console.log(user);

    // await getToken;
    const tokenData = await fetchToken();
    if (tokenData) {
      setRoomName(tokenData.roomName);
      setToken(tokenData.token);
      await sendData(tokenData.roomName);
      setShowVoiceAssistant(true);
    }
    
  };

  // Render the component regardless of isOpen state
  // but use opacity and pointer-events to hide it when closed
  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-700 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ 
        transition: 'opacity 700ms ease' 
      }}
    >
      <div 
        ref={modalRef}
        className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg will-change-transform`}
        style={{ 
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
        }}
      >
        <div className="h-full overflow-auto ">
          <div className="sticky top-0 flex justify-between items-center mb-6">
            {/* <h2 className="text-xl font-semibold">Test Agent</h2> */}
            <Logo/>
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
          {/* <div className='flex justify-center'>
            <div className='flex bg-gray-100 p-1 rounded-sm w-[40%] h-fit m-2 justify-between'>
              <div className={` p-1 cursor-pointer rounded-sm  mx-1 w-[100%] bg-white`}>  
              Test your agent
              </div>
            </div>
          </div>
          <hr className='w-[80%] border-gray-700 mx-auto '/> */}

          {showVoiceAssistant  ?  ( 
              <VoiceAssistant token={token} setShowVoiceAssistant={setShowVoiceAssistant}  />) : 
              (<div className='flex flex-col justify-center items-center h-[95%]'>
                
                {/* <Logo className='w-10 h-10' /> */}
              {/* <h1 className='text-xl text-black '> Test your agent</h1> */}
              <br/>
              <Button 
                variant="default"
                size="md"
                className='px-8 py-2 text-md rounded-[4px] shadow-xs shadow-indigo-100 border-1 border-gray-300'
                onClick={handleTestClick}
              > 
                Start a conversation
              </Button>
              {/* <button 
                className='px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-100 border-1 border-gray-300'
                onClick={handleTestClick}
              > 
                Test
              </button> */}
            </div>

        )}
        </div>

        </div>
      </div>
    </div>
  );
};

export default Test;
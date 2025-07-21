// import { useVoiceAssistant, VoiceAssistantControlBar, useLocalParticipant, useTrackTranscription } from "@livekit/components-react";
// import { Track } from "livekit-client";
// import { useEffect, useState, useRef } from "react";
// import React from 'react';
// // 1. Import useRoomContext to get the room object
// import { useRoomContext } from '@livekit/components-react'; 

// const Message = ({type, text}: {type: string, text: string}) => {
//   // ... (this component remains the same)
//   return (
//     <div>
//     <div className={`flex justify-start ${type === 'workflow' ? ' text-indigo-700' : ' text-green-500'}`}>
//    <strong className=" text-sm pr-1 "> 
//        {type === 'workflow' ? 'Workflow: ' : 'User: '}
//       </strong>
//       <span className="text-sm">
//        {text}
//       </span>
//       </div>
//  </div>
//   )
// }


// const SimpleVoiceAssistance = () => {
//   // 2. Get the room object from the context
//   const room = useRoomContext();

//   const messagesContainerRef = useRef<HTMLDivElement | null>(null);
//   const {state, audioTrack, agentTranscriptions} = useVoiceAssistant()
//   // Note: The useTrackTranscription hook is deprecated in newer versions. This code preserves your existing logic.
//   const localParticipant = useLocalParticipant();
//   const {segments: userTranscript} = useTrackTranscription(
//     {
//       publication: localParticipant.microphoneTrack,
//       source: Track.Source.Microphone,
//       participant: localParticipant.localParticipant,
//     }
//   )
//   const [messages, setMessages] = useState<{type: string, text: string}[]>([]);
//   const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

//   // 3. Add a useEffect hook to dispatch the workflow
//   useEffect(() => {
//     // Ensure the room is connected before trying to dispatch
//     if (room) {
//       console.log("Room is connected. Dispatching to agent: workflow");
//       (room as any).dispatch_workflow({
//         agentName: 'workflow', // This name must match your Python agent
//       }).then((workflow:any) => {
//         console.log('Workflow dispatched successfully!', workflow.id);
//       }).catch((err:any) => {
//         console.error('Failed to dispatch workflow:', err);
//       });
//     }
//   }, [room]); // The hook runs when the room object becomes available


//   useEffect(() => {
//     // ... (this useEffect for handling messages remains the same)
//     type TranscriptMessage = {
//       type: string;
//       text: string;
//       firstReceivedTime: number;
//     }

//     const allMessages = [
//       ...(agentTranscriptions?.map(t => ({...t, type: 'workflow'} as TranscriptMessage)) ?? []),
//       ...(userTranscript?.map(t => ({...t, type: 'user'} as TranscriptMessage)) ?? [])
//     ].sort((a, b) => (a.firstReceivedTime || 0) - (b.firstReceivedTime || 0))
//       .map(msg => ({type: msg.type, text: msg.text}));

//     setMessages(allMessages);
//   }, [agentTranscriptions, userTranscript])

//   // ... (rest of the component remains the same)
//   useEffect(() => {
//     if (!messagesContainerRef.current) return;
//   
//     const container = messagesContainerRef.current;
//     const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
//     
//     if (isNearBottom || shouldAutoScroll) {
//       setTimeout(() => {
//         container.scrollTo({
//           top: container.scrollHeight,
//           behavior: "smooth",
//         });
//       }, 50); 
//     }
//   }, [messages, shouldAutoScroll]);
//   const handleScroll = () => {
//     if (!messagesContainerRef.current) return;
//     
//     const container = messagesContainerRef.current;
//     const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 2;
//     
//     setShouldAutoScroll(isAtBottom);
//   };
//   
//   return (
//     <div className="flex flex-col justify-between w-full h-full">
//       <div 
//         className="flex-1 overflow-hidden overflow-y-auto p-1 gap-0.5 " 
//         ref={messagesContainerRef}
//         onScroll={handleScroll}
//       >
//         {
//           messages.map((message, index) => (
//             <Message 
//              key={index} 
//              type={message.type} 
//              text={message.text} 
//             />
//           ))
//         }
//       </div>

//       <div className="flex-shrink-0">
//         <VoiceAssistantControlBar />
//       </div>
//     </div>
//   )
// }

// export default SimpleVoiceAssistance


import { useVoiceAssistant, BarVisualizer, VoiceAssistantControlBar, useTrackTranscription, useLocalParticipant } from "@livekit/components-react";
import {Track} from "livekit-client"
import { useEffect, useState, useRef } from "react";
import React from 'react'

const Message = ({type, text}: {type: string, text: string}) => {
  return (
    <div>
      <div className={`flex justify-start ${type === 'workflow' ? ' text-indigo-700' : ' text-green-500'}`}>
      <strong className=" text-sm pr-1 "> 
        {type === 'workflow' ? 'Workflow: ' : 'User: '}
       </strong>
       <span className="text-sm">
        {text}
       </span>
       </div>
    </div>
  )
}

const SimpleVoiceAssistance = () => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const {state, audioTrack, agentTranscriptions} = useVoiceAssistant()
  const localParticipant = useLocalParticipant();
  const {segments: userTranscript} = useTrackTranscription(
    {
      publication: localParticipant.microphoneTrack,
      source: Track.Source.Microphone,
      participant: localParticipant.localParticipant,
    }
  )

  const [messages, setMessages] = useState<{type: string, text: string}[]>([]);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    type TranscriptMessage = {
      type: string;
      text: string;
      firstReceivedTime: number;
    }

    const allMessages = [
      ...(agentTranscriptions?.map(t => ({...t, type: 'workflow'} as TranscriptMessage)) ?? []),
      ...(userTranscript?.map(t => ({...t, type: 'user'} as TranscriptMessage)) ?? [])
    ].sort((a, b) => (a.firstReceivedTime || 0) - (b.firstReceivedTime || 0))
      .map(msg => ({type: msg.type, text: msg.text}));

    setMessages(allMessages);
  }, [agentTranscriptions, userTranscript])

  // Improved auto-scroll logic
  useEffect(() => {
    if (!messagesContainerRef.current) return;
  
    const container = messagesContainerRef.current;
    
    // Check if user is near the bottom (within 100px)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    
    // Auto-scroll if user is near bottom or if shouldAutoScroll is true
    if (isNearBottom || shouldAutoScroll) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }, 50); // Small delay to ensure DOM is updated
    }
  }, [messages, shouldAutoScroll]);

  // Handle manual scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 2;
    
    // Enable auto-scroll if user scrolls to bottom, disable if they scroll up
    setShouldAutoScroll(isAtBottom);
  };
  
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <div 
        className="flex-1 overflow-hidden overflow-y-auto p-1 gap-0.5 " 
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {
          messages.map((message, index) => (
            <Message 
             key={index} 
             type={message.type} 
             text={message.text} 
            />
          ))
        }
      </div>

      <div className="flex-shrink-0">
        <VoiceAssistantControlBar />
      </div>
    </div>
  )
}

export default SimpleVoiceAssistance 
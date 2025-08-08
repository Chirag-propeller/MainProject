import { useVoiceAssistant, VoiceAssistantControlBar, useTrackTranscription, useLocalParticipant, useDataChannel } from "@livekit/components-react";
import {Track} from "livekit-client"
import { useEffect, useState, useRef } from "react";
import React from 'react'
import { useWorkflowStore } from "@/store/workflowStore";

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
  const { setActiveNode, activeNode } = useWorkflowStore();

  // Use the useDataChannel hook to listen for messages on the 'flow_updates' topic.
  useDataChannel('flow_updates', (msg) => {

    console.log("msg", msg);
    const payload = msg.payload;
    const nodeName = JSON.parse(Buffer.from(payload).toString('utf-8')).current_node;
    console.log("nodeName", nodeName);
    console.log("activeNode", activeNode);
    setActiveNode(nodeName);

  });
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
// components/AnimatedMessages.tsx
import React, { useEffect, useState } from 'react';
import { Star , Sparkles} from 'lucide-react';
import { cn } from '@/lib/utils';
// import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  animation?: string;
  position: {
    top?: string;
    right?: string;
    left?: string;
    bottom?: string;
  };
  delay?: number;
  icon?: React.ReactNode;
}

interface AnimatedMessagesProps {
  messages: Message[];
}

const AnimatedMessages: React.FC<AnimatedMessagesProps> = ({ messages }) => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);

  useEffect(() => {
    messages.forEach((msg, index) => {
      setTimeout(() => {
        setVisibleMessages((prev) => {
          // prevent duplicate entries (e.g., if id is reused)
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        // setVisibleMessages((prev) => [...prev, msg]);
      }, msg.delay || index * 500); // Default delay between messages
    });
    // messages.forEach((msg, index) => {
    //   setTimeout(() => {
    //     setVisibleMessages((prev) => [...prev, msg]);
    //   }, msg.delay || index * 500); // Default delay between messages
    // });
  }, [messages]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {visibleMessages.map((message) => (

        <div
        key={message.id}
        className={cn(
        "absolute z-30 transition-opacity duration-3000 ease-in-out hidden sm:block",
        message.animation || ""
        )}
        style={{
        ...message.position,
        opacity: 1,
        }}
        >
        <div
        className={cn(
            "relative p-3 sm:p-4 max-w-[180px] sm:max-w-[280px] shadow-lg",
            // message.isUser
            // ? "glass-card rounded-2xl rounded-tr-sm text-white"
            // : "bg-gradient-to-r from-decagon-primary to-decagon-secondary/70 rounded-2xl rounded-tl-sm text-white"
            message.isUser
            ? "bg-white/10 backdrop-blur-md text-white shadow-md rounded-2xl rounded-tr-sm"
            : "bg-gradient-to-r from-decagon-primary to-decagon-secondary/70 text-white shadow-md rounded-2xl rounded-tl-sm"

        )}
        >
        {message.icon && (
            <div className="absolute -left-6 sm:-left-8 -top-3 sm:-top-4">
            {message.icon}
            </div>
        )}
        <p className="text-sm sm:text-base">{message.text}</p>
        </div>
        </div>

        // <div
        //   key={message.id}
        //   className="absolute z-10 opacity-100 transition-opacity duration-700 ease-in-out"
        //   style={{ ...message.position }}
        // >
        //   <div
        //     className={`relative max-w-xs sm:max-w-md p-4 rounded-xl shadow-md ${
        //       message.isUser
        //         ? 'bg-blue-600 text-white ml-auto'
        //         : 'bg-white text-gray-900'
        //     }`}
        //   >
        //     {!message.isUser && (
        //       <div className="absolute -left-3 -top-3 bg-purple-600 text-white p-1 rounded-full">
        //         <Star className="h-3 w-3" />
        //       </div>
        //     )}
        //     <p className="text-sm sm:text-base">{message.text}</p>
        //   </div>
        // </div>
      ))}
    </div>
  );
};

export default AnimatedMessages;

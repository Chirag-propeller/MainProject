"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { Button } from './Button';
import AnimatedMessages from './AnimatedMessages';

const dynamicHeadlines = [
  "Redefine conversations",
  "Transform dialogues",
  "Revolutionize interactions",
  "Enhance communication",
];

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
  
  
  const messages: Message[] = [
      {
        id: 1,
        text: "Hi, I need to schedule an appointment.",
        isUser: true,
        position: { top: "4rem", right: "2rem" },
        animation: "animate-float-slow",
      },
      {
        id: 2,
        text: "I can help you with that. What day works best for you?",
        isUser: false,
        position: { top: "55%", left: "3rem" },
        animation: "animate-float-medium",
        icon: (
          <div className="bg-white rounded-full p-1 shadow-md">
            <Sparkles className="h-4 w-4 text-decagon-primary" />
          </div>
        ),
      },
      {
        id: 3,
        text: "Would you prefer morning or afternoon?",
        isUser: false,
        position: { bottom: "5rem", left: "3rem" },
        animation: "animate-float-reverse",
        icon: (
          <div className="bg-white rounded-full p-1 shadow-md">
            <Sparkles className="h-4 w-4 text-decagon-primary" />
          </div>
        ),
      },
      {
        id: 4,
        text: "Thursday afternoon would be great.",
        isUser: true,
        position: { bottom: "11rem", right: "2rem" },
        animation: "animate-float-medium",
      },
    ];


const HeroSection = () => {
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % dynamicHeadlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-decagon-light via-white to-decagon-light/50 p-6 md:p-12 lg:p-24 flex flex-col justify-center relative" style={{ minHeight: isMobile ? '60vh' : '90vh' }}>
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-decagon-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-decagon-secondary/5 rounded-full blur-3xl"></div>

          <div className="max-w-2xl space-y-6 md:space-y-10 relative z-10">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
              <span className="block min-h-[3rem] md:min-h-[5rem] transition-opacity duration-500 mb-2 md:mb-4 text-decagon-dark">
                {dynamicHeadlines[currentHeadlineIndex]}
              </span>
              <span className="block text-shimmer mt-1 md:mt-2">with Voice <br/> AI</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 max-w-2xl">
              Our AI-powered voice agents create human-like, emotionally expressive conversations that transform customer interactions across your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
              <Button onClick={() => scrollToSection("cta")} 
              className="bg-gradient-to-r from-decagon-primary to-decagon-blue text-white hover:opacity-90  sm:px-4 py-6 text-base sm:text-lg font-medium rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all w-full sm:w-auto text-nowrap h-6 sm:max-h-10"
                >
                Get a demo
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button onClick={() => scrollToSection("features")} className="bg-gradient-to-r from-decagon-secondary to-decagon-blue/30 text-white hover:opacity-90 px-6 sm:px-4 py-6 text-base sm:text-lg font-medium rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all w-full sm:w-auto text-nowrap h-6 sm:max-h-10">
                Explore features
                <PlayCircle className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        {
          // (deviceType === "laptop" || )
            (deviceType === "desktop") && (
            <div className="w-full lg:w-1/2 bg-decagon-dark relative flex items-center justify-center overflow-hidden" style={{ minHeight: isMobile ? '40vh' : 'auto' }}>
            <div className="absolute inset-0 bg-gradient-radial from-decagon-primary/20 to-decagon-dark opacity-60"></div>
  
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute left-0 h-full w-16 bg-gradient-to-r from-white via-white/50 to-transparent z-20"></div>
              <div className="relative w-full h-full gif-container">
                <div className="absolute inset-0 bg-white/10 z-10"></div>
  
                  <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute w-full h-full object-cover z-5"
                      >
                      <source src="/assets/gif.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                      </video>
                 </div>
                  <AnimatedMessages messages={messages}/>
      
            </div>
          </div>
          )
        }
        {/* Right Section */}

      </div>
    </section>
  );
};

export default HeroSection;

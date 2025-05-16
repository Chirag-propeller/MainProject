'use client';

import React, { useEffect, useRef, useState } from 'react';
// import { Button } from '@/components/ui/button';
import { Send, ArrowRight } from 'lucide-react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { Button } from './Button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
// import { useIsMobile } from '@/hooks/use-mobile';

const CallToAction: React.FC = () => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === "mobile";
  // const emailInput = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  // const buttonClickHandler = () => {
  //   setSubmitted(true);
  //   if(email === ''){
  //     toast.error('Please enter your email');
  //     // setSubmitted(false);
  //     return;
  //   }
  //   toast.success('Email sent successfully');
  // };
  const buttonClickHandler = () => {
    setSubmitted(true);
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (email.trim() === '') {
      toast.error('Please enter your email');
      setValidEmail(false);
      return;
    }
  
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      setValidEmail(false);
      return;
    }
    try {
      const sendEmail = async () => {
        const response = await fetch('/api/landingPage/cta', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
      };
      sendEmail();
    } catch (error) {
      toast.error('Email not sent');
    }

      
    setValidEmail(true);
    setIsClicked(true);
    setEmail('');
    // toast.success('Email sent successfully');
    // proceed with API or further logic
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSubmitted(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [submitted]);

  return (
    <section
      id="cta"
      className="relative py-12 md:py-24 overflow-hidden bg-gradient-to-br from-cyan-400/90 to-green-400/80"
    >
      {/* Background Gradient + Dots */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-green-400 opacity-90" />
        <div className="absolute inset-0 opacity-5 dotted-bg" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Ready to transform your business communication?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 md:mb-10">
            Experience how our Voice AI agents can enhance your customer interactions and boost productivity.
          </p>

          {/* Email + CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="relative w-full sm:w-auto flex-1 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                // className="w-full h-12 md:h-14 pl-4 pr-12 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                className={cn(
                  "w-full h-12 md:h-14 pl-4 pr-12 rounded-lg border bg-white/10 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300",
                  submitted && !validEmail
                    ? "border-white/60 focus:ring-white/60 shadow-[0_0_0_2px_rgba(255,255,255,0.4)] animate-shake"
                    : "border-white/20 focus:ring-white/50"
                )}
                             
                // className={cn(
                //   "w-full h-12 md:h-14 pl-4 pr-12 rounded-lg border bg-white/10 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300",
                //   submitted && !email
                //     ? "border-white/60 focus:ring-white/60 shadow-[0_0_0_2px_rgba(255,255,255,0.4)]"
                //     : "border-white/20 focus:ring-white/50"
                // )}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Send className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
            </div>
            <Button 
            onClick={buttonClickHandler}
            >
              Get a demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="text-white/80 text-sm mt-4">No credit card required. Free consultation.</p>
          {isClicked && (
          <div className="mt-6">
            <p className="text-white  text-xl  ">
              We have received your request. We will get back to you soon.
            </p>
          </div>
        )}
        </div>

        
      </div>
    </section>
  );
};

export default CallToAction;

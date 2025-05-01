'use client';

import React from 'react';
// import { Button } from '@/components/ui/button';
import { Send, ArrowRight } from 'lucide-react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { Button } from './Button';
// import { useIsMobile } from '@/hooks/use-mobile';

const CallToAction: React.FC = () => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === "mobile";

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
                className="w-full h-12 md:h-14 pl-4 pr-12 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              />
              <Send className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
            </div>
            <Button 
            // className='text-green-500'
            // className="w-full sm:w-auto bg-white hover:bg-white/90 text-green-500 px-6 py-5 md:py-6 text-base md:text-lg font-medium rounded-lg transition-all"
            >
              Get a demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="text-white/80 text-sm mt-4">No credit card required. Free consultation.</p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;


import React from 'react';

const AI_FEATURES = [
  { 
    title: "🚀 Ultra-Low Latency",
    description: "10x Faster Call Handling"
  },
  { 
    title: "🎯 Custom Voice Agents",
    description: "Create in Minutes"
  },
  { 
    title: "📞 Call Automation",
    description: "Inbound & Outbound"
  },
  { 
    title: "📊 Real-Time Analytics",
    description: "Business Insights"
  },
  { 
    title: "🔁 Campaign Automation",
    description: "Schedule & Run Seamlessly"
  },
  { 
    title: "🧠 Intent Recognition",
    description: "Conversational Memory"
  }
];

const LogoMarquee = () => {
  return (
    <div className="bg-gradient-to-r from-decagon-primary to-decagon-secondary sm:py-6 py-3 overflow-hidden border-t border-white/10 shadow-md" id="features">
      <div className=" relative flex">
        <div className="flex animate-marquee whitespace-nowrap">
          {AI_FEATURES.map((feature, index) => (
            <div key={index} className="mx-12 px-4 flex flex-col items-center justify-center text-center w-64">
              <div className="md:text-xl sm:text-lg text-base font-bold text-white mb-1">
                {feature.title}
              </div>
              <div className="text-sm text-white/80">
                {feature.description}
              </div>
            </div>
          ))}
        </div>

        <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
          {AI_FEATURES.map((feature, index) => (
            <div key={`duplicate-${index}`} className="mx-12 px-4 flex flex-col items-center justify-center text-center w-64">
              <div className="md:text-xl sm:text-lg text-base font-bold text-white mb-1">
                {feature.title}
              </div>
              <div className="text-sm text-white/80">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
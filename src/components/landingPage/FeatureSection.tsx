// app/components/FeatureSection.tsx (or similar path)

'use client';

import React from 'react';
import {
  Bot,
  PhoneCall,
  CalendarClock,
  Database,
  LineChart,
  Users,
  Zap,
  GitMerge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeviceType } from '@/hooks/useDeviceType';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all h-full">
    <div className="inline-flex items-center justify-center p-3 bg-decagon-light rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-decagon-dark mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeatureSection: React.FC = () => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === "mobile";


  const features: FeatureCardProps[] = [
    {
      icon: <Bot className="h-6 w-6 text-decagon-primary" />,
      title: '🗣️ Human-like Voice Agents',
      description:
        'Create custom AI voice agents with expressive emotions and personalities tailored to your brand in minutes.',
    },
    {
      icon: <PhoneCall className="h-6 w-6 text-decagon-primary" />,
      title: '📞 Automated Call Handling',
      description:
        'Simplify both inbound and outbound calls with automated workflows that handle customer interactions 10x faster.',
    },
    {
      icon: <CalendarClock className="h-6 w-6 text-decagon-primary" />,
      title: '🔁 Seamless Campaign Management',
      description:
        'Auto-schedule and run large-scale outreach campaigns with detailed reporting and follow-up capabilities.',
    },
    {
      icon: <Database className="h-6 w-6 text-decagon-primary" />,
      title: '📁 Complete Conversation Storage',
      description:
        'Access full call logs, audio files and transcript storage for compliance, training and performance analysis.',
    },
    {
      icon: <LineChart className="h-6 w-6 text-decagon-primary" />,
      title: '📊 Real-Time Analytics',
      description:
        'Gain valuable business insights through advanced call analytics that identify trends and improvement opportunities.',
    },
    {
      icon: <Users className="h-6 w-6 text-decagon-primary" />,
      title: '🔒 Secure Multi-User Access',
      description:
        'Manage multiple users, teams, and departments with customizable roles and permissions for enterprise security.',
    },
    {
      icon: <Zap className="h-6 w-6 text-decagon-primary" />,
      title: '🚀 Ultra-Low Latency',
      description:
        'Industry-leading call latency and voice responsiveness for natural, human-like conversations at scale.',
    },
    {
      icon: <GitMerge className="h-6 w-6 text-decagon-primary" />,
      title: '🔌 Seamless Integrations',
      description:
        'Connect with CRMs, ERPs, and business applications you already use for a unified workflow experience.',
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="features" className="py-12 md:py-24 relative z-10 bg-white">
      <div className="container-custom mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-decagon-dark mb-4">
            Enterprise-ready Voice AI platform
          </h2>
          <p className="text-base lg:text-lg text-gray-600">
            Our platform helps businesses create custom AI voice agents that deliver 10x productivity across all customer interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => scrollToSection('use-cases')}
            className="bg-decagon-primary hover:bg-decagon-primary/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-base font-medium rounded-md inline-flex items-center"
          >
            Explore Real-World Applications
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

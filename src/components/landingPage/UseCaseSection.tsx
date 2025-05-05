'use client';

import React from 'react';
import {
  HeadphonesIcon,
  Users,
  Calendar,
  ShoppingCart,
  Building2,
  FileCheck,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const UseCaseSection: React.FC = () => {
  const useCases: UseCase[] = [
    {
      icon: <HeadphonesIcon className="h-8 w-8 text-decagon-primary" />,
      title: '24/7 Customer Support',
      description:
        'Handle inbound support inquiries around the clock with AI voice agents that can resolve common issues and escalate complex ones.',
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-decagon-primary" />,
      title: 'Intelligent Sales Outreach',
      description:
        'Schedule automated outbound calls with conversational memory that remembers context for lead qualification and follow-ups.',
    },
    {
      icon: <Calendar className="h-8 w-8 text-decagon-primary" />,
      title: 'Seamless Scheduling',
      description:
        'Manage calendar scheduling, confirmations, and reminders with AI that handles the back-and-forth naturally.',
    },
    {
      icon: <FileCheck className="h-8 w-8 text-decagon-primary" />,
      title: 'Compliance & Script Adherence',
      description:
        'Monitor conversations for regulatory compliance and script adherence automatically, with built-in reporting.',
    },
    {
      icon: <Globe className="h-8 w-8 text-decagon-primary" />,
      title: 'Multilingual Support',
      description:
        'Engage customers in their preferred language with effortless multilingual conversation capabilities.',
    },
    {
      icon: <Building2 className="h-8 w-8 text-decagon-primary" />,
      title: 'Enterprise Scalability',
      description:
        'Deploy thousands of concurrent AI voice agents that learn and improve from every conversation.',
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="use-cases" className="py-12 md:py-24 bg-decagon-cream relative">
      <div className="container-custom mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-decagon-dark mb-4">
            Transform business communication
          </h2>
          <p className="text-base lg:text-lg text-gray-600">
            From reducing response times to scaling customer interactions, our Voice AI agents deliver measurable results across industries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-4">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 h-full"
            >
              <div className="inline-flex items-center justify-center p-3 bg-decagon-light rounded-lg mb-4">
                {useCase.icon}
              </div>
              <h3 className="text-xl font-semibold text-decagon-dark mb-3">
                {useCase.title}
              </h3>
              <p className="text-gray-600">{useCase.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          {/* <Button
            onClick={() => scrollToSection('testimonials')}
            className="bg-decagon-primary hover:bg-decagon-primary/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-base font-medium rounded-md inline-flex items-center"
          >
            See Success Stories
          </Button> */}
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute -z-10 top-20 right-0 w-64 h-64 bg-decagon-secondary/10 rounded-full blur-3xl opacity-70" />
      <div className="absolute -z-10 bottom-20 left-0 w-80 h-80 bg-decagon-primary/10 rounded-full blur-3xl opacity-70" />
    </section>
  );
};

export default UseCaseSection;

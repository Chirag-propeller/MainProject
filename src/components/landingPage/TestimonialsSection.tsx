'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { useDeviceType } from '@/hooks/useDeviceType';

interface Testimonial {
  quote: string;
  author: string;
  position: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Decagon's AI agents have transformed how our business handles customer service requests. We've seen a 40% reduction in response times.",
    author: 'Sarah Johnson',
    position: 'Customer Experience Director, TechCorp',
  },
  {
    quote:
      "The seamless integration of Decagon's agents with our existing systems has been impressive. Implementation was quick, and the results were immediate.",
    author: 'Michael Chen',
    position: 'CTO, Retail Solutions Inc.',
  },
  {
    quote:
      'We\'ve been able to automate complex data analysis tasks that previously required specialized knowledge. Our team now focuses on strategic decisions instead.',
    author: 'Priya Sharma',
    position: 'Operations Manager, GlobalServe',
  },
];

const TestimonialsSection: React.FC = () => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === "mobile";

  return (
    <section className="py-12 md:py-24 bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12 px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-decagon-dark mb-4">
            What Our Clients Say
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Organizations around the world are achieving exceptional results with Decagon AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-decagon-cream p-6 md:p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <Quote className="h-6 w-6 md:h-8 md:w-8 text-decagon-primary/40 mb-3 md:mb-4" />
              <p className="text-gray-700 mb-5 md:mb-6 italic text-sm md:text-base">
                {testimonial.quote}
              </p>
              <div>
                <p className="font-semibold text-decagon-dark text-sm md:text-base">
                  {testimonial.author}
                </p>
                <p className="text-xs md:text-sm text-gray-600">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

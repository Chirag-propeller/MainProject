"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleReportProblem = () => {
    const subject = '404 Error Report';
    const body = `I encountered a 404 error on the page: ${window.location.href}\n\nPlease help me find the correct page or fix this issue.`;
    const mailtoLink = `mailto:support@propalai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      // Try to open email client directly
      window.location.href = mailtoLink;
      
      // Set a timeout to check if it worked, if not show fallback
      setTimeout(() => {
        // If user is still on the page after 1 second, email client probably didn't open
        if (document.hasFocus()) {
          handleEmailFallback();
        }
      }, 1000);
    } catch (error) {
      handleEmailFallback();
    }
  };

  const handleSupportEmail = () => {
    try {
      window.location.href = 'mailto:support@propalai.com';
      
      setTimeout(() => {
        if (document.hasFocus()) {
          handleEmailFallback();
        }
      }, 1000);
    } catch (error) {
      handleEmailFallback();
    }
  };

  const handleEmailFallback = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('support@propalai.com').then(() => {
        alert('Email client not available. Email address copied to clipboard: support@propalai.com\n\nPlease paste this into your email client to contact us.');
      }).catch(() => {
        prompt('Email client not available. Copy this email address:', 'support@propalai.com');
      });
    } else {
      prompt('Email client not available. Copy this email address:', 'support@propalai.com');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Text - Much Bigger */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal text-gray-700 mb-6">404</h1>
        </div>

        {/* Main Heading - Bigger */}
        <div className="mb-6">
          <h2 className="text-4xl md:text-5xl font-medium text-gray-800 mb-4">
            This template didn&apos;t load!
          </h2>
        </div>

        {/* Subtitle - Bigger */}
        <div className="mb-10">
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
            The page you&apos;re looking for doesn&apos;t seem to exist. But don&apos;t worry,<br />
            we&apos;ve got plenty of amazing templates waiting for you!
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={handleGoBack}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Go back
          </button>
          <button
            onClick={handleReportProblem}
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Report problem
          </button>
        </div>

        {/* Support Email */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Need help?{' '}
            <button 
              onClick={handleSupportEmail}
              className="text-gray-700 hover:text-gray-900 transition-colors underline bg-transparent border-none cursor-pointer p-0"
            >
              Reach out to us at support@propalai.com
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
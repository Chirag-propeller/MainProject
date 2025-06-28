"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This component is now just a redirect to the new URL structure
const AgentsDashboard: React.FC = () => {
  const router = useRouter();

  // Redirect to the new agents dashboard page
  useEffect(() => {
    router.push('/dashboard/agents');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-full dark:bg-gray-900 dark:text-gray-100">
      <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
      <p className="ml-2">Redirecting...</p>
    </div>
  );
};

export default AgentsDashboard; 
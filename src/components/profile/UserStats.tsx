"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUserData } from './UserDataContext';

const UserStats = () => {
  const { user, loading, error } = useUserData();

  // Calculate credit usage percentage for progress bar
  const calculateCreditPercentage = () => {
    if (!user) return 0;
    const totalCredit = user.remaining_credit + (user.minutes_used * 0.2); // Assuming $0.20 per minute as an example
    return Math.min(100, (user.remaining_credit / totalCredit) * 100);
  };

  if (loading) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  return (
    <Card className="h-full shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-800">Usage Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credit Balance */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">Credit Balance</h3>
            <span className="text-xl font-bold text-indigo-600">${user.remaining_credit.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${calculateCreditPercentage()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Minutes Used */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-500">Minutes Used</h3>
            <span className="text-lg font-semibold text-gray-800">{user.minutes_used}</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700">Total Voice AI Usage</p>
                <p className="text-sm text-gray-500">
                  {Math.floor(user.minutes_used / 60)} hours {user.minutes_used % 60} minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center">
                <p className="text-gray-700 font-medium">Current Plan:</p>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {user.plan}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Manage your subscription in the billing section
              </p>
              <a 
                href="/billing" 
                className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                View Billing Details
                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats; 
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUserData } from './UserDataContext';
import { CreditCard, Clock, TrendingUp, Activity, Zap, Database, Phone, Bot } from 'lucide-react';

const UserStats = () => {
  const { user, loading, error } = useUserData();

  // Calculate credit balance like in billing page
  const calculateCreditBalance = () => {
    if (!user) return 0;
    return user.credits - user.creditsUsed;
  };

  // Calculate credit usage percentage for progress bar
  const calculateCreditPercentage = () => {
    if (!user || user.credits === 0) return 0;
    const remaining = calculateCreditBalance();
    return Math.max(0, Math.min(100, (remaining / user.credits) * 100));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader className="pb-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-48">
            <div className="text-red-500 mb-4">
              <Activity className="h-12 w-12" />
            </div>
            <p className="text-center text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  const creditBalance = calculateCreditBalance();
  const usagePercentage = calculateCreditPercentage();

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-indigo-600" />
          Usage & Statistics
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6">
        {/* Credit Balance */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-indigo-600" />
              Credit Balance
            </h3>
            <span className="text-lg font-semibold text-indigo-600">
              {formatCurrency(creditBalance)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">
                Used: {formatCurrency(user.creditsUsed)}
              </span>
              <span className="text-gray-600">
                {usagePercentage.toFixed(1)}% remaining
              </span>
            </div>
            
            {user.credits > 0 && (
              <div className="text-xs text-gray-500 text-center">
                Total Credits: {formatCurrency(user.credits)}
              </div>
            )}
          </div>
        </div>

        {/* Resource Statistics */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Database className="w-4 h-4 mr-2 text-blue-600" />
            Resources Overview
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-indigo-600">
                    {user.agents?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center">
                    <Bot className="w-3 h-3 mr-1" />
                    AI Agents
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-blue-600">
                    {user.phoneNumbers?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    Phone Numbers
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-purple-600">
                    {user.knowledgeBases?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center">
                    <Database className="w-3 h-3 mr-1" />
                    Knowledge Bases
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Database className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {user.campaigns?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Campaigns
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-gray-600" />
            Account Status
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  user.status === 'active' ? 'bg-green-500' : 
                  user.status === 'paid' ? 'bg-indigo-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-700">Account Status</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.status === 'active' ? 'bg-green-100 text-green-800' :
                user.status === 'paid' ? 'bg-indigo-100 text-indigo-800' :
                'bg-red-100 text-red-800'
              }`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-gray-700">Email Verification</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2">
            <a 
              href="/dashboard/billing" 
              className="flex items-center justify-between p-2 bg-white rounded border hover:border-indigo-300 transition-colors group"
            >
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-indigo-600" />
                <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                  Manage Billing
                </span>
              </div>
              <svg className="w-3 h-3 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
            </a>
            
            <a 
              href="/dashboard/agent" 
              className="flex items-center justify-between p-2 bg-white rounded border hover:border-blue-300 transition-colors group"
            >
              <div className="flex items-center">
                <Bot className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                  Manage Agents
                </span>
              </div>
              <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats; 
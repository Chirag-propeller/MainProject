"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUserData } from './UserDataContext';
import { CreditCard, Clock, TrendingUp, Activity, Zap, Database, Phone, Bot } from 'lucide-react';

const UserStats = () => {
  const { user, loading, error } = useUserData();
  const router = useRouter();

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
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
            <div className="text-red-500 dark:text-red-400 mb-4">
              <Activity className="h-12 w-12" />
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400">{error}</p>
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
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
          Usage & Statistics
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6">
        {/* Credit Balance */}
        <div className="bg-indigo-50 dark:bg-gray-950 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
              Credit Balance
            </h3>
            <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(creditBalance)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-500 dark:bg-indigo-400 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                Used: {formatCurrency(user.creditsUsed)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {usagePercentage.toFixed(1)}% remaining
              </span>
            </div>
            
            {user.credits > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Total Credits: {formatCurrency(user.credits)}
              </div>
            )}
          </div>
        </div>

        {/* Resource Statistics */}
        {/* <div className="bg-blue-50 rounded-lg p-4">
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
        </div> */}

        {/* Account Status */}
        {/* <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Account Created</p>
                  <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Completed</span>
            </div>
            
            {user.lastLoginAt && (
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Last Login</p>
                    <p className="text-xs text-gray-500">{formatDate(user.lastLoginAt)}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Recent</span>
              </div>
            )}
          </div>
        </div> */}

        <div className="bg-indigo-50 dark:bg-gray-950 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <button 
              onClick={() => router.push('/dashboard/billing')}
              className="w-full text-left px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded border border-indigo-200 dark:border-indigo-700 transition-colors"
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Manage Billing
            </button>
            <button 
              onClick={() => router.push('/dashboard/agent')}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700 transition-colors"
            >
              <Bot className="w-4 h-4 inline mr-2" />
              Manage Agents
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats; 
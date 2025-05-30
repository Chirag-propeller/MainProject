"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  phone?: string;
  role: "admin" | "user";
  status: "active" | "suspended" | "paid";
  authProvider: "email" | "google" | "github";
  isVerified: boolean;
  // emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  language?: string;
  timezone?: string;
  emailUpdates: boolean;
  productNews: boolean;
  usageAlerts: boolean;
  agents: any[];
  phoneNumbers: any[];
  knowledgeBases: any[];
  campaigns: any[];
  credits: number;
  creditsUsed: number;
  callHistoryFields: string[];
}

interface UserDataContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel using Promise.all
      const [userResponse, agentsResponse, phoneNumbersResponse, knowledgeBasesResponse, campaignsResponse] = await Promise.all([
        fetch('/api/user/getCurrentUser'),
        fetch('/api/agents/get'),
        fetch('/api/phoneNumber/get'),
        fetch('/api/knowledgeBase/get'),
        fetch('/api/createCampaign/get')
      ]);
      
      // Check if all requests were successful
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      if (!agentsResponse.ok) {
        throw new Error('Failed to fetch agents data');
      }
      if (!phoneNumbersResponse.ok) {
        throw new Error('Failed to fetch phone numbers data');
      }
      if (!knowledgeBasesResponse.ok) {
        throw new Error('Failed to fetch knowledge bases data');
      }
      if (!campaignsResponse.ok) {
        throw new Error('Failed to fetch campaigns data');
      }
      
      // Parse all responses
      const userData = await userResponse.json();
      const agentsData = await agentsResponse.json();
      const phoneNumbersData = await phoneNumbersResponse.json();
      const knowledgeBasesData = await knowledgeBasesResponse.json();
      const campaignsData = await campaignsResponse.json();
      
      // Process credits like in billing page
      const credits = parseFloat(userData.credits?.$numberDecimal) || 0;
      const creditsUsed = parseFloat(userData.creditsUsed?.$numberDecimal) || 0;
      
      // Combine all data into user object
      const processedUser = {
        ...userData,
        credits,
        creditsUsed,
        agents: agentsData || [],
        phoneNumbers: phoneNumbersData || [],
        knowledgeBases: knowledgeBasesData?.knowledgeBases || [],
        campaigns: campaignsData || [],
      };
      console.log(processedUser);
      
      setUser(processedUser);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      try {
        // Update local state immediately for better UX
        setUser({ ...user, ...userData });
        
        // In a real app, you'd make an API call to update the user
        // const response = await fetch('/api/user/update', {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(userData)
        // });
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to update user');
        // }
      } catch (err) {
        console.error('Error updating user:', err);
        // Revert local state on error
        await fetchUserData();
      }
    }
  };

  const refreshUser = () => {
    fetchUserData();
  };

  const value = {
    user,
    loading,
    error,
    updateUser,
    refreshUser
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}; 
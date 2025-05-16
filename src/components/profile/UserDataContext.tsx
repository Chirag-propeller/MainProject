"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  joined_at: string;
  plan: string;
  remaining_credit: number;
  minutes_used: number;
}

interface UserDataContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (userData: Partial<User>) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an actual API call
        // const response = await fetch('/api/user/get');
        // const data = await response.json();
        
        // For now, let's use mock data
        const mockUser: User = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          joined_at: '2023-01-15T10:30:00Z',
          plan: 'Premium',
          remaining_credit: 125.50,
          minutes_used: 432
        };
        
        // Simulate API delay
        setTimeout(() => {
          setUser(mockUser);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      // In a real app, you'd make an API call to update the user
      // Then update local state after success
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    loading,
    error,
    updateUser
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
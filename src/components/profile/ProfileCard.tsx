"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EditProfileForm from './EditProfileForm';
import { useUserData } from './UserDataContext';

const ProfileCard = () => {
  const { user, loading, error, updateUser } = useUserData();
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const handleSaveChanges = (updatedUserData: { name: string, email: string }) => {
    updateUser(updatedUserData);
    setIsEditing(false);
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
        <CardContent>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="text-red-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-center">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  return (
    <Card className="h-full shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-gray-800">Profile Information</CardTitle>
        {!isEditing && (
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          {/* Avatar placeholder */}
          <div className="flex-shrink-0 bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center">
            <span className="text-2xl font-semibold text-indigo-600">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          {/* <div className="flex-grow">
            {isEditing ? (
              <EditProfileForm 
                user={user} 
                onSave={handleSaveChanges} 
                onCancel={() => setIsEditing(false)} 
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                  <p className="text-indigo-600">{user.email}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Member since</p>
                    <p className="font-medium">{formatDate(user.joined_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current plan</p>
                    <p className="font-medium">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {user.plan}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard; 
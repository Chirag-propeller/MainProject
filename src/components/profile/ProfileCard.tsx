"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditProfileForm from "./EditProfileForm";
import { useUserData, User } from "./UserDataContext";
import {
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  Calendar,
  Shield,
  Settings,
  Camera,
  Zap,
  Database,
  Bot,
} from "lucide-react";
import { HiOutlineDocumentCurrencyRupee } from "react-icons/hi2";
import { RiTimeZoneFill } from "react-icons/ri";
import { FaLanguage } from "react-icons/fa6";

const ProfileCard = () => {
  const { user, loading, error, updateUser } = useUserData();
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paid":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "user":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSaveChanges = async (updatedUserData: Partial<User>) => {
    await updateUser(updatedUserData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader className="pb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-center text-gray-600 mb-4">{error}</p>
            <Button
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
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
    <Card className="h-full">
      {/* <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Profile Information
        </CardTitle>
        {!isEditing && (
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:bg-indigo-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader> */}

      <CardContent className="p-6">
        {isEditing ? (
          <EditProfileForm
            user={user}
            onSave={handleSaveChanges}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="relative group">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-gray-200">
                      <span className="text-lg font-semibold text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {user.name}
                  </h2>
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current mr-1"></div>
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="items-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 hover:bg-indigo-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-indigo-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    Phone Number
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {user.phone || "Not provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center">
                    <FaLanguage className="w-3 h-3 mr-1" />
                    Language
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {user.language?.toUpperCase() || "EN"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center">
                    <RiTimeZoneFill className="w-3 h-3 mr-1" />
                    Timezone
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {user.timezone || "EN"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center">
                    <HiOutlineDocumentCurrencyRupee className="w-3 h-3 mr-1" />
                    Currency
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {user.currency || "INR"}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Last Login</p>
                  <p className="text-sm font-medium text-gray-800">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Email Verified</p>
                  <div className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${user.isVerified ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <p className="text-sm font-medium text-gray-800">
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Auth Provider</p>
                  <p className="text-sm font-medium text-gray-800 capitalize">
                    {user.authProvider}
                  </p>
                </div>
              </div>
            </div>

            {/* Resources Summary */}
            {/* <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Resources</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-indigo-600">{user.agents?.length || 0}</div>
                  <div className="text-xs text-gray-600">Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{user.phoneNumbers?.length || 0}</div>
                  <div className="text-xs text-gray-600">Phone Numbers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">{user.knowledgeBases?.length || 0}</div>
                  <div className="text-xs text-gray-600">Knowledge Bases</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{user.campaigns?.length || 0}</div>
                  <div className="text-xs text-gray-600">Campaigns</div>
                </div>
              </div>
            </div> */}

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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

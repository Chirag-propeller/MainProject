import React from "react";
import ProfileCard from "./ProfileCard";
import UserStats from "./UserStats";
import { UserDataProvider } from "./UserDataContext";
import Logout from "../user/Logout";
import { UserIcon } from "lucide-react";

const ProfileDashboard = () => {
  return (
    <UserDataProvider>
      <div className="w-full overflow-y-auto px-4">
        {/* Header - matching analytics page pattern */}
        <div className="flex justify-between ">
          <div className="flex gap-1.5 py-4">
            <UserIcon className="w-3.5 h-3.5 self-center text-indigo-600" />
            <h1 className="text-lg self-center text-indigo-600">Profile</h1>
          </div>
          <div className="items-center self-center">
            <Logout />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Profile Information */}
            <div className="xl:col-span-7">
              <ProfileCard />
            </div>

            {/* Usage Statistics */}
            <div className="xl:col-span-5">
              <UserStats />
            </div>
          </div>
        </div>
      </div>
    </UserDataProvider>
  );
};

export default ProfileDashboard;

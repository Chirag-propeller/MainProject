import React, { useState } from "react";
import { Campaign } from "../../types";
import { Info, Triangle, Calendar, Clock } from "lucide-react";

interface GeneralInfoProps {
  campaign: Campaign;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ campaign }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to format call timing
  const formatCallTiming = (slotTime?: string) => {
    if (!slotTime) return "Not specified";

    switch (slotTime) {
      case "fullDay":
        return "Full day (10 AM to 6 PM)";
      case "firstHalf":
        return "1st Half only (10 AM to 2 PM)";
      case "secondHalf":
        return "2nd Half only (2 PM to 6 PM)";
      default:
        // Check if it's a custom time format
        const timeMatch = slotTime.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
        if (timeMatch) {
          return `Custom (${timeMatch[1]} to ${timeMatch[2]})`;
        }
        return slotTime;
    }
  };

  // Helper function to format selected days
  const formatSelectedDays = (slotDates?: string[]) => {
    if (!slotDates || slotDates.length === 0) return "Not specified";
    return slotDates.join(", ");
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-[6px] bg-white dark:bg-slate-800 shadow-sm hover:border-gray-300 dark:hover:border-gray-700">
      <header
        className="cursor-pointer bg-white dark:bg-slate-800 border-b-background px-2 py-1 m-1 rounded-[6px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center m-1.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-[6px] flex items-center justify-center">
              <span className="text-fuchsia-400 text-lg">
                <Info className="w-5 h-5 dark:text-indigo-300" />
              </span>
            </div>
            <div>
              <h2 className="text-[16px] text-gray-900 dark:text-indigo-300 font-semibold ml-1.5">
                General Info
              </h2>
              <p className="font-light text-gray-500 dark:text-indigo-300 text-sm pt-1 ml-1.5">
                Campaign details and schedule
              </p>
            </div>
          </div>
          <Triangle
            className={`w-8 h-8 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-90"}`}
            style={{ fill: "gray" }}
          />
        </div>
      </header>
      {isOpen && (
        <>
          <hr className="border-t border-gray-200 dark:border-gray-700 my-2" />
          <div className="px-4 py-5 flex flex-col gap-6 bg-gray-50 dark:bg-slate-900 rounded-b-[6px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-1">
                    Created At
                  </span>
                  <span className="text-sm text-gray-900 dark:text-indigo-300">
                    {new Date(campaign.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-1">
                    From Number
                  </span>
                  <span className="text-sm text-gray-900 dark:text-indigo-300">
                    {campaign.fromNumber || "Not specified"}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-1">
                    Concurrent Calls
                  </span>
                  <span className="text-sm text-gray-900 dark:text-indigo-300">
                    {campaign.concurrentCalls || "Not specified"}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-1">
                    Status
                  </span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === "ongoing"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : campaign.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-indigo-300"
                      }`}
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scheduling Information */}
              <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 dark:text-indigo-300" />
                    Scheduled Days
                  </span>
                  <span className="text-sm text-gray-900 dark:text-indigo-300">
                    {formatSelectedDays(campaign.slotDates)}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 dark:text-indigo-300" />
                    Call Timing
                  </span>
                  <span className="text-sm text-gray-900 dark:text-indigo-300">
                    {formatCallTiming(campaign.slotTime)}
                  </span>
                </div>
              </div>

              {/* Follow-up Information */}
              <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-1">
                    Follow-ups
                  </span>
                  <span className="text-sm text-gray-900 dark:text-indigo-300">
                    {campaign.noOfFollowUps && campaign.noOfFollowUps !== "0"
                      ? `Yes (${campaign.noOfFollowUps} follow-ups)`
                      : "No"}
                  </span>
                </div>
              </div>

              {/* Timezone if available */}
              {campaign.callTimezone && (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-1">
                      Timezone
                    </span>
                    <span className="text-sm text-gray-900 dark:text-indigo-300">
                      {campaign.callTimezone}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GeneralInfo;

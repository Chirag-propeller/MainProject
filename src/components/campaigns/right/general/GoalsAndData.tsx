import React, { useState } from "react";
import { Campaign } from "../../types";
import { Target, Triangle, Database, Shield } from "lucide-react";

interface GoalsAndDataProps {
  campaign: Campaign;
}

const GoalsAndData: React.FC<GoalsAndDataProps> = ({ campaign }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if there's any goals/data information to display
  const hasGoalsData =
    campaign.goal ||
    (campaign.dataToCollect && campaign.dataToCollect.length > 0) ||
    campaign.mandatoryAdherence;

  if (!hasGoalsData) {
    return null; // Don't render if no data
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <header
        className="cursor-pointer bg-gray-100 dark:bg-slate-800 p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Target className="w-3.5 h-3.5 text-gray-900 dark:text-indigo-300 self-center" />
            <h2 className="text-md text-gray-900 dark:text-indigo-300">
              Goals & Data Collection
            </h2>
          </div>
          <Triangle
            className={`w-3 h-3 self-center ${isOpen ? "rotate-180" : "rotate-90"}`}
            style={{ fill: "lightgray" }}
          />
        </div>
      </header>
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-slate-900 space-y-4">
          {/* Campaign Goal */}
          {campaign.goal && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Target className="w-3 h-3 dark:text-indigo-300" />
                  Campaign Goal
                </span>
                <div className="text-sm text-gray-900 dark:text-indigo-300 leading-relaxed">
                  {campaign.goal}
                </div>
              </div>
            </div>
          )}

          {/* Data to Collect */}
          {campaign.dataToCollect && campaign.dataToCollect.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Database className="w-3 h-3 dark:text-indigo-300" />
                  Data to Collect
                </span>
                <div className="text-sm text-gray-900 dark:text-indigo-300">
                  <ul className="list-disc list-inside space-y-1">
                    {campaign.dataToCollect.map((item, index) => (
                      <li key={index} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Mandatory Adherence */}
          {campaign.mandatoryAdherence && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-indigo-300 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Shield className="w-3 h-3 dark:text-indigo-300" />
                  Mandatory Adherence
                </span>
                <div className="text-sm text-gray-900 dark:text-indigo-300 leading-relaxed">
                  {campaign.mandatoryAdherence}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalsAndData;

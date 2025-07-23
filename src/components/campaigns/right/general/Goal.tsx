import React, { useState } from "react";
import { Campaign } from "../../types";
import { Target, Triangle } from "lucide-react";

interface GoalProps {
  campaign: Campaign;
}

const Goal: React.FC<GoalProps> = ({ campaign }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <header
        className="cursor-pointer bg-gray-100 dark:bg-slate-800 p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Target className="w-3.5 h-3.5 text-gray-900 dark:text-indigo-300 self-center" />
            <h2 className="text-md text-gray-900 dark:text-indigo-300">Goal</h2>
          </div>
          <Triangle
            className={`w-3 h-3 self-center ${isOpen ? "rotate-180" : "rotate-90"}`}
            style={{ fill: "lightgray" }}
          />
        </div>
      </header>
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-slate-900">
          <div className="text-center py-8 text-gray-500 dark:text-indigo-300">
            <Target className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-indigo-300" />
            <p className="text-sm">
              Goal configuration will be available here.
            </p>
            <p className="text-xs text-gray-400 dark:text-indigo-300 mt-1">
              This section will contain campaign objectives, targets, and
              success metrics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goal;

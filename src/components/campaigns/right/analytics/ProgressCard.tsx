import { Loader2 } from "lucide-react";
import React from "react";

interface ProgressCardProps {
  title: string;
  completedCalls: number;
  totalCalls: number;
  loading?: boolean;
  isLive?: boolean;
}

const ProgressCard = ({
  title,
  completedCalls,
  totalCalls,
  loading = false,
  isLive = false,
}: ProgressCardProps) => {
  const percentage =
    totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;

  return (
    <div className="w-full p-1 mb-3">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-[6px] shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 relative">
        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            <div className="flex space-x-0.5">
              <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-300 rounded-full animate-pulse"></div>
              <div
                className="w-1.5 h-1.5 bg-green-500 dark:bg-green-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-green-500 dark:bg-green-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-[10px] text-green-600 dark:text-green-300 font-medium uppercase tracking-wide">
              LIVE
            </span>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-xs font-medium text-gray-600 dark:text-indigo-300 mb-1">
            {title.toUpperCase()}
          </h2>
          <div className="flex items-center justify-between mb-2">
            {/* <span className="text-xs text-gray-500">Progress</span> */}
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">
              {loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                `${percentage}%`
              )}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-700 dark:to-indigo-400 h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: loading ? "0%" : `${percentage}%` }}
            >
              {/* Animated shine effect - inline styles */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{
                  animation: "shimmerEffect 2s infinite",
                }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          {/* <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="text-lg font-bold text-gray-800">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : completedCalls?.toLocaleString() || "0"}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Completed</div>
            </div>
            
            <div className="text-center flex-1">
              <div className="text-lg font-bold text-gray-800">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : totalCalls?.toLocaleString() || "0"}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Total</div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Component-specific styles */}
      <style jsx>{`
        @keyframes shimmerEffect {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressCard;

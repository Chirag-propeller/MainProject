import { Loader2 } from "lucide-react";
import React from "react";

interface CardProps {
  title: string;
  value: string;
  widthPercentage?: string;
  className?: string;
  loading?: boolean;
  theme?: "default" | "green" | "red" | "yellow" | "orange";
  isLive?: boolean;
  isDraft?: boolean;
}

const Card = ({
  title,
  value,
  widthPercentage = "30",
  className = "",
  loading,
  theme = "default",
  isLive = false,
  isDraft = false,
}: CardProps) => {
  const getWidthClass = () => {
    // Use standard Tailwind classes for better reliability
    switch (widthPercentage) {
      case "50":
        return "w-[calc(50%-0.5rem)]";
      case "33":
      case "1/3":
        return "w-[calc(33.333%-0.5rem)]";
      case "100":
      case "full":
        return "w-full";
      default:
        return `w-[calc(${widthPercentage}%-0.5rem)]`;
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "green":
        return {
          bg: "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700",
          text: "text-green-600 dark:text-green-300",
          value: "text-green-700 dark:text-green-300",
          dot: "bg-green-500 dark:bg-green-300",
        };
      case "red":
        return {
          bg: "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700",
          text: "text-red-600 dark:text-red-300",
          value: "text-red-700 dark:text-red-300",
          dot: "bg-red-500 dark:bg-red-300",
        };
      case "yellow":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700",
          text: "text-yellow-600 dark:text-yellow-300",
          value: "text-yellow-700 dark:text-yellow-300",
          dot: "bg-yellow-500 dark:bg-yellow-300",
        };
      case "orange":
        return {
          bg: "bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-700",
          text: "text-orange-600 dark:text-orange-300",
          value: "text-orange-700 dark:text-orange-300",
          dot: "bg-orange-500 dark:bg-orange-300",
        };
      default:
        return {
          bg: "bg-white dark:bg-slate-800 border-gray-100 dark:border-gray-700",
          text: "text-gray-600 dark:text-indigo-300",
          value: "text-indigo-500 dark:text-indigo-300",
          dot: "bg-indigo-500 dark:bg-indigo-300",
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`${getWidthClass()} p-1`}>
      <div
        className={`${themeClasses.bg} p-4 rounded-[6px] shadow border hover:shadow-md transition-all duration-200 h-full relative ${className}`}
      >
        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-green-600 font-medium uppercase tracking-wide">
              LIVE
            </span>
          </div>
        )}

        <div className="flex flex-col justify-between h-full">
          <h3
            className={`text-xs font-medium ${themeClasses.text} uppercase tracking-wide mb-3`}
          >
            {title}
          </h3>
          <div className="flex items-end justify-between">
            <span
              className={`text-2xl font-bold ${themeClasses.value} leading-none`}
            >
              {loading ? (
                <Loader2
                  className={`w-5 h-5 animate-spin ${themeClasses.value}`}
                />
              ) : isDraft ? (
                "--"
              ) : (
                value
              )}
            </span>
            <div
              className={`w-1.5 h-1.5 ${themeClasses.dot} rounded-full ${isLive ? "animate-pulse" : ""}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

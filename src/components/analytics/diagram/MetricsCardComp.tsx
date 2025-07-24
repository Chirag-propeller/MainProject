import React from "react";
import { cn } from "@/lib/utils";

interface CallMetric {
  label: string;
  value: number;
  total: number;
  percentage: string;
}

interface MetricsCardsProps {
  metric: CallMetric;
  size: "small" | "medium" | "large";
  className?: string;
}

export const MetricsCardComp: React.FC<MetricsCardsProps> = ({
  metric,
  size,
  className,
}) => {
  const sizeClasses = {
    small: "p-1 min-h-[48px]",
    medium: "p-2 min-h-[72px]",
    large: "p-3 min-h-[96px] min-w-[180px]",
  };

  const textSizes = {
    small: {
      value: "text-sm",
      label: "text-xs",
      percentage: "text-[10px]",
    },
    medium: {
      value: "text-lg",
      label: "text-sm",
      percentage: "text-xs",
    },
    large: {
      value: "text-xl",
      label: "text-lg",
      percentage: "text-sm",
    },
  };

  return (
    <div
      className={cn(
        "w-full rounded-[6px] border border-gray-400 dark:border-gray-700 bg-card shadow-sm p-1 sm:p-1 lg:p-2 border-l-4 border-l-indigo-500 dark:border-l-indigo-400 hover:scale-103 transition-all duration-300",
        sizeClasses[size],
        className
      )}
    >
      <div className="flex flex-col justify-center h-full text-center space-y-2">
        <div
          className={cn(
            "font-bold text-indigo-500 dark:text-indigo-300",
            textSizes[size].value
          )}
        >
          {metric.value}
        </div>
        <div
          className={cn(
            "font-medium text-indigo-500 dark:text-indigo-300",
            textSizes[size].label
          )}
        >
          {metric.label}
        </div>
        <div
          className={cn(
            "text-indigo-500 dark:text-indigo-300",
            textSizes[size].percentage
          )}
        >
          {metric.percentage}
        </div>
      </div>
    </div>
  );
};

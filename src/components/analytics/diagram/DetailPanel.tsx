import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DetailMetric {
  label: string;
  value: number;
  percentage: string;
  variant?: "default" | "success" | "warning" | "info";
}

interface DetailSection {
  title: string;
  metrics: DetailMetric[];
}

interface DetailPanelProps {
  section: DetailSection;
  className?: string;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  section,
  className,
}) => {
  const getVariantStyles = (variant: string = "default") => {
    const variants = {
      default:
        "bg-muted text-gray-500 border-gray-300 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600",
      success:
        "bg-green-50 text-green-600 border-green-400 dark:bg-green-900/200 dark:text-green-200 dark:border-green-600",
      warning:
        "bg-orange-50 text-orange-500 border-orange-400 dark:bg-orange-900/200 dark:text-orange-200 dark:border-orange-600",
      info: "bg-blue-50 text-blue-600 border-blue-400 dark:bg-blue-900/200 dark:text-blue-200 dark:border-blue-600",
    };
    return variants[variant as keyof typeof variants] || variants.default;
  };

  return (
    <div
      className={cn(
        "w-full p-2 sm:p-3 border border-gray-400 dark:border-gray-700 border-l-4 border-l-indigo-500 dark:border-l-indigo-400 rounded-[6px] shadow-sm space-x-2 hover:scale-103 transition-all duration-300",
        className
      )}
    >
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-indigo-500 dark:text-indigo-300 border-b border-b-gray-400 dark:border-b-gray-700 pb-1">
          {section.title}
        </h4>
        <div className="space-y-1">
          {section.metrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-1 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <span className="text-xs text-indigo-500 dark:text-indigo-300">
                {metric.label}
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className="text-xs font-medium text-indigo-500 dark:text-indigo-300"
                  style={{
                    padding: section.title === "AI Interaction" ? "4px" : "0px",
                  }}
                >
                  {metric.value}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-normal px-3 py-0.5",
                    getVariantStyles(metric.variant)
                  )}
                  style={{
                    display:
                      section.title === "AI Interaction" ? "none" : "flex",
                  }}
                >
                  {metric.percentage.replace(/[()]/g, "")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

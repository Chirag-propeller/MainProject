import React from "react";
import { cn } from "@/lib/utils";

interface FlowConnectorProps {
  direction: "vertical" | "horizontal" | "horizontal-split";
  className?: string;
}

export const FlowConnector: React.FC<FlowConnectorProps> = ({
  direction,
  className,
}) => {
  const getConnectorStyles = () => {
    switch (direction) {
      case "vertical":
        return "h-8 w-0.5 bg-dashboard-line";
      case "horizontal":
        return "w-8 h-0.5 bg-dashboard-line";
      case "horizontal-split":
        return 'relative w-16 h-0.5 bg-dashboard-line after:content-[""] after:absolute after:top-0 after:right-0 after:w-0.5 after:h-4 after:bg-dashboard-line after:-translate-y-2 before:content-[""] before:absolute before:top-0 before:right-0 before:w-0.5 before:h-4 before:bg-dashboard-line before:translate-y-2';
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "transition-all duration-300",
        getConnectorStyles(),
        className
      )}
    />
  );
};

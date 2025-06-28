import { formatDuration } from "date-fns";

// app/components/CallAnalysisCell.tsx
type CallAnalysisCellProps = {
    value: any;
    field?: string;
  };
  
  export default function CallAnalysisCell({ value, field }: CallAnalysisCellProps) {
    let displayValue = value;
    if (typeof value === "number") {
      const isInteger = Number.isInteger(value);
      displayValue = isInteger ? value.toString() : value.toFixed(2);
    } else if (typeof value === "object" && value !== null) {
      displayValue = JSON.stringify(value, null, 2);
    }

    // if (field === "call_duration") {
    //   if (!value) {
    //     displayValue = "-";
    //   } else {
    //     const minutes = Math.floor(value / 60);
    //     const seconds = value % 60;
    //     if (minutes > 0) {
    //       displayValue = `${minutes}m ${seconds.toFixed(0)}s`;
    //     } else {
    //       displayValue = `${seconds.toFixed(0)}s`;
    //     }
    //   }
    // }
  
    return (
      <td className="px-1 py-0 whitespace-nowrap text-xs text-center text-gray-700 dark:text-gray-300">
        {displayValue ?? "-"}
      </td>
    );
  }
  
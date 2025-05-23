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
  
    return (
      <td className="px-1 py-0 whitespace-pre-wrap text-xs text-nowrap text-gray-700">
        {displayValue ?? "-"}
      </td>
    );
  }
  
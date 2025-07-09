import { formatDuration } from "date-fns";
// import DownloadButton from "./DownloadButton";

// app/components/CallAnalysisCell.tsx
type CallAnalysisCellProps = {
  value: any;
  field?: string;
  callId?: string;
};

const sentimentEmoji: Record<string, string> = {
  positive: "😊",
  neutral: "😐",
  negative: "😞",
};

// Helper function to get color based on score
const getScoreColor = (score: number): string => {
  if (score >= 7) return "bg-green-500";
  if (score == 5 || score == 6) return "bg-yellow-500";
  return "bg-red-500";
};

// Helper function to get score label
const getScoreLabel = (score: number): string => {
  if (score >= 7) return "Good";
  if (score == 5 || score == 6) return "Average";
  return "Bad";
};

const getComplianceRiskScoreColor = (score: number): string => {
  if (score >= 5) return "bg-red-500";
  if (score == 3 || score == 4) return "bg-yellow-500";
  return "bg-green-500";
};

// Helper function to get score label
const getComplianceRiskScoreLabel = (score: number): string => {
  if (score >= 5) return "High";
  if (score == 3 || score == 4) return "Medium";
  return "Low";
};

export default function CallAnalysisCell({
  value,
  field,
  callId,
}: CallAnalysisCellProps) {
  // Green dot for connected status
  if (field === "status" && value?.toLowerCase() === "connected") {
    return (
      <td className="px-1 py-0 whitespace-nowrap text-xs text-center text-gray-700">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          Connected
        </span>
      </td>
    );
  }

  // Emoji for sentiment
  if (field === "sentiment" && typeof value === "string") {
    const emoji = sentimentEmoji[value.toLowerCase()] || "";
    return (
      <td className="px-1 py-0 whitespace-nowrap text-xs text-center text-gray-700">
        <span className="inline-flex items-center gap-1">
          {emoji && <span>{emoji}</span>}
          <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        </span>
      </td>
    );
  }

  // Handle score fields (call quality, script adherence, AI confidence)
  if (
    (field === "call_quality_score" ||
      field === "script_adherence_score" ||
      field === "compliance_risk_score") &&
    typeof value === "number"
  ) {
    const score = value;
    const color =
      field === "compliance_risk_score"
        ? getComplianceRiskScoreColor(score)
        : getScoreColor(score);
    const label =
      field === "compliance_risk_score"
        ? getComplianceRiskScoreLabel(score)
        : getScoreLabel(score);

    return (
      <td className="px-1 py-0 whitespace-nowrap text-xs text-center text-gray-700">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${color}`}
            ></span>

            <span className="text-xs text-gray-500">
              {label}
              {` (${score})`}
            </span>
          </div>
        </div>
      </td>
    );
  }

  // // Handle download transcript field
  // if (field === "download_transcript") {
  //   return (
  //     <td className="px-1 py-0 whitespace-nowrap text-xs text-center text-gray-700">
  //       <DownloadButton callId={callId || ""} disabled={!callId} />
  //     </td>
  //   );
  // }

  let displayValue = value;
  if (typeof value === "number") {
    const isInteger = Number.isInteger(value);
    displayValue = isInteger ? value.toString() : value.toFixed(2);
  } else if (typeof value === "object" && value !== null) {
    displayValue = JSON.stringify(value, null, 2);
  }

  return (
    <td className="px-1 py-0 whitespace-nowrap text-xs text-center text-gray-700">
      {displayValue ?? "-"}
    </td>
  );
}

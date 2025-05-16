// components/MergedTable.tsx
import React from "react";

type DataRow = {
  sno: number;
  total?: string;
  direction?: string;
  answerStatus: string;
  type: string;
  subType: string;
};

const data: DataRow[] = [
  { sno: 1, total: "Total Calls", direction: "Outbound", answerStatus: "Answered Outbound", type: "sentiment", subType: "positive" },
  { sno: 2, total: "", direction: "", answerStatus: "Answered Outbound", type: "sentiment", subType: "neutral" },
  { sno: 3, total: "", direction: "", answerStatus: "Answered Outbound", type: "sentiment", subType: "Negative" },
  { sno: 4, total: "", direction: "", answerStatus: "Answered Outbound", type: "call disposition", subType: "resolved" },
  { sno: 5, total: "", direction: "", answerStatus: "Answered Outbound", type: "call disposition", subType: "escalated" },
  { sno: 6, total: "", direction: "", answerStatus: "Answered Outbound", type: "call disposition", subType: "callback required" },
  { sno: 7, total: "", direction: "", answerStatus: "Answered Outbound", type: "call duration", subType: "< 10sec" },
  { sno: 8, total: "", direction: "", answerStatus: "Answered Outbound", type: "call duration", subType: "10 sec - 1 min" },
  { sno: 9, total: "", direction: "", answerStatus: "Answered Outbound", type: "call duration", subType: ">1min." },
  { sno: 10, total: "", direction: "", answerStatus: "Answered Outbound", type: "Ai interaction", subType: "NLPErrorRate: % of misinterpreted intents/utterances" },
  { sno: 11, total: "", direction: "", answerStatus: "Answered Outbound", type: "Ai interaction", subType: "intentSuccessRate: % of intents successfully fulfilled" },
  { sno: 12, total: "", direction: "", answerStatus: "Answered Outbound", type: "Ai interaction", subType: "Resolution Success" },
  { sno: 13, total: "", direction: "", answerStatus: "Unanswered Outbound", type: "Voicemail", subType: "-" },
  { sno: 14, total: "", direction: "", answerStatus: "Unanswered Outbound", type: "Busy/Not picked", subType: "-" },
  { sno: 15, total: "", direction: "Inbound", answerStatus: "Answered Inbound", type: "sentiment", subType: "positive - 50 (25%)" },
  { sno: 16, total: "", direction: "", answerStatus: "Answered Inbound", type: "sentiment", subType: "neutral" },
  { sno: 17, total: "", direction: "", answerStatus: "Answered Inbound", type: "sentiment", subType: "Negative" },
  { sno: 18, total: "", direction: "", answerStatus: "Answered Inbound", type: "call disposition", subType: "resolved" },
  { sno: 19, total: "", direction: "", answerStatus: "Answered Inbound", type: "call disposition", subType: "escalated" },
  { sno: 20, total: "", direction: "", answerStatus: "Answered Inbound", type: "call disposition", subType: "callback required" },
  { sno: 21, total: "", direction: "", answerStatus: "Answered Inbound", type: "call duration", subType: "< 10sec" },
  { sno: 22, total: "", direction: "", answerStatus: "Answered Inbound", type: "call duration", subType: "10 sec - 1 min" },
  { sno: 23, total: "", direction: "", answerStatus: "Answered Inbound", type: "call duration", subType: ">1min." },
  { sno: 24, total: "", direction: "", answerStatus: "Answered Inbound", type: "Ai interaction", subType: "NLPErrorRate: % of misinterpreted intents/utterances" },
  { sno: 25, total: "", direction: "", answerStatus: "Answered Inbound", type: "Ai interaction", subType: "intentSuccessRate: % of intents successfully fulfilled" },
  { sno: 26, total: "", direction: "", answerStatus: "Answered Inbound", type: "Ai interaction", subType: "Resolution Success" },
];

function calculateRowSpans(rows: DataRow[], key: keyof DataRow) {
  const rowSpans: Record<number, number> = {};
  let lastValue: any = null;
  let count = 0;
  rows.forEach((row, index) => {
    if (row[key] === lastValue) {
      count++;
      rowSpans[index - count] = count + 1;
      rowSpans[index] = 0;
    } else {
      count = 0;
      lastValue = row[key];
      rowSpans[index] = 1;
    }
  });
  return rowSpans;
}

const MergedTable: React.FC = () => {  
  const totalCallSpans = calculateRowSpans(data, "direction");
  const directionSpans = calculateRowSpans(data, "direction");
  const answerStatusSpans = calculateRowSpans(data, "answerStatus");
  const typeSpans = calculateRowSpans(data, "type");

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-4 py-2">S No</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Direction</th>
            <th className="border px-4 py-2">Answer Status</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Sub Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="even:bg-gray-50">
              <td className="border px-4 py-2">{row.sno}</td>
              {
                index === 0 ? (
                  <td className="border px-4 py-2">{row.total}</td>
                ) : (
                  <td> </td>
                )
              }

              {directionSpans[index] > 0 && (
                <td
                  rowSpan={directionSpans[index]}
                  className="border px-4 py-2 align-top"
                >
                  {row.direction}
                </td>
              )}

              {answerStatusSpans[index] > 0 && (
                <td
                  rowSpan={answerStatusSpans[index]}
                  className="border px-4 py-2 align-top"
                >
                  {row.answerStatus}
                </td>
              )}

              {typeSpans[index] > 0 && (
                <td
                  rowSpan={typeSpans[index]}
                  className="border px-4 py-2 align-top"
                >
                  {row.type}
                </td>
              )}

              <td className="border px-4 py-2">{row.subType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MergedTable;

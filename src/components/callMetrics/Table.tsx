// // app/components/CallAnalysisTable.tsx
// "use client";

// import { useEffect, useState } from "react";
// import CallAnalysisCell from "./Cell";
// import { CALL_ANALYSIS_FIELD_LABELS } from "@/lib/callAnalysisFieldMap";

// const FIELDS_TO_DISPLAY = [
//   "status",
//   "language",
//   "callQualityScore",
//   "sentiment",
//   "scriptAdherenceScore",
//   // "violations",
//   "callDisposition",
//   "AIConfidenceScore",
//   "complianceRiskScore",
//   // "reviewerComments"
//   // ✅ Add/remove keys you want here
// ];

// export default function CallAnalysisTable() {
//   const [callData, setCallData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/callHistory/callHistory")
//       .then((res) => res.json())
//       .then((data) => {
//         const mappedData = data.data.map((item: any) => item.call_analysis);
//         setCallData(mappedData);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="w-[70vw] mx-auto overflow-hidden">
//       {loading ? (
//         <p className="text-gray-600">Loading call analysis...</p>
//       ) : (
//         <div className="overflow-x-auto overflow-y-auto max-h-[80vh] shadow-md rounded-xl border border-gray-200">
//           <table className="min-w-full divide-y divide-gray-200 text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   S.No
//                 </th>
//                 {FIELDS_TO_DISPLAY.map((key) => (
//                   <th
//                     key={key}
//                     className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
//                   >
//                     {CALL_ANALYSIS_FIELD_LABELS[key] ||
//                       key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {callData.map((call, index) => (
//                 <tr key={index} className="hover:bg-gray-50 transition duration-150">
//                   <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
//                     {index + 1}
//                   </td>
//                   {FIELDS_TO_DISPLAY.map((key) => (
//                     <CallAnalysisCell key={key} value={call?.[key]} field={key} />
//                   ))}
//                 </tr>
//               ))}
//               {callData.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={FIELDS_TO_DISPLAY.length + 1}
//                     className="px-6 py-4 text-center text-gray-500"
//                   >
//                     No call analysis data found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }



// app/components/CallAnalysisTable.tsx
"use client";

import { useEffect, useState } from "react";
import CallAnalysisCell from "./Cell";
import { CALL_ANALYSIS_FIELD_LABELS } from "@/lib/callAnalysisFieldMap";

const FIELDS_TO_DISPLAY = [
  "status",
  "language",
  "sentiment",
  "callQualityScore",
  "scriptAdherenceScore",
  "AIConfidenceScore",
];

export default function CallAnalysisTable() {
  const [callData, setCallData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/callHistory/callHistory")
      .then((res) => res.json())
      .then((data) => {
        // const mappedData = data.data.map((item: any) => {item.call_analysis && item.call_analysis });
        console.log(data.data)
        const mappedData = data.data
        .filter((item: any) => item.call_analysis)
        .map((item: any) => item.call_analysis);
        console.log(mappedData)
        setCallData(mappedData);
        setLoading(false);
      });
  }, []);

  const handleRowClick = (call: any) => {
    setSelectedCall(call);
  };

  return (
    <div className="w-[70vw] mx-auto overflow-hidden relative">
      {loading ? (
        <p className="text-gray-600">Loading call analysis...</p>
      ) : (
        <>
          <div className="overflow-x-auto overflow-y-auto max-h-[80vh] shadow-md rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  {FIELDS_TO_DISPLAY.map((key) => (
                    <th
                      key={key}
                      className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      {CALL_ANALYSIS_FIELD_LABELS[key] ||
                        key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {callData.map((call, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer transition duration-150"
                    onClick={() => handleRowClick(call)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      {index + 1}
                    </td>
                    {FIELDS_TO_DISPLAY.map((key) => (
                      <CallAnalysisCell key={key} value={call?.[key]} field={key} />
                    ))}
                  </tr>
                ))}
                {callData.length === 0 && (
                  <tr>
                    <td
                      colSpan={FIELDS_TO_DISPLAY.length + 1}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No call analysis data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedCall && (
            <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg border-l z-50 p-4 overflow-y-auto">
              <button
                onClick={() => setSelectedCall(null)}
                className="text-gray-500 hover:text-gray-700 mb-4"
              >
                Close
              </button>

              <h2 className="text-xl font-semibold mb-2">Call Details</h2>
              <div className="text-sm text-gray-700 space-y-2">
                {Object.entries(selectedCall).map(([key, value]) => (
                  <div key={key}>
                    <strong>{CALL_ANALYSIS_FIELD_LABELS[key] || key}:</strong>{" "}
                    {typeof value === "object" && value !== null
                      ? JSON.stringify(value)
                      : value?.toString() ?? "-"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

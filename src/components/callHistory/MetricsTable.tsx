// app/components/MetricsTable.tsx
'use client';

import { useEffect, useState } from 'react';
import MetricCell from './MetricCell';
import { FIELD_LABELS } from '@/lib/metricFieldMap';



export default function MetricsTable() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/callHistory/aggregatedMetrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        if (data.length > 0) {
          const firstDoc = data[0];
          setKeys(Object.keys(firstDoc));
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-[70vw] overflow-hidden mx-auto">

      {loading ? (
        <p className="text-gray-600">Loading metrics...</p>
      ) : (
        <div className="overflow-x-auto overflow-y-auto max-h-[80vh] shadow-md rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th 
                // className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                className='sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                    
                    S.No</th>
                {keys.map((key) => (
                  <th
                    key={key}
                    className='sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                    // className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                     {FIELD_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    {/* {key} */}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {metrics.map((metric, index) => (
                <tr key={metric._id || index} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{index + 1}</td>
                  {keys.map((key) => (
                    <MetricCell key={key} value={metric[key]} field={key} />
                  ))}
                </tr>
              ))}
              {metrics.length === 0 && (
                <tr>
                  <td colSpan={keys.length + 1} className="px-6 py-4 text-center text-gray-500">
                    No metrics found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

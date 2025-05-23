// components/CallChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, Area, ComposedChart } from 'recharts';
import axios from 'axios';

interface CallData {
  date: string;
  calls: number;
}

const CallChart = (filters: any) => {
  const [binSize, setBinSize] = useState(1);
  const [data, setData] = useState<CallData[]>([]);
  function getInterval(startDate: string, endDate: string): { unit: string, binSize?: number, format?: string } {
    // console.log(startDate, endDate, "startDate, endDate");
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    // console.log(diffInDays, "diffInDays", startDate, endDate);
    if(diffInDays === 0){
      setBinSize(1);
      return { unit: "day", binSize: 1 };
    }
  
    if (diffInDays <= 1) {
      setBinSize(2);
      return { unit: "hour", binSize: 1 }; // 2-hour intervals
    }
  
    if (diffInDays > 12) {
      setBinSize(Math.ceil(diffInDays / 11)); // total range / 10
      return { unit: "day", binSize: 1 }; // total range / 10
      // return { unit: "day", binSize: 1 }; // total range / 10
    }
    setBinSize(1);
    return { unit: "day", binSize: 1 }; // default to daily
  }
  

  useEffect(() => {
    const fetchData = async () => {
      // console.log(filters, "filters", filters.filters.startDate, filters.filters.endDate);
      const interval = getInterval(filters.filters.startDate, filters.filters.endDate);
      console.log(interval, "interval");
      try {
        const res = await axios.post('/api/analytics/charts/totalCall', {
          data: filters, interval: interval
        })
        // const res = await fetch('/api/analytics/charts/totalCall', {
        //   method: 'POST',
        //   body: JSON.stringify(filters)
        // })
        const data = await res.data
        console.log(data.data)
        setData(data.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData()
  }, [filters]);
  useEffect(() => {
    console.log(binSize, "binSize");
  }, [binSize]);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
    <h2 className="text-sm font-semibold mb-4">Calls Per Day</h2>
    {
      data.length == 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">No Calls for this filter</p>
        </div>
      ) : (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        {/* <LineChart data={data}> */}
        <CartesianGrid stroke="#c6abd1" strokeDasharray="5 5" />
        <XAxis 
            dataKey="date" 
            // tickCount={12}
            interval={binSize-1}
            tick={{ fontSize: '0.6rem', fontStyle: 'italic', fill: '#4b5563' }} // Smaller, italic labels
            // angle={-45}  // Rotate labels for better readability
            textAnchor="middle"  // Align the rotated text properly
            height={60}  // Adjust height to accommodate rotated labels
        />
        <YAxis 
              axisLine={false}      // Hides the Y-axis line
              // tickLine={false}   
            tickFormatter={(value) => `${value}`} // Optional: format Y-axis labels
            tick={{ fontSize: '0.875rem', fill: '#4b5563' }} // Smaller Y-axis labels
        />
        <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '5px' }} 
            labelStyle={{ fontWeight: 'bold' }} 
            itemStyle={{ fontStyle: 'italic' }}
        />
        {/* <Area 
          type="linear" 
          dataKey="calls" 
          stroke="#2563eb" 
          fill="#93c5fd" 
          fillOpacity={0.4}
        /> */}
        <Line type="linear" dataKey="calls" stroke="#2563eb" strokeWidth={2}
        // dot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
        // dot={true}
        dot={true}
         >
            {/* <LabelList 
              dataKey="calls" 
              position="top" 
              style={{ fontSize: '0.75rem', fill: '#4b5563', fontStyle: 'italic' }} 
            /> */}
          </Line>
        {/* </LineChart> */}
      </ComposedChart>
    </ResponsiveContainer>
    
    )
    }
  </div>
  );
};

export default CallChart;

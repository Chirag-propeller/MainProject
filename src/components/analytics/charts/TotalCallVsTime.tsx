// components/CallChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface CallData {
  date: string;
  calls: number;
}

const CallChart = (filters: any) => {
  const [data, setData] = useState<CallData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(filters)
      try {
        const res = await axios.post('/api/analytics/charts/totalCall', {
          data: filters
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

  return (
    <div className="bg-white rounded-2xl shadow p-6">
    <h2 className="text-xl font-semibold mb-4">Calls Per Day</h2>
    <ResponsiveContainer width={850} height={300}>
        <LineChart data={data}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
        <XAxis 
            dataKey="date" 
            tick={{ fontSize: '0.875rem', fontStyle: 'italic', fill: '#4b5563' }} // Smaller, italic labels
            angle={-45}  // Rotate labels for better readability
            textAnchor="end"  // Align the rotated text properly
            height={60}  // Adjust height to accommodate rotated labels
        />
        <YAxis 
            tickFormatter={(value) => `${value}`} // Optional: format Y-axis labels
            tick={{ fontSize: '0.875rem', fill: '#4b5563' }} // Smaller Y-axis labels
        />
        <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '5px' }} 
            labelStyle={{ fontWeight: 'bold' }} 
            itemStyle={{ fontStyle: 'italic' }}
        />
        <Line type="monotone" dataKey="calls" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
    </ResponsiveContainer>
    </div>

    // <div className="bg-white rounded-2xl shadow p-4">
    //   <h2 className="text-xl font-semibold mb-4">Calls Per Day</h2>
    //   <ResponsiveContainer width="100%" height={300}>
    //     <LineChart data={data}>
    //       <CartesianGrid stroke="#ccc" />
    //       <XAxis dataKey="date" />
    //       <YAxis />
    //       <Tooltip />
    //       <Line type="monotone" dataKey="calls" stroke="#2563eb" strokeWidth={2} />
    //     </LineChart>
    //   </ResponsiveContainer>
    // </div>
  );
};

export default CallChart;

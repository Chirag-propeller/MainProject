import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Phone, PhoneCall, PhoneOff, X } from "lucide-react";

interface RealtimeCallStatus {
  connected: number;
  notConnected: number;
}

interface RealtimeCallDoughnutProps {
  data: RealtimeCallStatus;
}

const RealtimeCallDoughnut: React.FC<RealtimeCallDoughnutProps> = ({
  data,
}) => {
  const totalCalls = data.connected + data.notConnected;
  const connectedPercentage =
    totalCalls > 0 ? ((data.connected / totalCalls) * 100).toFixed(1) : "0.0";

  const chartData = [
    {
      name: "Connected",
      value: data.connected,
      color: "#5EA0C1",
      icon: PhoneCall,
    },
    {
      name: "Not Connected",
      value: data.notConnected,
      color: "#606FCC",
      icon: PhoneOff,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        totalCalls > 0 ? ((data.value / totalCalls) * 100).toFixed(1) : "0.0";
      return (
        <div className="bg-white border border-gray-200 rounded-[6px] p-1 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            ></div>
            <span className="text-sm font-medium text-gray-800">
              {data.name}
            </span>
          </div>
          <div className="text-xs text-gray-600">Count: {data.value}</div>
          <div className="text-xs text-gray-600">Percentage: {percentage}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-[420px] mx-auto p-4 flex flex-col items-center bg-white border-1 border-gray-400 border-l-6 border-l-indigo-500 rounded-[6px] dark:bg-gray-900 dark:border-gray-700 dark:border-l-indigo-400">
      <h3 className="text-[16px] font-medium text-gray-700 mb-2 dark:text-gray-100 text-center">
        Real-time Call Status
      </h3>
      {/* Main Metric */}
      <div className="text-center mb-2">
        <div className="text-2xl font-bold text-indigo-500 mb-1 dark:text-blue-300">
          {connectedPercentage}%
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Connected ({data.connected}/{totalCalls})
        </div>
      </div>
      {/* Chart and Legend Container (vertical) */}
      <div className="flex flex-col items-center min-h-0 w-full">
        {/* Doughnut Chart */}
        <div className="flex justify-center items-center min-h-0 mb-1 w-full">
          <div className="mx-auto max-w-[320px] aspect-square w-full flex justify-center items-center">
            <ResponsiveContainer width="90%" height="90%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="75%"
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Legend in a single row below chart */}
        <div className="flex flex-row gap-4 text-xs w-full items-center justify-center mt-1 mb-0">
          {chartData.map((item, index) => {
            return (
              <div key={index} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex flex-col min-w-0">
                  <span className="text-gray-600 text-xs font-medium truncate dark:text-gray-200">
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RealtimeCallDoughnut;

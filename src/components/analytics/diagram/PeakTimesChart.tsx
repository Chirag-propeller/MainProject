import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Clock, TrendingUp } from "lucide-react";

interface PeakTimeData {
  hour: number;
  totalCalls: number;
  connectedCalls: number;
  avgCallsPerDay: number;
}

interface PeakTimesChartProps {
  data: PeakTimeData[];
}

const PeakTimesChart: React.FC<PeakTimesChartProps> = ({ data }) => {
  // Find peak hour
  const peakHour = data.reduce(
    (max, item) => (item.totalCalls > max.totalCalls ? item : max),
    data[0] || { hour: 0, totalCalls: 0 }
  );

  // Format hour for display
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  // Calculate success rate for peak hour
  const peakSuccessRate =
    peakHour.totalCalls > 0
      ? ((peakHour.connectedCalls / peakHour.totalCalls) * 100).toFixed(1)
      : "0.0";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-[6px] p-3 shadow-lg">
          <div className="text-sm font-medium text-gray-800 mb-2">
            {formatHour(label)}
          </div>
          <div className="text-xs text-gray-600">
            <div>Total Calls: {data.totalCalls}</div>
            <div>Connected: {data.connectedCalls}</div>
            <div>
              Success Rate:{" "}
              {data.totalCalls > 0
                ? ((data.connectedCalls / data.totalCalls) * 100).toFixed(1)
                : "0.0"}
              %
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className=" p-4 bg-white border-1 border-gray-400 border-l-6 border-l-indigo-500 rounded-[6px] min-h-0 dark:bg-gray-900 dark:border-gray-700 dark:border-l-indigo-400">
      <h3 className="text-[16px] font-medium text-gray-700 mb-2 dark:text-gray-100">
        Peak Times Analysis
      </h3>

      {/* Peak Hour Stats */}
      <div className="text-center mb-2 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0 dark:text-indigo-300" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Peak Hour
          </span>
        </div>
        <div className="text-2xl font-bold text-indigo-600 mb-1 dark:text-indigo-300">
          {formatHour(peakHour.hour)}
        </div>
        <div className="text-sm text-gray-500 mb-2 dark:text-gray-300">
          {peakHour.totalCalls} calls • {peakSuccessRate}% success
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="h-43 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
            className="dark:bg-gray-900"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              tick={{
                fontSize: 10,
                fill: "#666",
                fontWeight: 500,
                className: "dark:fill-gray-300",
              }}
              axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              tickLine={{ stroke: "#e5e7eb" }}
              tickFormatter={formatHour}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{
                fontSize: 10,
                fill: "#666",
                fontWeight: 500,
                className: "dark:fill-gray-300",
              }}
              axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              tickLine={{ stroke: "#e5e7eb" }}
              width={30}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="totalCalls"
              fill="#59E7B0"
              radius={[2, 2, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PeakTimesChart;

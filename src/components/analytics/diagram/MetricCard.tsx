import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MetricCardProps {
  title: string;
  value: string | number;
  chartData?: { date: string; value: number }[];
  subtext?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
        {payload[0].payload.date}: {payload[0].value}
      </div>
    );
  }
  return null;
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  chartData,
  subtext,
  className,
}) => (
  <div
    className={`rounded-[4px] p-3 bg-white border-1 border-gray-400 border-l-6 border-l-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:border-l-indigo-400 transition-transform duration-200 transform hover:scale-103 ${className}`}
  >
    <div className="text-[16px] text-indigo-500 mb-1 dark:text-indigo-300">
      {title}
    </div>
    <div className="text-2xl font-bold text-indigo-500 dark:text-indigo-300">
      {value}
    </div>
    {chartData && chartData.length > 1 && (
      <div className="mt-3 flex items-center justify-center w-full h-[80px]">
        <ResponsiveContainer
          width="120%"
          height={100}
          className="dark:bg-gray-900"
        >
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -30, bottom: 2 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: "#666", fontWeight: 500 }}
              axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              tickLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 9, fill: "#666", fontWeight: 100 }}
              axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              tickLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#8b5cf6",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#59E7B0"
              strokeWidth={1.5}
              dot={{ fill: "#54e884", strokeWidth: 0, r: 2 }}
              activeDot={{
                r: 5,
                stroke: "#8b5cf6",
                strokeWidth: 2,
                fill: "#fff",
              }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}

    {subtext && (
      <div className="text-sm text-gray-400 mt-1 dark:text-gray-300">
        {subtext}
      </div>
    )}
  </div>
);

export default MetricCard;

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PRICING } from "@/components/agents/Constants";
import { format, CurrencyCode, CURRENCY_SYMBOLS } from "@/lib/currency";

export function CostBreakdownChart({
  data,
  currency = "INR",
}: {
  data: Array<{
    date: string;
    llm: number;
    stt: number;
    tts: number;
    platform?: number;
  }>;
  currency?: CurrencyCode;
}) {
  // Add platform cost to each data point
  const dataWithPlatform = data.map((d) => ({
    ...d,
    platform: PRICING.PropalCostInINR,
  }));
  const symbol = CURRENCY_SYMBOLS[currency] || "₹";
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={dataWithPlatform}
        margin={{ top: 15, right: 10, left: -10, bottom: -40 }}
        className="dark:bg-gray-900"
      >
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#666", className: "dark:fill-gray-300" }}
          axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
          tickLine={{ stroke: "#e5e7eb" }}
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#666", className: "dark:fill-gray-300" }}
          axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
          tickLine={{ stroke: "#e5e7eb" }}
          tickFormatter={(value) => `${symbol}${Number(value).toFixed(0)}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff", // dark:bg-gray-800
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#000",
            fontSize: "11px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
          }}
          labelFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }}
          cursor={{ fill: "transparent" }}
          formatter={(value, name, props) => {
            // Always use the correct currency code for formatting
            return [format(Number(value), currency), name];
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "2px" }}
          iconType="circle"
          iconSize={8}
          fontSize={11}
          className="dark:text-gray-100"
        />
        {/* <Bar
          dataKey="platform"
          fill="#f59e42"
          name="Platform"
          radius={[4, 4, 0, 0]}
          stackId="cost"
        /> */}
        <Bar
          dataKey="llm"
          fill="#a5b4fc"
          name="LLM"
          radius={[0, 0, 0, 0]}
          stackId="cost"
        />
        <Bar
          dataKey="stt"
          fill="#06b6d4"
          name="STT"
          radius={[0, 0, 0, 0]}
          stackId="cost"
        />
        <Bar
          dataKey="tts"
          fill="#3730a3"
          name="TTS"
          radius={[4, 4, 0, 0]}
          stackId="cost"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

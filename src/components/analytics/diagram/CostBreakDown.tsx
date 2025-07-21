import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function CostBreakdownChart({
  data,
}: {
  data: Array<{ date: string; llm: number; stt: number; tts: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={data}
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
          tickFormatter={(value) => `₹${value.toFixed(0)}`}
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
          formatter={(value, name) => [`₹${Number(value).toFixed(2)}`, name]}
        />
        <Legend
          wrapperStyle={{ paddingTop: "2px" }}
          iconType="circle"
          iconSize={8}
          fontSize={11}
          className="dark:text-gray-100"
        />
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

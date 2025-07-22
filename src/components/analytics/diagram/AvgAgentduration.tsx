import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChevronDown } from "lucide-react";

// Transform backend data to { date, [agentName]: avgDuration, ... }
function transformAvgDurationData(
  data: Array<{ date: string; agent: string; totalDuration: number }> = []
) {
  const byDate: Record<string, any> = {};
  data.forEach(({ date, agent, totalDuration }) => {
    if (!byDate[date]) byDate[date] = { date };
    byDate[date][agent] = totalDuration;
  });
  return Object.values(byDate);
}

const colorPalette = ["#59E7B0", "#5E9EC1", "#626BCD", "#6819E0"];

const LOCAL_STORAGE_KEY = "avgAgentDurationSelectedAgents";

export function AvgCallDurationChart({
  data = [],
}: {
  data?: Array<{ date: string; agent: string; totalDuration: number }>;
}) {
  const chartData = transformAvgDurationData(data);
  const agentNames = useMemo(
    () => Array.from(new Set(data.map((d) => d.agent))),
    [data]
  );

  // Load from localStorage or default to all agents (max 4)
  const getInitialSelected = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only keep agents that still exist
        return parsed.filter((a: string) => agentNames.includes(a)).slice(0, 4);
      }
    }
    return agentNames.slice(0, 4);
  };

  const [selectedAgents, setSelectedAgents] =
    useState<string[]>(getInitialSelected);

  // Update selected agents if agentNames change (keep only valid, max 4)
  useEffect(() => {
    setSelectedAgents((prev) => {
      const filtered = prev.filter((a) => agentNames.includes(a));
      if (filtered.length === 0) return agentNames.slice(0, 4);
      return filtered.slice(0, 4);
    });
  }, [agentNames]);

  // Persist selection
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedAgents));
    }
  }, [selectedAgents]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleCheckboxChange = (agent: string) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agent)) {
        return prev.filter((a) => a !== agent);
      } else if (prev.length < 4) {
        return [...prev, agent];
      }
      return prev;
    });
  };

  return (
    <div className="relative">
      {/* Heading and Filter Button Row */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[16px] font-medium text-gray-700 dark:text-gray-100">
          Total Call Duration by Agent
        </h3>
        <div ref={dropdownRef} className="relative">
          <button
            className="border rounded px-2 py-1 text-xs w-48 justify-between bg-white dark:bg-gray-900 dark:text-gray-100 border-gray-400 flex items-center gap-1"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            Filter Agents
            <ChevronDown
              className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 h-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg p-2 z-20 flex flex-col">
              {/* Sticky description at the top */}
              <div className="sticky top-0 left-0 right-0 bg-white dark:bg-gray-900 z-10 text-[10px] text-gray-500 dark:text-gray-300 py-1 px-2 border-b border-gray-200 dark:border-gray-700">
                Select up to 4 agents at a time
              </div>
              <div className="flex-1 overflow-y-auto">
                {agentNames.map((agent) => {
                  const checked = selectedAgents.includes(agent);
                  const disabled = !checked && selectedAgents.length >= 4;
                  return (
                    <label
                      key={agent}
                      className={`flex items-center gap-2 py-1 px-2 cursor-pointer text-xs dark:text-gray-100 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => handleCheckboxChange(agent)}
                        className="accent-indigo-600"
                      />
                      <span
                        className="truncate max-w-[150px] dark:text-gray-200"
                        title={agent}
                      >
                        {agent}
                      </span>
                    </label>
                  );
                })}
              </div>
              <button
                className="sticky bottom-0 left-0 right-0 mt-2 w-full text-xs py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => setDropdownOpen(false)}
                style={{ zIndex: 50 }}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={chartData}
          margin={{ top: 15, right: 25, left: 0, bottom: -30 }}
          className="dark:bg-gray-900"
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{
              fontSize: 12,
              fill: "#666",
              className: "dark:fill-gray-300",
            }}
            axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            tickLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis
            tick={{
              fontSize: 12,
              fill: "#666",
              className: "dark:fill-gray-300",
            }}
            axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            tickLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(value) => `${value.toFixed(0)}m`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              color: "#000",
              fontSize: "10px",
              padding: "4px 8px",
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
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
          />
          <Legend
            formatter={(value) =>
              value.length > 15 ? `${value.substring(0, 15)}...` : value
            }
            wrapperStyle={{
              paddingTop: "0px",
              marginTop: "-10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            iconType="circle"
            iconSize={8}
            fontSize={10}
            className="dark:text-gray-100"
          />
          {selectedAgents.slice(0, 4).map((agent, idx) => (
            <Line
              key={agent}
              type="monotone"
              dataKey={agent}
              stroke={colorPalette[idx % colorPalette.length]}
              strokeWidth={1}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

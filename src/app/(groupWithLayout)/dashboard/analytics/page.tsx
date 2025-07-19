"use client";
import DiagramCanvas from "@/components/analytics/diagram/DiagramCanvas";
import Filters from "@/components/analytics/FilterBar";
import React, { useEffect, useState, useCallback } from "react";
import MetricCard from "@/components/analytics/diagram/MetricCard";
import axios from "axios";
import { LineChart } from "lucide-react";
import { FilterState } from "@/components/callHistory/topBar/Filter";
import { AvgCallDurationChart } from "@/components/analytics/diagram/AvgAgentduration";
import { CostBreakdownChart } from "@/components/analytics/diagram/CostBreakDown";
import RealtimeCallDoughnut from "@/components/analytics/diagram/RealtimeCallDoughnut";
import PeakTimesChart from "@/components/analytics/diagram/PeakTimesChart";

interface TimeSeriesPoint {
  date: string;
  value: number;
}

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<any>({});
  const [metrics, setMetrics] = useState<{
    costBreakdownByDay: {
      date: string;
      llm: number;
      stt: number;
      tts: number;
    }[];
    agentTotalDurationByDay: {
      date: string;
      agent: string;
      totalDuration: number;
    }[];
    totalCallMinutes: TimeSeriesPoint[];
    numberOfCalls: TimeSeriesPoint[];
    totalSpent: TimeSeriesPoint[];
    avgCostPerCall: TimeSeriesPoint[];
    realtimeCallStatus: {
      connected: number;
      notConnected: number;
    };
    peakTimes: {
      hour: number;
      totalCalls: number;
      connectedCalls: number;
      avgCallsPerDay: number;
    }[];
  }>({
    costBreakdownByDay: [],
    agentTotalDurationByDay: [],
    totalCallMinutes: [],
    numberOfCalls: [],
    totalSpent: [],
    avgCostPerCall: [],
    realtimeCallStatus: {
      connected: 0,
      notConnected: 0,
    },
    peakTimes: [],
  });
  const [loading, setLoading] = useState(false);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .post("/api/analytics", { data: filters })
      .then((res) => {
        setMetrics(res.data);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const getSum = (arr: any[]) =>
    arr?.reduce((acc, cur) => {
      const val =
        typeof cur?.value === "number"
          ? cur.value
          : typeof cur?.value === "object" && cur.value?.$numberDecimal
            ? parseFloat(cur.value.$numberDecimal)
            : 0;
      return acc + val;
    }, 0) || 0;

  return (
    <div className="w-full h-screen overflow-y-auto dark:bg-gray-900 dark:text-gray-100">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="px-4">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-6">
              <h1 className="text-lg text-indigo-600 dark:text-indigo-300">
                Analytics
              </h1>
              <div className="relative min-w-[200px] overflow-visible z-20">
                <Filters onChange={handleFilterChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-2">
        <div className="flex flex-col gap-2">
          {/* Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Call Minutes"
              value={getSum(metrics.totalCallMinutes).toFixed(2)}
              chartData={metrics.totalCallMinutes}
            />
            <MetricCard
              title="Number of Calls"
              value={getSum(metrics.numberOfCalls)}
              chartData={metrics.numberOfCalls}
            />
            <MetricCard
              title="Total Spent"
              value={`₹${getSum(metrics.totalSpent).toFixed(2)}`}
              chartData={metrics.totalSpent}
            />
            <MetricCard
              title="Average Cost per Call"
              value={
                getSum(metrics.numberOfCalls) > 0
                  ? `₹${(getSum(metrics.totalSpent) / getSum(metrics.numberOfCalls)).toFixed(2)}`
                  : "₹0.00"
              }
              chartData={metrics.avgCostPerCall}
            />
          </div>
          {/* <div className="flex-1 flex">
            <DiagramCanvas filters={filters} />
          </div> */}

          {/* Charts Section */}
          <div className="mt- mb-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-4 bg-white border-1 border-gray-400 border-l-6 border-l-indigo-500 rounded-[6px] dark:bg-gray-900 dark:border-gray-700 dark:border-l-indigo-400">
                <AvgCallDurationChart data={metrics.agentTotalDurationByDay} />
              </div>
              {/* <div className="p-4 bg-white border-1 border-gray-400 border-l-6 border-l-indigo-500 rounded-[6px] dark:bg-gray-900 dark:border-gray-700 dark:border-l-indigo-400">
                <h3 className="text-lg font-medium text-gray-700 mb-4 dark:text-gray-100">
                  Cost Breakdown
                </h3>
                <CostBreakdownChart data={metrics.costBreakdownByDay} />
              </div> */}
              <div className="w-full">
                <PeakTimesChart data={metrics.peakTimes} />
              </div>
            </div>
          </div>

          {/* Real-time Call Status Section */}
          <div className="mt-6 mb-5">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-3 flex justify-center">
                <RealtimeCallDoughnut data={metrics.realtimeCallStatus} />
              </div>
              <div className="col-span-12 md:col-span-9 flex items-stretch">
                <div className="bg-white border-1 border-gray-400 border-l-6 border-l-indigo-500 rounded-[6px] dark:bg-gray-900 dark:border-gray-700 dark:border-l-indigo-400 w-full flex flex-col">
                  <h3 className="text-[16px] font-medium text-gray-700 mb-4 dark:text-gray-100 px-4 pt-4">
                    Cost Breakdown
                  </h3>
                  <div className="flex-1 px-4 pb-4">
                    <CostBreakdownChart data={metrics.costBreakdownByDay} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

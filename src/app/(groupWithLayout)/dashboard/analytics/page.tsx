"use client";
import DiagramCanvas from "@/components/analytics/diagram/DiagramCanvas";
import Filters from "@/components/analytics/FilterBar";
import React, { useEffect, useState, useCallback } from "react";
import MetricCard from "@/components/analytics/diagram/MetricCard";
import axios from "axios";
import { AvgCallDurationChart } from "@/components/analytics/diagram/AvgAgentduration";
import { CostBreakdownChart } from "@/components/analytics/diagram/CostBreakDown";
import RealtimeCallDoughnut from "@/components/analytics/diagram/RealtimeCallDoughnut";
import PeakTimesChart from "@/components/analytics/diagram/PeakTimesChart";
import { useUserData } from "@/components/profile/UserDataContext";
import {
  convert,
  format,
  CURRENCY_SYMBOLS,
  CurrencyCode,
} from "@/lib/currency";
import { PRICING } from "@/components/agents/Constants";

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
  const { user } = useUserData();
  const currency = (user?.currency || "INR") as CurrencyCode;

  // Convert INR values to user's currency (except platform cost, which is USD)
  const convertINR = (amount: number) => {
    if (currency === "INR") return amount;
    // Convert INR to USD, then to target currency
    return convert(amount / 85, currency);
  };

  // Prepare cost breakdown data for chart
  const costBreakdownData = metrics.costBreakdownByDay.map((row) => ({
    ...row,
    llm: convertINR(row.llm),
    stt: convertINR(row.stt),
    tts: convertINR(row.tts),
    platform: convertINR(PRICING.PropalCostInINR),
  }));

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
          <div className="flex justify-between items-center py-1.25">
            <h1 className="text-lg text-indigo-600 dark:text-indigo-300">
              Analytics
            </h1>
            <div className="relative min-w-[200px] overflow-visible z-20">
              <Filters onChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-2">
        <div className="flex flex-col gap-2">
          {/* Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
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
              value={format(convertINR(getSum(metrics.totalSpent)), currency)}
              chartData={metrics.totalSpent}
            />
            <MetricCard
              title="Average Cost per Call"
              value={
                getSum(metrics.numberOfCalls) > 0
                  ? format(
                      convertINR(
                        getSum(metrics.totalSpent) /
                          getSum(metrics.numberOfCalls)
                      ),
                      currency
                    )
                  : format(0, currency)
              }
              chartData={metrics.avgCostPerCall}
            />
          </div>
          <div className="flex-1 flex">
            <DiagramCanvas filters={filters} />
          </div>

          {/* Charts Section */}
          <div className="my-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 bg-white border-1 border-gray-400 border-l-6 border-l-indigo-500 rounded-[6px] dark:bg-gray-900 dark:border-gray-700 dark:border-l-indigo-400">
                <AvgCallDurationChart data={metrics.agentTotalDurationByDay} />
              </div>
              <div className="w-full">
                <PeakTimesChart data={metrics.peakTimes} />
              </div>
            </div>
          </div>

          {/* Real-time Call Status Section */}
          <div className="my-2 mb-5">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3 flex justify-center">
                <RealtimeCallDoughnut data={metrics.realtimeCallStatus} />
              </div>
              <div className="col-span-12 md:col-span-9 flex items-stretch">
                <div className="bg-white border-1 border-gray-400 border-l-6 border-l-indigo-500 rounded-[6px] dark:bg-gray-900 dark:border-gray-700 dark:border-l-indigo-400 w-full flex flex-col">
                  <h3 className="text-[16px] font-medium text-gray-700 mb-4 dark:text-gray-100 px-4 pt-4">
                    Cost Breakdown
                  </h3>
                  <div className="flex-1 px-4 pb-4">
                    <CostBreakdownChart
                      data={costBreakdownData}
                      currency={currency}
                    />
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

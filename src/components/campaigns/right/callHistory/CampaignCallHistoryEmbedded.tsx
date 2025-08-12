"use client";

import React, { useEffect, useState } from "react";
import { History } from "lucide-react";
import FunctionalityBar from "@/components/callHistory/topBar/FunctionalityBar";
import Table from "@/components/callMetrics/Table";
import axios from "axios";
import { Agent } from "@/components/agents/types";
import { FilterState } from "@/components/callHistory/topBar/Filter";
import { DateRangeFilter } from "@/components/callHistory/topBar/DateFilter";

export default function CampaignCallHistoryEmbedded({
  campaignId,
}: {
  campaignId: string;
}) {
  const [agentOptions, setAgentOptions] = useState<Agent[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [customiseField, setCustomiseField] = useState<string[]>([
    "started_at",
    "call_type",
    "call_direction",
    "call_duration",
    "status",
    "agent",
    "average_latency",
    "call_quality_score",
    "script_adherence_score",
    "ai_confidence_score",
    "phonenumber",
    "download_transcript",
  ]);

  const [filters, setFilters] = useState<FilterState>({
    agent: [],
    status: [],
    sentiment: [],
  });

  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const [userRes, agentsRes] = await Promise.all([
          axios.get("/api/user/getCurrentUser"),
          axios.get("/api/agents/get"),
        ]);
        const userData = userRes.data;
        if (userData.callHistoryFields && userData.callHistoryFields.length > 0) {
          const userFields = userData.callHistoryFields;
          setCustomiseField(
            userFields.includes("download_transcript")
              ? userFields
              : [...userFields, "download_transcript"]
          );
        }
        setAgentOptions(agentsRes.data || []);
      } catch (e) {
        // ignore
      }
    };
    init();
  }, []);

  return (
    <div className="w-full max-w-[980px]">
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900">
        <div className="flex gap-1.5 py-2 pl-1">
          <History className="w-3.5 h-3.5 self-center text-indigo-600" />
          <h2 className="text-sm self-center text-indigo-600">Call History</h2>
        </div>

        <FunctionalityBar
          customiseField={customiseField}
          setCustomiseField={setCustomiseField}
          filters={filters}
          setFilters={setFilters}
          dateRange={dateRange}
          limit={limit}
          setLimit={setLimit}
          setDateRange={setDateRange}
          agentOptions={agentOptions}
          statusOptions={[
            { label: "Connected", value: "connected" },
            { label: "Not Connected", value: "not_connected" },
          ]}
          sentimentOptions={[
            { label: "Positive", value: "positive" },
            { label: "Neutral", value: "neutral" },
            { label: "Negative", value: "negative" },
          ]}
          campaignId={campaignId}
        />
      </div>

      <div className="pr-1">
        <Table
          customiseField={customiseField}
          filters={filters}
          agentOptions={agentOptions}
          dateRange={dateRange}
          page={page}
          limit={limit}
          setTotalPages={setTotalPages}
          setHasNextPage={setHasNextPage}
          setHasPreviousPage={setHasPreviousPage}
          campaignId={campaignId}
          embedded
        />
      </div>

      <div className="flex justify-center gap-2 p-1 pt-2">
        {/* Simple pager inside panel */}
        <button
          className="px-2 py-1 text-xs rounded-[4px] border border-gray-300 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!hasPreviousPage}
        >
          Prev
        </button>
        <div className="text-xs text-gray-500 self-center">
          Page:{page} / {totalPages}
        </div>
        <button
          className="px-2 py-1 text-xs rounded-[4px] border border-gray-300 disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}



"use client";

import React, { useEffect, useState } from "react";
import FunctionalityBar from "@/components/callHistory/topBar/FunctionalityBar";
import Table from "@/components/callMetrics/Table";
import axios from "axios";
import { Agent } from "@/components/agents/types";
import { FilterState } from "@/components/callHistory/topBar/Filter";
import { DateRangeFilter } from "@/components/callHistory/topBar/DateFilter";

type FlexibleCallHistoryProps = {
  campaignId?: string;
  fluid?: boolean; // use full available width
  className?: string; // optional wrapper sizing
  embedded?: boolean; // tune internal table/drawer sizing
};

export default function FlexibleCallHistory({
  campaignId,
  fluid = false,
  className = "w-full max-w-[980px]",
  embedded = true,
}: FlexibleCallHistoryProps) {
  const [agentOptions] = useState<Agent[]>([]); // intentionally empty (no agent filter)
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

  // Do not load or persist custom field preferences from DB in this flexible view

  return (
    <div className={className}>
      <div className="sticky top-0 z-10 bg-transparent">
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
          persistSelection={false}
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
          hideAgentFilter
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
          embedded={embedded}
          fluid={fluid}
        />
      </div>

      <div className="flex justify-center gap-2 p-1 pt-2">
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



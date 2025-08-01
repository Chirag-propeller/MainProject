"use client";

import Table from "@/components/callMetrics/Table";
import React, { useState, useEffect } from "react";
import FunctionalityBar from "@/components/callHistory/topBar/FunctionalityBar";
import { FilterState } from "@/components/callHistory/topBar/Filter";
import { DateRangeFilter } from "@/components/callHistory/topBar/DateFilter";
import axios from "axios";
import { Agent } from "@/components/agents/types";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const allFields = [
  "started_at",
  "call_type",
  "call_direction",
  "call_duration",
  "status",
  "agent",
  "average_latency",
  "phonenumber",
  "from_phonenumber",
  "cost",
  "sentiment",
  "goal_completion_status",
  "call_quality_score",
  "script_adherence_score",
  "ai_confidence_score",
  "compliance_risk_score",
  "llm",
  "stt",
  "tts",
  "llm_cost",
  "stt_cost",
  "tts_cost",
  "download_transcript",
];

// Sample data for filters

const statusOptions = [
  { label: "Connected", value: "connected" },
  { label: "Not Connected", value: "not_connected" },
];

const sentimentOptions = [
  { label: "Positive", value: "positive" },
  { label: "Neutral", value: "neutral" },
  { label: "Negative", value: "negative" },
];

const page = () => {
  const router = useRouter();
  const [agentOptions, setAgentOptions] = useState<Agent[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [customiseField, setCustomiseField] = useState([
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

  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  useEffect(() => {
    const fetchCustomiseField = async () => {
      const response = await axios.get("/api/user/getCurrentUser");
      const userData = response.data;
      // console.log(userData);
      if (userData.callHistoryFields && userData.callHistoryFields.length > 0) {
        // Ensure download_transcript is always included
        const userFields = userData.callHistoryFields;
        if (!userFields.includes("download_transcript")) {
          setCustomiseField([...userFields, "download_transcript"]);
        } else {
          setCustomiseField(userFields);
        }
      }
    };
    fetchCustomiseField();
  }, []);

  useEffect(() => {
    router.push(`/dashboard/callHistory?page=${page}&limit=${limit}`);
    const fetchAgents = async () => {
      const response = await axios.get("/api/agents/get");
      const agents = response.data;
      // console.log(agents);
      setAgentOptions(agents);
    };
    fetchAgents();
  }, []);

  const pageChanger = (page: number) => {
    setPage(page);
    router.push(`/dashboard/callHistory?page=${page}&limit=${limit}`);
  };

  // You could implement the filtering logic here or pass the filters to the Table component

  return (
    <div className="pl-4 pb-10">
      <div className="sticky top-0 z-100 bg-white dark:bg-gray-900">
        <div className="flex gap-1.5 py-4 ">
          <History className="w-3.5 h-3.5  self-center text-indigo-600" />
          <h1 className="text-lg  self-center text-indigo-600">Call History</h1>
        </div>

        <div className="flex items-center justify-between gap-2">
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
            statusOptions={statusOptions}
            sentimentOptions={sentimentOptions}
          />
        </div>
      </div>

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
      />
      <div className="flex justify-center gap-2 p-1 pt-2">
        {
          <Button
            size="sm"
            className="p-1 rounded-[4px]"
            onClick={() => pageChanger(page - 1)}
            disabled={!hasPreviousPage}
          >
            {" "}
            <ChevronLeft />{" "}
          </Button>
        }
        <div className="text-xs text-gray-500 self-center">
          {" "}
          Page:{page} / {totalPages}
        </div>
        {
          <Button
            size="sm"
            className="p-1 rounded-[4px]"
            onClick={() => pageChanger(page + 1)}
            disabled={!hasNextPage}
          >
            {" "}
            <ChevronRight />{" "}
          </Button>
        }
      </div>

      {/* <div className='flex justify-center gap-2 py-4  '>
        {
          page > 1 && <Button size="sm" className='rounded-[4px]' onClick={() => pageChanger(page - 1)}> <ChevronLeft /> </Button>
        }
        {
          <Button size="sm" className='rounded-[4px]' onClick={() => pageChanger(page + 1)}> <ChevronRight /> </Button>
        }
      </div> */}
    </div>
  );
};

export default page;

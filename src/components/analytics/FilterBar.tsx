// components/analytics/FilterBar.tsx
import React, { useState, useEffect, useCallback } from "react";
import DateFilter, {
  DateRangeFilter,
} from "@/components/callHistory/topBar/DateFilter";
import Filter, { FilterState } from "@/components/callHistory/topBar/Filter";
import { Clock, Calendar } from "lucide-react";
import { sub } from "date-fns";

// Sample filter options
const statusOptions = [
  { label: "Connected", value: "connected" },
  { label: "Not Connected", value: "not_connected" },
];

const sentimentOptions = [
  { label: "Positive", value: "positive" },
  { label: "Neutral", value: "neutral" },
  { label: "Negative", value: "negative" },
];

interface FilterBarProps {
  onChange: (filters: any) => void;
}

const Filters: React.FC<FilterBarProps> = ({ onChange }) => {
  const [agentOptions, setAgentOptions] = useState([]);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: null,
    endDate: null,
  });
  const [filters, setFilters] = useState<FilterState>({
    agent: [],
    status: [],
    sentiment: [],
  });

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents/get");
        const agents = await response.json();
        setAgentOptions(agents);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  // Update parent component when filters change - with memoization to prevent infinite loops
  const updateParentFilters = useCallback(() => {
    let endDateFormatted = null;
    if (dateRange.endDate) {
      // Create a new Date instance to avoid mutating the original
      const endDate = new Date(dateRange.endDate.getTime());
      endDate.setHours(23, 59, 59, 999);
      endDateFormatted = endDate.toISOString();
    }

    const updatedFilters = {
      ...filters,
      startDate: dateRange.startDate?.toISOString() || null,
      endDate: endDateFormatted,
    };
    onChange(updatedFilters);
  }, [filters, dateRange, onChange]);

  useEffect(() => {
    updateParentFilters();
  }, [updateParentFilters]);

  return (
    <div className="flex items-center">
      <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
      {/* <Filter 
        filters={filters}
        setFilters={setFilters}
        agentOptions={agentOptions}
        statusOptions={statusOptions}
        sentimentOptions={sentimentOptions}
      /> */}
    </div>
  );
};

export default Filters;

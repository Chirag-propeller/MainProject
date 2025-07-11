import React, { useState } from "react";
import CustomiseField from "./CustomiseField";
import Filter, { FilterState } from "./Filter";
import DateFilter, { DateRangeFilter } from "./DateFilter";
import { Agent } from "@/components/agents/types";
import Export from "./Export";

type FilterOption = {
  label: string;
  value: string;
};

const FunctionalityBar = ({
  customiseField,
  setCustomiseField,
  filters,
  limit,
  setLimit,
  setFilters,
  dateRange,
  setDateRange,
  agentOptions,
  statusOptions,
  sentimentOptions,
}: {
  customiseField: string[];
  setCustomiseField: (field: string[]) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  dateRange: DateRangeFilter;
  limit: number;
  setLimit: (limit: number) => void;
  setDateRange: React.Dispatch<React.SetStateAction<DateRangeFilter>>;
  agentOptions: Agent[];
  statusOptions: FilterOption[];
  sentimentOptions: FilterOption[];
}) => {
  const [page, setPage] = useState(1);

  return (
    <div className="flex pb-2 justify-between gap-2 w-full">
      <div className="flex gap-2">
        <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
        <Filter
          filters={filters}
          setFilters={setFilters}
          agentOptions={agentOptions}
          statusOptions={statusOptions}
          sentimentOptions={sentimentOptions}
        />
        <CustomiseField
          customiseField={customiseField}
          setCustomiseField={setCustomiseField}
        />
        {/* Add your selector here */}
        <div className="flex items-center gap-1 ml-2">
          <label htmlFor="limit" className="text-xs text-gray-600">
            Rows per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-xs"
          >
            {[10, 25, 50, 100].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex mr-20 self-center">
        <Export filters={filters} dateRange={dateRange} />
      </div>
    </div>
  );
};

export default FunctionalityBar;

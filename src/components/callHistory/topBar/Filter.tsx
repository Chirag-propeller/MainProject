import React, { useState, useRef, useEffect } from "react";
import {
  Filter as FilterIcon,
  X,
  CheckSquare,
  Square,
  UserRound,
  BarChart3,
  ThumbsUp,
} from "lucide-react";
import { Agent } from "@/components/agents/types";

type FilterOption = {
  label: string;
  value: string;
};

export type FilterState = {
  agent: string[];
  status: string[];
  sentiment: string[];
};

interface FilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  agentOptions: Agent[];
  statusOptions: FilterOption[];
  sentimentOptions: FilterOption[];
}

const Filter: React.FC<FilterProps> = ({
  filters,
  setFilters,
  agentOptions,
  statusOptions,
  sentimentOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const filterRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close the filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveMenu(null);
    }
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const toggleOption = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      if (prev[category].includes(value)) {
        return {
          ...prev,
          [category]: prev[category].filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [category]: [...prev[category], value],
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      agent: [],
      status: [],
      sentiment: [],
    });
  };

  const getActiveFilterCount = () => {
    return (
      filters.agent.length + filters.status.length + filters.sentiment.length
    );
  };

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={toggleFilter}
        className={`flex items-center gap-2 px-3 py-2 rounded-[4px] text-sm transition-colors  ${
          isOpen || getActiveFilterCount() > 0
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
            : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-500"
        }`}
      >
        <FilterIcon size={16} />
        <span>Filter</span>
        {getActiveFilterCount() > 0 && (
          <span className="flex items-center justify-center bg-indigo-600 text-white rounded-full h-5 w-5 text-xs">
            {getActiveFilterCount()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-[4px] shadow-lg z-50 border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-gray-700">
          <div className="flex justify-between items-center pt-2 pb-1 px-2 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-100">
              Filters
            </h4>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filter categories */}
          <div className="p-1">
            {/* Agent filter */}
            <div className="">
              <button
                className="w-full flex items-center justify-between p-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                onClick={() => toggleMenu("agent")}
              >
                <div className="flex items-center gap-2">
                  <UserRound
                    size={16}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <span className="text-xs font-medium dark:text-gray-200">
                    Agent
                  </span>
                  {filters.agent.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full">
                      {filters.agent.length}
                    </span>
                  )}
                </div>
                <span className="text-gray-400 dark:text-gray-500">
                  {activeMenu === "agent" ? "−" : "+"}
                </span>
              </button>

              {activeMenu === "agent" && (
                <div className="ml-8 border-l border-gray-200 dark:border-gray-700 pl-2 py-1">
                  {agentOptions.map((option: Agent, key: number) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                      onClick={() => toggleOption("agent", option.agentId)}
                    >
                      {filters.agent.includes(option.agentId) ? (
                        <CheckSquare
                          size={16}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                      ) : (
                        <Square
                          size={16}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      )}
                      <span className="text-xs dark:text-gray-300">
                        {option.agentName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status filter */}
            <div className="">
              <button
                className="w-full flex items-center justify-between py-1 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                onClick={() => toggleMenu("status")}
              >
                <div className="flex items-center gap-2">
                  <BarChart3
                    size={16}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <span className="text-xs font-medium dark:text-gray-200">
                    Call Status
                  </span>
                  {filters.status.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full">
                      {filters.status.length}
                    </span>
                  )}
                </div>
                <span className="text-gray-400 dark:text-gray-500">
                  {activeMenu === "status" ? "−" : "+"}
                </span>
              </button>

              {activeMenu === "status" && (
                <div className="ml-8 border-l border-gray-200 dark:border-gray-700 pl-2 py-1">
                  {statusOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                      onClick={() => toggleOption("status", option.value)}
                    >
                      {filters.status.includes(option.value) ? (
                        <CheckSquare
                          size={16}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                      ) : (
                        <Square
                          size={16}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      )}
                      <span className="text-xs dark:text-gray-300">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sentiment filter */}
            <div className="">
              <button
                className="w-full flex items-center justify-between py-1 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                onClick={() => toggleMenu("sentiment")}
              >
                <div className="flex items-center gap-2">
                  <ThumbsUp
                    size={16}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <span className="text-xs font-medium dark:text-gray-200">
                    Sentiment
                  </span>
                  {filters.sentiment.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full">
                      {filters.sentiment.length}
                    </span>
                  )}
                </div>
                <span className="text-gray-400 dark:text-gray-500">
                  {activeMenu === "sentiment" ? "−" : "+"}
                </span>
              </button>

              {activeMenu === "sentiment" && (
                <div className="ml-8 border-l border-gray-200 dark:border-gray-700 pl-2 py-1">
                  {sentimentOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                      onClick={() => toggleOption("sentiment", option.value)}
                    >
                      {filters.sentiment.includes(option.value) ? (
                        <CheckSquare
                          size={16}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                      ) : (
                        <Square
                          size={16}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      )}
                      <span className="text-xs dark:text-gray-300">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;

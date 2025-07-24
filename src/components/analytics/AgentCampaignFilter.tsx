import React, { useState, useRef, useEffect } from "react";
import { Megaphone, Users } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface AgentCampaignFilterProps {
  agentOptions: Option[];
  campaignOptions: Option[];
  selectedAgents: string[];
  selectedCampaigns: string[];
  onApply: (agents: string[], campaigns: string[]) => void;
}

const AgentCampaignFilter: React.FC<AgentCampaignFilterProps> = ({
  agentOptions,
  campaignOptions,
  selectedAgents,
  selectedCampaigns,
  onApply,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [tempAgents, setTempAgents] = useState<string[]>(selectedAgents);
  const [tempCampaigns, setTempCampaigns] =
    useState<string[]>(selectedCampaigns);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync temp state with props when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      setTempAgents(selectedAgents);
      setTempCampaigns(selectedCampaigns);
    }
  }, [dropdownOpen, selectedAgents, selectedCampaigns]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setActiveMenu(null);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleApply = () => {
    onApply(tempAgents, tempCampaigns);
    setDropdownOpen(false);
    setActiveMenu(null);
  };

  const getActiveCount = () => tempAgents.length + tempCampaigns.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-[4px] text-sm transition-colors  ${
          dropdownOpen || getActiveCount() > 0
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
            : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-500"
        }`}
        onClick={() => setDropdownOpen((open) => !open)}
        type="button"
      >
        <span>Filters</span>
        {getActiveCount() > 0 && (
          <span className="flex items-center justify-center bg-indigo-600 text-white rounded-full h-5 w-5 text-xs">
            {getActiveCount()}
          </span>
        )}
      </button>
      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-[4px] shadow-lg z-50 border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-gray-700">
          <div className="flex flex-col">
            <div className="flex justify-between items-center pt-2 pb-1 px-2 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-100">
                Filters
              </h4>
            </div>
            {/* Agent filter */}
            <div>
              <button
                className="w-full flex items-center justify-between p-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                onClick={() =>
                  setActiveMenu(activeMenu === "agent" ? null : "agent")
                }
              >
                <div className="flex items-center gap-2">
                  <span
                    className="material-icons text-gray-500 dark:text-gray-400"
                    style={{ fontSize: 16 }}
                  >
                    <Users className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-medium dark:text-gray-200">
                    Agent
                  </span>
                  {tempAgents.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full">
                      {tempAgents.length}
                    </span>
                  )}
                </div>
                <span className="text-gray-400 dark:text-gray-500">
                  {activeMenu === "agent" ? "−" : "+"}
                </span>
              </button>
              {activeMenu === "agent" && (
                <div className="ml-8 border-l border-gray-200 dark:border-gray-700 pl-2 py-1">
                  {agentOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                      onClick={() => {
                        if (tempAgents.includes(option.value)) {
                          setTempAgents((prev) =>
                            prev.filter((v) => v !== option.value)
                          );
                        } else {
                          setTempAgents((prev) => [...prev, option.value]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={tempAgents.includes(option.value)}
                        readOnly
                        className="accent-indigo-600"
                      />
                      <span className="text-xs dark:text-gray-300">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Campaign filter */}
            {/* <div>
              <button
                className="w-full flex items-center justify-between p-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                onClick={() =>
                  setActiveMenu(activeMenu === "campaign" ? null : "campaign")
                }
              >
                <div className="flex items-center gap-2">
                  <span
                    className="material-icons text-gray-500 dark:text-gray-400"
                    style={{ fontSize: 16 }}
                  >
                    <Megaphone className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-medium dark:text-gray-200">
                    Campaign
                  </span>
                  {tempCampaigns.length > 0 && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200 text-xs px-2 py-0.5 rounded-full">
                      {tempCampaigns.length}
                    </span>
                  )}
                </div>
                <span className="text-gray-400 dark:text-gray-500">
                  {activeMenu === "campaign" ? "−" : "+"}
                </span>
              </button>
              {activeMenu === "campaign" && (
                <div className="ml-8 border-l border-gray-200 dark:border-gray-700 pl-2 py-1">
                  {campaignOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                      onClick={() => {
                        if (tempCampaigns.includes(option.value)) {
                          setTempCampaigns((prev) =>
                            prev.filter((v) => v !== option.value)
                          );
                        } else {
                          setTempCampaigns((prev) => [...prev, option.value]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={tempCampaigns.includes(option.value)}
                        readOnly
                        className="accent-green-600"
                      />
                      <span className="text-xs dark:text-gray-300">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
            {/* Apply button */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 flex justify-end sticky bottom-0 gap-2">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-1 text-sm font-medium transition"
                onClick={handleApply}
                type="button"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCampaignFilter;

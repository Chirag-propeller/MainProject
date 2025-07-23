// components/analytics/FilterBar.tsx
import React, { useState, useEffect, useCallback } from "react";
import DateFilter, {
  DateRangeFilter,
} from "@/components/callHistory/topBar/DateFilter";
import Filter, { FilterState } from "@/components/callHistory/topBar/Filter";
import { Clock, Calendar } from "lucide-react";
import { sub } from "date-fns";
import { useRef } from "react";
import AgentCampaignFilter from "./AgentCampaignFilter";

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
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: null,
    endDate: null,
  });

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents/get");
        const agents = await response.json();
        // Map to { label, value }
        setAgentOptions(
          agents.map((agent: any) => ({
            label: agent.name || agent.agentName,
            value: agent.agentId,
          }))
        );
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("/api/createCampaign/get");
        const campaigns = await response.json();
        setCampaignOptions(
          campaigns.map((campaign: any) => ({
            label: campaign.name || campaign.campaignName,
            value: campaign.id || campaign._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  // Call onChange when dateRange or filters change
  useEffect(() => {
    let endDateFormatted = null;
    if (dateRange.endDate) {
      const endDate = new Date(dateRange.endDate.getTime());
      endDate.setHours(23, 59, 59, 999);
      endDateFormatted = endDate.toISOString();
    }
    const updatedFilters = {
      agent: selectedAgents,
      campaign: selectedCampaigns,
      startDate: dateRange.startDate?.toISOString() || null,
      endDate: endDateFormatted,
    };
    onChange(updatedFilters);
  }, [selectedAgents, selectedCampaigns, dateRange, onChange]);

  const handleApply = (agents: string[], campaigns: string[]) => {
    setSelectedAgents(agents);
    setSelectedCampaigns(campaigns);
  };

  return (
    <div className="flex items-center gap-3 w-full justify-end">
      <DateFilter
        dateRange={dateRange}
        setDateRange={setDateRange}
        align="right"
      />
      <AgentCampaignFilter
        agentOptions={agentOptions}
        campaignOptions={campaignOptions}
        selectedAgents={selectedAgents}
        selectedCampaigns={selectedCampaigns}
        onApply={handleApply}
      />
    </div>
  );
};

export default Filters;

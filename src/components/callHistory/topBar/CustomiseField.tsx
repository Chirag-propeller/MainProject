import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Reuse or define here if not imported
const SELECT_FIELDS = {
  callOverview: {
    title: "Call Overview",
    fields: {
      started_at: "Date & Time",
      id: "Call ID",
      agent: "Agent",
      from_phonenumber: "From Phone Number",
      phonenumber: "To Phone Number",
      average_latency: "Average Latency",
      llm: "LLM",
      stt: "STT",
      tts: "TTS",
      call_duration: "Call Duration",
      status: "Call Status",
      call_direction: "Direction",
      total_followup_count: "Total Followup Count",
      llm_cost: "LLM Cost",
      stt_cost: "STT Cost",
      tts_cost: "TTS Cost",
      reviewer_comments: "Summary",
    },
  },
  agentPerformance: {
    title: "Agent Performance",
    fields: {
      call_quality_score: "Call Quality Score",
      script_adherence_score: "Script Adherence Score",
      interruption_count: "Interruption Count",
      violations: "Violations",
      call_disposition: "Call Disposition",
      goal_completion_status: "Goal Completion",
      sentiment: "Sentiment",
      nlp_error_rate: "NLP Error Rate",
      intent_success_rate: "Intent Success Rate",
      escalation_flag: "Escalation Flag",
    },
  },
  compliance: {
    title: "Compliance",
    fields: {
      compliance_risk_score: "Compliance Risk Score",
      keyword_alert_count: "Keyword Alert Count",
      pci_dss_sensitive_data_detected: "PCI DSS Sensitive Data Detected",
      gdpr_data_request: "GDPR Data Request",
    },
  },
  transcript: {
    title: "Transcript",
    fields: {
      transcript: "Full Conversation",
    },
  },
};

const CustomiseField = ({
  customiseField,
  setCustomiseField,
}: {
  customiseField: string[];
  setCustomiseField: (field: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedFields, setCheckedFields] = useState<string[]>(customiseField);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() =>
    Object.keys(SELECT_FIELDS).reduce(
      (acc, key) => {
        acc[key] = false; // initially collapsed
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCheckedFields(customiseField);
  }, [customiseField]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const toggleField = (field: string) => {
    setCheckedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const selectAllSection = (sectionKey: keyof typeof SELECT_FIELDS) => {
    const section = SELECT_FIELDS[sectionKey];
    const newFields = Object.keys(section.fields);
    setCheckedFields((prev) => Array.from(new Set([...prev, ...newFields])));
  };

  const clearAllSection = (sectionKey: keyof typeof SELECT_FIELDS) => {
    const section = SELECT_FIELDS[sectionKey];
    setCheckedFields((prev) =>
      prev.filter((field) => !Object.keys(section.fields).includes(field))
    );
  };

  const applyHandler = async () => {
    setCustomiseField(checkedFields);
    await fetch("/api/user/post", {
      method: "POST",
      body: JSON.stringify({ callHistoryFields: checkedFields }),
    });
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className={`min-w-[150px] flex items-center justify-between px-3 py-2 rounded-[6px] text-sm font-medium transition-colors ${
          isOpen
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
            : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-500"
        }`}
      >
        Custom Fields <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-72 rounded-[4px] border border-gray-200 bg-white shadow-xl max-h-72 overflow-y-auto animate-fadeIn dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
          <h4 className="text-sm text-gray-700 border-b dark:text-gray-400 border-gray-200 dark:border-gray-700 pb-1 p-2">
            Custom Fields
          </h4>
          {Object.entries(SELECT_FIELDS).map(([sectionKey, section]) => (
            <div key={sectionKey} className="mb-2 pt-1 px-2">
              <div className="flex justify-between items-center mb-1">
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="flex items-center gap-1 text-gray-800 dark:text-gray-400 text-xs font-medium hover:text-indigo-600"
                >
                  {expandedSections[sectionKey] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  {section.title}
                </button>
              </div>
              {expandedSections[sectionKey] && (
                <div className="pl-3 flex flex-col gap-1">
                  {Object.entries(section.fields).map(([fieldKey, label]) => (
                    <label
                      key={fieldKey}
                      className="text-xs flex items-center gap-2 hover:bg-gray-50 rounded px-1 py-0.5 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checkedFields.includes(fieldKey)}
                        onChange={() => toggleField(fieldKey)}
                        className="rounded"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="sticky -bottom-0.5 bg-white pt-2 pb-2 px-2 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <Button
              variant="default"
              size="sm"
              onClick={applyHandler}
              className="rounded-[4px] bg-indigo-600 text-white hover:bg-indigo-700 px-3 text-sm"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomiseField;

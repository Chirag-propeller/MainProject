import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FilterState } from "./Filter";
import { DateRangeFilter } from "./DateFilter";
import axios from "axios";
import { X, ChevronDown, ChevronRight, Loader2 } from "lucide-react";

const EXPORT_FIELDS = {
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
  dataFields: {
    title: "Data Fields",
    fields: {},
  },
  trackingSetup: {
    title: "Goal Tracking",
    fields: {},
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

interface ExportProps {
  filters: FilterState;
  dateRange: DateRangeFilter;
  campaignId?: string;
}

const Export: React.FC<ExportProps> = ({ filters, dateRange, campaignId }) => {
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    callOverview: false,
    agentPerformance: false,
    dataFields: false,
    trackingSetup: false,
    compliance: false,
    transcript: false,
  });
  const [dynamicDataFields, setDynamicDataFields] = useState<string[]>([]);
  const [dynamicTrackingFields, setDynamicTrackingFields] = useState<string[]>([]);

  // Initialize with all fields selected
  const initializeSelectedFields = () => {
    const allFields: Record<string, boolean> = {};
    Object.values(EXPORT_FIELDS).forEach((section) => {
      Object.keys(section.fields).forEach((field) => {
        allFields[field] = true;
      });
    });
    return allFields;
  };

  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    initializeSelectedFields()
  );

  const toggleSection = (sectionKey: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const selectAllSection = (sectionKey: string) => {
    const section = EXPORT_FIELDS[sectionKey as keyof typeof EXPORT_FIELDS];
    const updates: Record<string, boolean> = {};
    Object.keys(section.fields).forEach((field) => {
      updates[field] = true;
    });
    if (sectionKey === "dataFields") {
      dynamicDataFields.forEach((k) => (updates[`dataFields.${k}`] = true));
    } else if (sectionKey === "trackingSetup") {
      dynamicTrackingFields.forEach((k) => (updates[`trackingSetup.${k}`] = true));
    }
    setSelectedFields((prev) => ({ ...prev, ...updates }));
  };

  const selectNoneSection = (sectionKey: string) => {
    const section = EXPORT_FIELDS[sectionKey as keyof typeof EXPORT_FIELDS];
    const updates: Record<string, boolean> = {};
    Object.keys(section.fields).forEach((field) => {
      updates[field] = false;
    });
    if (sectionKey === "dataFields") {
      dynamicDataFields.forEach((k) => (updates[`dataFields.${k}`] = false));
    } else if (sectionKey === "trackingSetup") {
      dynamicTrackingFields.forEach((k) => (updates[`trackingSetup.${k}`] = false));
    }
    setSelectedFields((prev) => ({ ...prev, ...updates }));
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      const selectedFieldsList = Object.keys(selectedFields).filter(
        (field) => selectedFields[field]
      );

      const response = await axios.post(
        "/api/callHistory/download",
        {
          filters,
          dateRange,
          selectedFields: selectedFieldsList,
          campaignId,
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "call_history.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setShowModal(false);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setExportError("Failed to export CSV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const openModal = () => {
    setSelectedFields(initializeSelectedFields());
    setExportError(null);
    setIsExporting(false);
    setShowModal(true);
    // fetch dynamic keys for dataFields/trackingSetup for current context
    void (async () => {
      try {
        const res = await axios.post(`/api/callHistory/callHistory?page=1&limit=1`, {
          filters,
          dateRange,
          campaignId,
        });
        const first = res.data?.data?.find((x: any) => x?.call_analysis) || res.data?.data?.[0];
        const dataFieldsRaw = first?.dataFields || first?.call_analysis?.dataFields || null;
        const trackingRaw = first?.trackingSetup || first?.trackingsetup || null;
        const normalize = (val: any): Record<string, any> => {
          if (!val) return {};
          if (Array.isArray(val)) {
            const obj: Record<string, any> = {};
            val.forEach((item: any, idx: number) => {
              const k = item?.fieldName || item?.key || `field_${idx + 1}`;
              obj[k] = item?.value ?? item?.description ?? "";
            });
            return obj;
          }
          if (typeof val === "object") return val as Record<string, any>;
          return {};
        };
        setDynamicDataFields(Object.keys(normalize(dataFieldsRaw)));
        setDynamicTrackingFields(Object.keys(normalize(trackingRaw)));
      } catch {
        setDynamicDataFields([]);
        setDynamicTrackingFields([]);
      }
    })();
  };

  return (
    <>
      <div className="">
        <Button
          variant="default"
          size="sm"
          className="rounded-[6px] text-xs px-4 py-2 hover:shadow-md"
          onClick={openModal}
        >
          Export CSV
        </Button>
      </div>

      {/* Export Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/70" onClick={() => setShowModal(false)} />
          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-900 dark:text-white rounded-[6px] shadow-xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Export Options
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 py-4 overflow-y-auto">
              {Object.entries(EXPORT_FIELDS).map(([sectionKey, section]) => (
                <div key={sectionKey} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() =>
                        toggleSection(
                          sectionKey as keyof typeof expandedSections
                        )
                      }
                      className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      {expandedSections[
                        sectionKey as keyof typeof expandedSections
                      ] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      {section.title}
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => selectAllSection(sectionKey)}
                        className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => selectNoneSection(sectionKey)}
                        className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {expandedSections[
                    sectionKey as keyof typeof expandedSections
                  ] && (
                    <div className="grid grid-cols-1 gap-2 pl-6">
                      {Object.entries(section.fields).map(([field, label]) => (
                        <label
                          key={field}
                          className="flex items-center gap-2 text-sm cursor-pointer py-1"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFields[field] || false}
                            onChange={() => toggleField(field)}
                            className="rounded"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            {label}
                          </span>
                        </label>
                      ))}
                      {sectionKey === "dataFields" && dynamicDataFields.map((k) => {
                        const fk = `dataFields.${k}`;
                        return (
                          <label key={fk} className="flex items-center gap-2 text-sm cursor-pointer py-1">
                            <input
                              type="checkbox"
                              checked={selectedFields[fk] || false}
                              onChange={() => toggleField(fk)}
                              className="rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{k}</span>
                          </label>
                        );
                      })}
                      {sectionKey === "trackingSetup" && dynamicTrackingFields.map((k) => {
                        const fk = `trackingSetup.${k}`;
                        return (
                          <label key={fk} className="flex items-center gap-2 text-sm cursor-pointer py-1">
                            <input
                              type="checkbox"
                              checked={selectedFields[fk] || false}
                              onChange={() => toggleField(fk)}
                              className="rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{k}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {exportError && (
              <div className="pt-2 pb-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{exportError}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={isExporting}
              >
                {isExporting ? "Close" : "Cancel"}
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={
                  Object.values(selectedFields).every((val) => !val) ||
                  isExporting
                }
              >
                {isExporting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isExporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Export;

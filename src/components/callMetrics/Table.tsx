// app/components/CallAnalysisTable.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import CallAnalysisCell from "./Cell";
import { CALL_ANALYSIS_FIELD_LABELS } from "@/lib/callAnalysisFieldMap";
import { format, parse } from "date-fns";
import SideBarCell from "./SideBarCell";
import { X, HelpCircle } from "lucide-react";
import TranscriptBox from "../callHistory/Transcript";
import axios from "axios";
import { FilterState } from "../callHistory/topBar/Filter";
import { Agent } from "../agents/types";
import { DateRangeFilter } from "../callHistory/topBar/DateFilter";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaPauseCircle, FaSpinner } from "react-icons/fa";
// import AudioPlayer from "react-h5-audio-player";
// import "react-h5-audio-player/lib/styles.css";

// Tooltip component for score field explanations
const ScoreTooltip = ({ field }: { field: string }) => {
  const getTooltipContent = (field: string) => {
    switch (field) {
      case "call_quality_score":
        return "Based on audio clarity, conversation flow, and overall call experience. Score 7-10: Good, 5-6: Average, 1-4: Bad";
      case "script_adherence_score":
        return "Measures how well the agent followed the predefined script and conversation guidelines. Score 7-10: Good, 5-6: Average, 1-4: Bad";
      case "compliance_risk_score":
        return "Assesses potential compliance violations and regulatory risks. Score 5-10: High Risk, 3-4: Medium Risk, 1-2: Low Risk";
      default:
        return "";
    }
  };

  return (
    // <div className="relative group">
    //   <span className="text-gray-400 cursor-pointer">
    //     <HelpCircle className="w-3 h-3" />
    //   </span>
    //   <div className="absolute hidden z-9999 group-hover:block bg-gray-50 text-black border border-gray-200 shadow-sm text-xs rounded py-1 px-2 top-0 transform mb-2 w-[150px] max-w-[150px] text-wrap">
    //     {getTooltipContent(field)}
    //   </div>
    // </div>
    <div className="relative group">
      <span className="text-gray-700 cursor-pointer">
        <HelpCircle className="w-3 h-3" />
      </span>

      {/* Tooltip content */}
      <div className="absolute hidden group-hover:block bg-gray-50 text-black border border-gray-200 shadow-md text-[9px] rounded py-1 px-2 w-[180px] z-50 top-full mt-2 right-0 max-w-[130px] text-wrap">
        {getTooltipContent(field)}
      </div>
    </div>
  );
};

// Custom Audio Player
function CustomAudioPlayer({
  src,
  callId,
}: {
  src: string | null;
  callId: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sasUrl, setSasUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSasUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, [src, callId]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [sasUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!sasUrl && src) {
        setLoading(true);
        setError(null);
        try {
          const res = await axios.post(`/api/callHistory/get-recording`, {
            url: src,
          });
          const data = res.data;
          if (data.url) {
            setSasUrl(data.url);
            setTimeout(() => {
              audioRef.current?.play();
              setIsPlaying(true);
            }, 100);
          } else {
            setError("Recording not available");
          }
        } catch {
          setError("Failed to load recording");
        } finally {
          setLoading(false);
        }
      } else if (sasUrl) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = Math.max(0, Math.min(percent, 1)) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Dragging logic
  const handleThumbMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!audioRef.current || !progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const seekTime = Math.max(0, Math.min(percent, 1)) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${sec}`;
  };

  // Download function that opens the file URL in a new tab
  const handleDownload = () => {
    if (!sasUrl) {
      console.log('No sasUrl available');
      return;
    }
    
    console.log('Opening download URL in new tab:', sasUrl);
    setDownloading(true);
    
    try {
      // Open the SAS URL in a new tab - user can then download manually
      window.open(sasUrl, '_blank', 'noopener,noreferrer');
      console.log('Opened download URL in new tab');
    } catch (error: any) {
      console.error('Failed to open download URL:', error);
      setError(`Failed to open download URL: ${error?.message || 'Unknown error'}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center gap-3 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-1 shadow w-full max-w-[360px]">
        {loading ? (
          <span className="text-xs text-gray-500 animate-spin">
            <FaSpinner className="w-5 h-5" />
          </span>
        ) : !sasUrl ? (
          <button
            onClick={togglePlay}
            className="p-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            disabled={loading || !!error || !src}
          >
            <FaRegCirclePlay className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        ) : isPlaying ? (
          <button
            onClick={togglePlay}
            className="p-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
          >
            <FaPauseCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        ) : (
          <button
            onClick={togglePlay}
            className="p-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
          >
            <FaRegCirclePlay className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        )}
        <span className="text-xs text-gray-700 dark:text-gray-200 min-w-[60px] text-center">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="flex-1 flex items-center min-w-[120px]">
          <div
            ref={progressBarRef}
            className="h-2 w-full bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer relative"
            onClick={handleSeek}
            style={{ minWidth: 100, minHeight: 10 }}
          >
            <div
              className="h-2 bg-indigo-500 rounded-full absolute top-0 left-0"
              style={{
                width: duration ? `${(currentTime / duration) * 100}%` : "0%",
                transition: "width 0.2s linear",
              }}
            ></div>
            {/* Dragger/Thumb */}
            {duration > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: duration
                    ? `calc(${(currentTime / duration) * 100}% - 8px)`
                    : "-8px",
                  zIndex: 2,
                  cursor: "pointer",
                }}
                onMouseDown={handleThumbMouseDown}
                tabIndex={0}
                role="slider"
                aria-valuenow={currentTime}
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-label="Seek"
              >
                <div className="w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow transition-colors"></div>
              </div>
            )}
          </div>
        </div>
        <button
          title="Download Recording"
          onClick={handleDownload}
          disabled={!sasUrl || downloading}
          className={`flex items-center justify-center px-2 py-1 text-xs transition-colors ${
            !sasUrl || downloading 
              ? "text-gray-400 cursor-not-allowed opacity-50" 
              : "text-green-600 hover:text-green-700"
          }`}
        >
          {downloading ? (
            <FaSpinner className="w-4 h-4 animate-spin" />
          ) : (
            <MdOutlineFileDownload className="w-4 h-4" />
          )}
        </button>
      </div>
      <audio
        ref={audioRef}
        src={sasUrl || undefined}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ width: 20, height: 5, opacity: 100 }}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}

export default function CallAnalysisTable({
  customiseField,
  filters,
  agentOptions,
  dateRange,
  page,
  setTotalPages,
  limit,
  setHasNextPage,
  setHasPreviousPage,
  campaignId,
  embedded = false,
  fluid = false,
}: {
  customiseField: string[];
  filters: FilterState;
  agentOptions: Agent[];
  dateRange: DateRangeFilter;
  page: number;
  limit: number;
  setHasNextPage: (hasNextPage: boolean) => void;
  setHasPreviousPage: (hasPreviousPage: boolean) => void;
  setTotalPages: (totalPages: number) => void;
  campaignId?: string;
  embedded?: boolean;
  fluid?: boolean;
}) {
  const [callData, setCallData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<any | null>(null);

  // ... existing code ...

  // Fetch SAS url when selectedCall changes

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top when selectedCall changes
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [selectedCall]);

  function formatDateTime(dateStr: string): string {
    const parsed = parse(dateStr, "yyyy-MM-dd HH:mm", new Date());
    return format(parsed, "hh:mm a - dd MMM, yyyy");
  }

  function parseApiDate(dateStr: string): Date {
    return parse(dateStr, "yyyy-MM-dd HH:mm", new Date());
  }

  function getScore(score: number) {
    if (typeof score !== "number") return "N/A";
    if (score >= 7) return "Good";
    if (score >= 4) return "Normal";
    return "Bad";
  }

  // Normalize API values that might be arrays or plain objects to an array of { key, value }
  function normalizeToArray(value: any): Array<{ key: string; value: any }> | null {
    if (!value) return null;
    if (Array.isArray(value)) return value;
    if (typeof value === "object") {
      try {
        return Object.entries(value).map(([key, val]) => ({ key, value: val }));
      } catch {
        return null;
      }
    }
    return null;
  }

  const isDynamicField = (key: string) => key.startsWith("dataFields.") || key.startsWith("trackingSetup.");
  const getDynamicKey = (key: string) => key.split(".").slice(1).join(".");

  useEffect(() => {
    const fetchData = async () => {
      // router.push(`/callHistory?page=${1}&limit=${10}`);
      const data = await axios.post(
        `/api/callHistory/callHistory?page=${page}&limit=${limit}`,
        {
          filters: filters,
          dateRange: dateRange,
          campaignId: campaignId,
        }
      );

      const pagination = data.data.pagination;
      setHasNextPage(pagination.hasNextPage);
      setHasPreviousPage(pagination.hasPreviousPage);
      setTotalPages(Math.ceil(pagination.totalRecords / limit));
      // console.log(
      //   "DEBUG: totalRecords =",
      //   pagination.totalRecords,
      //   "limit =",
      //   limit
      // );

      let mappedData = data.data.data
        .filter((item: any) => item.call_analysis)
        .map((item: any) => {
          const callAnalysis = item.call_analysis || {};
          const metadata = item.metadata || {};
          const parsedDate = parseApiDate(item.started_at);
          const agent_config = item.agent_config || {};
          const agent = agent_config;
          const llm = agent?.llm ? `${agent?.llm} (${agent?.llmModel})` : "N/A";
          const stt = agent?.stt ? `${agent?.stt} ` : "N/A";
          const tts = agent?.tts ? `${agent?.tts} (${agent?.ttsModel})` : "N/A";
          let call_duration = "-";
          if (item.call_duration_in_sec) {
            const minutes = Math.floor(item.call_duration_in_sec / 60);
            const seconds = item.call_duration_in_sec % 60;
            if (minutes > 0) {
              call_duration = `${minutes}m ${seconds.toFixed(0)}s`;
            } else {
              call_duration = `${seconds.toFixed(0)}s`;
            }
          }

          const normalizedDataFields = normalizeToArray(item?.dataFields || item?.call_analysis?.dataFields || null);
          const normalizedTrackingSetup = normalizeToArray(item?.trackingSetup || item?.trackingsetup || null);

          return {
            // Root-level
            id: item._id,
            rawDate: parsedDate, // Store the raw date for filtering
            started_at: formatDateTime(item.started_at),
            phonenumber: item.phonenumber,
            room_name: item.room_name,
            user_id: item.user_id,

            // Metadata
            agent: agent.agentName,
            llm: llm,
            stt: stt,
            tts: tts,
            fromPhone: metadata.fromPhone,
            numberoffollowup: metadata.numberoffollowup,
            total_followup_count: metadata.total_followup_count,
            average_latency: item.avg_total_latency,

            // Call Analysis
            status: callAnalysis.STATUS,
            language: callAnalysis.LANGUAGE,
            call_quality_score: callAnalysis.CALL_QUALITY_SCORE,
            sentiment: callAnalysis.SENTIMENT,
            script_adherence_score: callAnalysis.SCRIPT_ADHERENCE_SCORE,
            call_disposition: callAnalysis.CALL_DISPOSITION,
            call_transfer: callAnalysis.CALL_TRANSFER,
            escalation_flag: callAnalysis.ESCALATION_FLAG,
            ai_confidence_score: callAnalysis.AI_CONFIDENCE_SCORE,
            nlp_error_rate: callAnalysis.NLP_ERROR_RATE,
            intent_detected: callAnalysis.INTENT_DETECTED,
            intent_success_rate: callAnalysis.INTENT_SUCCESS_RATE,
            average_intent_turn: callAnalysis.AVERAGE_INTENT_TURN,
            lead_score: callAnalysis.LEAD_SCORE,
            conversion_flag: callAnalysis.CONVERSION_FLAG,
            upsell_flag: callAnalysis.UPSELL_FLAG,
            cross_sell_flag: callAnalysis.CROSS_SELL_FLAG,
            survey_score: callAnalysis.SURVEY_SCORE,
            compliance_risk_score: callAnalysis.COMPLIANCE_RISK_SCORE,
            keyword_alert_count: callAnalysis.KEYWORD_ALERT_COUNT,
            pci_dss_sensitive_data_detected:
            callAnalysis.PCI_DSS_SENSITIVE_DATA_DETECTED,
            gdpr_data_request: callAnalysis.GDPR_DATA_REQUEST,
            customer_engagement_score: callAnalysis.CUSTOMER_ENGAGEMENT_SCORE,
            interruption_count: callAnalysis.INTERRUPTION_COUNT,
            reviewer_comments: callAnalysis.REVIEWER_COMMENTS,
            violations: Array.isArray(callAnalysis.VIOLATIONS)
              ? callAnalysis.VIOLATIONS.length
              : (typeof callAnalysis.VIOLATIONS === 'number' ? callAnalysis.VIOLATIONS : 0),
            cost: item.cost,
            call_direction: item.call_direction,
            call_duration: call_duration,
            call_type: item.call_type,
            recording: item.recording_url,
            // recording: "https://storage4mongodbdatabase.blob.core.windows.net/recordings/room-2e5dc428-a5fc-45c0-adb7-4b3328eda4fa.mp3",
            transcript: item.call_transcript,
            llm_cost: Number(item.llm_cost_rupees?.$numberDecimal).toFixed(2),
            stt_cost: Number(item.stt_cost_rupees?.$numberDecimal).toFixed(2),
            tts_cost: Number(item.tts_cost_rupees?.$numberDecimal).toFixed(2),
            // Normalized captured structures (array of { key, value } or array of structured items)
            dataFields: normalizedDataFields,
            trackingSetup: normalizedTrackingSetup,
          };
        });
      setCallData(mappedData);
      setLoading(false);
    };
    fetchData();
  }, [filters, agentOptions, dateRange, page, limit, campaignId]);

  const handleRowClick = (call: any) => {
    setSelectedCall(call);
  };

  const getComplianceRiskScoreLabel = (score: number): string => {
    if (score >= 5) return "High";
    if (score == 3 || score == 4) return "Medium";
    return "Low";
  };

  return (
    <div className={`${fluid ? "w-full" : embedded ? "w-full max-w-[900px] mx-auto" : "w-full max-w-[80vw]"} overflow-hidden relative`}>
    {/* <div className="w-full overflow-hidden relative"> */}
      {loading ? (
        <>
          {/* Skeleton Table */}
          <div className="overflow-x-auto overflow-y-auto max-h-[80vh] shadow-md rounded-[4px] border border-gray-200 scrollbar scrollbar-thin scrollbar-black hover:scrollbar-black dark:bg-gray-900 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:bg-gray-900 dark:text-gray-100">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                <tr>
                  <th className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 tracking-wider">
                    S.No
                  </th>
                  {customiseField.map((key) => (
                    <th
                      key={key}
                      className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 px-6 py-2 text-xs font-medium text-gray-500 tracking-wider text-nowrap text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>
                          {CALL_ANALYSIS_FIELD_LABELS[key] ||
                            key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                        {(key === "call_quality_score" ||
                          key === "script_adherence_score" ||
                          key === "compliance_risk_score") && (
                          <ScoreTooltip field={key} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y text-sm divide-gray-100 dark:bg-gray-900 dark:divide-gray-700">
                {/* Skeleton Rows */}
                {Array.from({ length: 7 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                    </td>
                    {customiseField.map((key, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-2 whitespace-nowrap text-center"
                      >
                        <div
                          className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto"
                          style={{
                            width:
                              key === "started_at"
                                ? "120px"
                                : key === "phonenumber"
                                  ? "100px"
                                  : key === "agent"
                                    ? "80px"
                                    : key === "status"
                                      ? "70px"
                                      : key === "call_duration"
                                        ? "60px"
                                        : key === "download_transcript"
                                          ? "40px"
                                          : "80px",
                          }}
                        ></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Skeleton Pagination */}
          <div className="flex justify-center gap-2 py-4">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded self-center animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </>
      ) : (
        <>
          <div className={`overflow-x-auto overflow-y-auto max-h-[70vh] shadow-md rounded-[4px] border border-gray-200 custom-scrollbar dark:bg-gray-900 dark:border-gray-700 ${fluid ? "" : embedded ? "mx-auto max-w-[900px]" : ""}`}>
            <table className={`divide-y divide-gray-200 text-sm dark:bg-gray-900 dark:text-gray-100 ${fluid ? "min-w-full" : embedded ? "w-full" : "min-w-full"}`}>
              <thead className="bg-gray-50 sticky top-0 dark:bg-gray-900">
                <tr>
                  <th className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 tracking-wider">
                    S.No
                  </th>
                  {customiseField.map((key) => (
                    <th
                      key={key}
                      className="top-0 bg-gray-50  dark:bg-gray-900 z-10 px-6 py-2 text-xs font-medium text-gray-500  dark:text-gray-200  tracking-wider text-nowrap text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>
                          {CALL_ANALYSIS_FIELD_LABELS[key] ||
                            key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                        {(key === "call_quality_score" ||
                          key === "script_adherence_score" ||
                          key === "compliance_risk_score") && (
                          <ScoreTooltip field={key} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y text-sm divide-gray-100 dark:bg-gray-900 dark:divide-gray-700">
                {callData.map((call, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 cursor-pointer transition duration-150 dark:text-gray-200 z-20"
                    onClick={() => handleRowClick(call)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-100 font-medium text-nowrap dark:bg-gray-900">
                      {(page - 1) * limit + index + 1}
                    </td>
                    {customiseField.map((key) => {
                      if (isDynamicField(key)) {
                        const group = key.startsWith("dataFields.") ? call.dataFields : call.trackingSetup;
                        const dynKey = getDynamicKey(key);
                        let val: any = "-";
                        if (Array.isArray(group)) {
                          const found = group.find((g: any) => (g.fieldName || g.key) === dynKey);
                          val = found ? (found.value ?? found.description ?? "-") : "-";
                        }
                        return (
                          <CallAnalysisCell
                            key={key}
                            value={val}
                            field={key}
                            callId={call?.id}
                          />
                        );
                      }
                      return (
                        <CallAnalysisCell
                          key={key}
                          value={call?.[key]}
                          field={key}
                          callId={call?.id}
                        />
                      );
                    })}
                  </tr>
                ))}
                {callData.length === 0 && (
                  <tr>
                    <td
                      colSpan={customiseField.length + 1}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No call analysis data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedCall && (
            <div
              ref={containerRef}
              className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-900 shadow-lg border-l border-gray-200 dark:border-gray-700 z-150 overflow-y-auto custom-scrollbar ${fluid ? "w-1/2" : embedded ? "w-[48%]" : "w-[54%]"}`}
            >
              <div className="px-2 p-1 flex justify-between items-center border-b border-gray-200 dark:border-gray-400 sticky top-0 bg-white dark:bg-gray-900">
                {/* Left: Date/Time and Call ID */}
                <div>
                  <h2 className="text-md font-semibold dark:text-gray-400">
                    {selectedCall.started_at}
                  </h2>
                  <h2 className="text-xs text-gray-600 dark:text-gray-400">
                    Call ID: {selectedCall.id}
                  </h2>
                </div>
                {/* Right: Play, Download, X */}
                <div className="flex items-center gap-2">
                  {selectedCall.recording && (
                    <>
                      {/* Custom Audio Player with Download */}
                      <CustomAudioPlayer
                        src={selectedCall.recording}
                        callId={selectedCall.id}
                      />
                    </>
                  )}
                  {/* X Button */}
                  <button
                    onClick={() => setSelectedCall(null)}
                    className="text-gray-500 hover:text-gray-400 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="">
                <h1 className="text-sm font-semibold bg-indigo-100 dark:bg-gray-400 p-4 py-1 shadow-sm">
                  {" "}
                  Call Overview
                </h1>
                <div className="py-2">
                  <div className="flex justify-between">
                    <div className="p-4 py-0 w-1/2 flex flex-col gap-1">
                      <SideBarCell
                        title="Agent"
                        value={selectedCall.agent ?? "N/A"}
                      />
                      <SideBarCell
                        title="From Phone Number"
                        value={selectedCall.phonenumber ?? "N/A"}
                      />
                      <SideBarCell
                        title="To Phone Number"
                        value={selectedCall.phonenumber ?? "N/A"}
                      />
                      <SideBarCell
                        title="Average Latency"
                        value={
                          selectedCall.average_latency
                            ? `${selectedCall.average_latency.toFixed(2)} s`
                            : "N/A"
                        }
                      />
                      <SideBarCell title="LLM" value={selectedCall.llm} />
                      <SideBarCell
                        title="STT"
                        value={selectedCall.stt ?? "N/A"}
                      />
                      <SideBarCell
                        title="TTS"
                        value={selectedCall.tts ?? "N/A"}
                      />
                    </div>
                    <div className="p-4 py-0 w-1/2 flex flex-col gap-1">
                      <SideBarCell
                        title="Call Duration"
                        value={selectedCall.call_duration ?? "N/A"}
                      />
                      <SideBarCell
                        title="Call Status"
                        value={selectedCall.status ?? "N/A"}
                      />
                      <SideBarCell
                        title="Direction"
                        value={selectedCall.call_direction ?? "N/A"}
                      />
                      <SideBarCell
                        title="Total Followup Count"
                        value={selectedCall.total_followup_count ?? "N/A"}
                      />
                      <SideBarCell
                        title="LLM Cost"
                        value={selectedCall.llm_cost ?? "N/A"}
                      />
                      <SideBarCell
                        title="STT Cost"
                        value={selectedCall.stt_cost ?? "N/A"}
                      />
                      <SideBarCell
                        title="TTS Cost"
                        value={selectedCall.tts_cost ?? "N/A"}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between p-4 py-1">
                    {
                      <SideBarCell
                        title="Summary"
                        value={selectedCall.reviewer_comments ?? "N/A"}
                      />
                    }
                  </div>
                </div>
              </div>

              {/* <div className="">
                <h1 className="text-xs  p-4 py-1 "> Call Recording</h1>
              </div> */}

              <div className="">
                <h1 className="text-sm font-semibold bg-indigo-100 dark:bg-gray-400 p-4 py-1 shadow-sm">
                  Agent Performance
                </h1>
                <div className="flex justify-between">
                  <div className="p-4 py-2 w-1/2 flex flex-col gap-1">
                    <SideBarCell
                      title="Call Quality Score"
                      value={
                        selectedCall.call_quality_score != null
                          ? `${getScore(selectedCall.call_quality_score)} (${selectedCall.call_quality_score})`
                          : "N/A"
                      }
                    />
                    <SideBarCell
                      title="Script Adherence Score"
                      value={
                        selectedCall.script_adherence_score != null
                          ? `${getScore(selectedCall.script_adherence_score)} (${selectedCall.script_adherence_score})`
                          : "N/A"
                      }
                    />
                    <SideBarCell
                      title="AI Confidence Score"
                      value={
                        selectedCall.ai_confidence_score != null
                          ? `${getScore(selectedCall.ai_confidence_score)} (${selectedCall.ai_confidence_score})`
                          : "N/A"
                      }
                    />
                    <SideBarCell
                      title="Interruption Count"
                      value={selectedCall.interruption_count ?? "N/A"}
                    />
                    <SideBarCell
                      title="Violations"
                      value={selectedCall.violations ?? "N/A"}
                    />
                    <SideBarCell
                      title="Call Disposition"
                      value={selectedCall.call_disposition ?? "N/A"}
                    />
                  </div>
                  <div className="p-4 py-2 w-1/2 flex flex-col gap-1">
                    <SideBarCell
                      title="Goal Completion"
                      value={selectedCall.goal_completion ?? "N/A"}
                    />
                    <SideBarCell
                      title="Sentiment"
                      value={selectedCall.sentiment ?? "N/A"}
                    />
                    <SideBarCell
                      title="NLP Error Rate"
                      value={selectedCall.nlp_error_rate ?? "N/A"}
                    />
                    <SideBarCell
                      title="Intent Success Rate"
                      value={selectedCall.intent_success_rate ?? "N/A"}
                    />
                    <SideBarCell
                      title="Escalation Flag"
                      value={selectedCall.escalation_flag ?? "N/A"}
                    />
                  </div>
                </div>
              </div>

              {/* <div className="">
                <h1 className="text-sm font-semibold bg-indigo-100 dark:bg-gray-400 p-4 py-1 shadow-sm">
                  Compliance
                </h1>
                <div className="flex justify-between">
                  <div className="p-4 py-2 w-1/2 flex flex-col gap-1">
                    <SideBarCell
                      title="Compliance Risk Score"
                      value={
                        selectedCall.compliance_risk_score != null
                          ? `${getComplianceRiskScoreLabel(selectedCall.compliance_risk_score)} (${selectedCall.compliance_risk_score})`
                          : "N/A"
                      }
                    />
                    <SideBarCell
                      title="Keyword Alert Count"
                      value={selectedCall.keyword_alert_count ?? "N/A"}
                    />
                  </div>
                  <div className="p-4 py-2 w-1/2 flex flex-col gap-1">
                    <SideBarCell
                      title="PCI DSS Sensitive Data Detected"
                      value={
                        selectedCall.pci_dss_sensitive_data_detected ?? "N/A"
                      }
                    />
                    <SideBarCell
                      title="GDPR Data Request"
                      value={selectedCall.gdpr_data_request ?? "N/A"}
                    />
                  </div>
                </div>
              </div> */}
              {/* Data Fields (Captured key-value from call) */}
              {selectedCall.dataFields && Array.isArray(selectedCall.dataFields) && selectedCall.dataFields.length > 0 && (
                <div className="">
                  <h1 className="text-sm font-semibold bg-indigo-100 dark:bg-gray-400 p-4 py-1 shadow-sm">Data Fields</h1>
                  <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                    {(selectedCall.dataFields as any[]).map((df: any, idx: number) => {
                      const keyLabel = df.fieldName || df.key;
                      const val = df.value ?? df.description ?? '-';
                      return <SideBarCell key={`df-${idx}`} title={keyLabel} value={String(val)} />;
                    })}
                  </div>
                </div>
              )}

              {/* Tracking Setup Results */}
              {selectedCall.trackingSetup && Array.isArray(selectedCall.trackingSetup) && selectedCall.trackingSetup.length > 0 && (
                <div className="">
                  <h1 className="text-sm font-semibold bg-indigo-100 dark:bg-gray-400 p-4 py-1 shadow-sm">Goal Tracking</h1>
                  <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                    {(selectedCall.trackingSetup as any[]).map((tf: any, idx: number) => {
                      const keyLabel = tf.fieldName || tf.key;
                      const val = tf.value ?? tf.description ?? '-';
                      return <SideBarCell key={`ts-${idx}`} title={keyLabel} value={String(val)} />;
                    })}
                  </div>
                </div>
              )}


              <div className="">
                <h1 className="text-sm font-semibold bg-indigo-100 dark:bg-gray-400 p-4 py-1 shadow-sm">
                  Transcript
                </h1>
                <TranscriptBox transcript={selectedCall.transcript} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

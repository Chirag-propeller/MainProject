"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Campaign, Agent } from "../types";
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Users,
  Target,
  Calendar,
  Clock,
} from "lucide-react";
import TimezoneDropdown from "@/components/ui/TimezoneDropdown";
import RecipientsTab from "./RecipientsTab";
import {
  MdKeyboardArrowDown,
  MdOutlineDescription,
  MdPeopleAlt,
} from "react-icons/md";
import { LuGoal } from "react-icons/lu";
import { RiCalendarScheduleFill } from "react-icons/ri";
import SelectionDropdown from "../../agents/SelectionDropdown";

interface CampaignGeneralTabProps {
  campaign: Campaign;
  setCampaign: (campaign: Campaign) => void;
  agents: Agent[];
  isEditable: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  iconClassname?: string;
  description?: string;
}

type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
const weekdays: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  description,
  iconClassname,
}) => {
  return (
    <div className="border border-gray-200 rounded-[6px] bg-white hover:border-gray-300 mb-2 shadow-sm">
      <header
        className="cursor-pointer bg-white border-b-background px-2 py-1 rounded-[6px]"
        onClick={onToggle}
      >
        <div className="flex justify-between items-center m-3 rounded-[6px]">
          <div className="flex items-center gap-2 ">
            <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center">
              <Icon className={`w-6 h-6 ${iconClassname}`} />
            </div>
            <div className="ml-1.5 flex flex-col">
              <h3 className="text-[16px] text-gray-900 font-semibold ">
                {title}
              </h3>
              {description && (
                <h5 className="font-light text-gray-500 text-sm pt-1">
                  {description}
                </h5>
              )}
            </div>
          </div>
          <MdKeyboardArrowDown
            className={`w-8 h-8 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ fill: "gray" }}
          />
        </div>
      </header>
      {isOpen && (
        <>
          <hr className="border-t border-gray-200 my-0" />
          <div className="px-4 py-5 flex flex-col gap-6">{children}</div>
        </>
      )}
    </div>
  );
};

const CampaignGeneralTab: React.FC<CampaignGeneralTabProps> = ({
  campaign,
  setCampaign,
  agents,
  isEditable,
}) => {
  const [openSections, setOpenSections] = useState({
    details: false,
    recipients: false,
    goals: false,
    scheduling: false,
  });

  // Use refs to maintain focus
  const goalInputRef = useRef<HTMLTextAreaElement>(null);
  const dataTextareaRef = useRef<HTMLTextAreaElement>(null);
  const mandatoryAdherenceTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Add state for phone numbers
  const [fromNumberList, setFromNumberList] = useState<string[]>([]);

  // Scheduling states
  const [selectedDays, setSelectedDays] = useState<Weekday[]>(
    (campaign.slotDates as Weekday[]) || []
  );
  const [callTiming, setCallTiming] = useState<string>("fullDay");
  const [customStartTime, setCustomStartTime] = useState<string>("10:00");
  const [customEndTime, setCustomEndTime] = useState<string>("18:00");

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleInputChange = useCallback(
    (field: keyof Campaign, value: any) => {
      if (!isEditable) return;

      setCampaign({
        ...campaign,
        [field]: value,
      });
    },
    [campaign, setCampaign, isEditable]
  );

  // Specialized handlers to maintain cursor position
  const handleGoalChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPosition = e.target.selectionStart;

      handleInputChange("goal", value);

      // Restore cursor position after state update
      requestAnimationFrame(() => {
        if (goalInputRef.current) {
          goalInputRef.current.setSelectionRange(
            cursorPosition,
            cursorPosition
          );
        }
      });
    },
    [handleInputChange]
  );

  const handleDataCollectChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPosition = e.target.selectionStart;
      const dataArray = value.split("\n").filter((item) => item.trim());

      handleInputChange("dataToCollect", dataArray);

      // Restore cursor position after state update
      requestAnimationFrame(() => {
        if (dataTextareaRef.current) {
          dataTextareaRef.current.setSelectionRange(
            cursorPosition,
            cursorPosition
          );
        }
      });
    },
    [handleInputChange]
  );

  const handleMandatoryAdherenceChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPosition = e.target.selectionStart;

      handleInputChange("mandatoryAdherence", value);

      // Restore cursor position after state update
      requestAnimationFrame(() => {
        if (mandatoryAdherenceTextareaRef.current) {
          mandatoryAdherenceTextareaRef.current.setSelectionRange(
            cursorPosition,
            cursorPosition
          );
        }
      });
    },
    [handleInputChange]
  );

  // Day selection handler
  const handleDayToggle = (day: Weekday) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setSelectedDays(newDays);
    handleInputChange("slotDates", newDays);
  };

  // Call timing handler
  const handleCallTimingChange = (timing: string) => {
    setCallTiming(timing);
    let slotTime = timing;
    if (timing === "custom") {
      slotTime = `${customStartTime}-${customEndTime}`;
    }
    handleInputChange("slotTime", slotTime);
  };

  const agentName =
    agents.find((a) => a.agentId === campaign.agentId)?.agentName ||
    "No Agent Attached";

  // Fetch phone numbers from API
  const fetchNumbers = async () => {
    try {
      const res = await fetch("/api/phoneNumber/get");
      const data = await res.json();
      const numbers = data.map((item: any) => item.phoneNumber);
      setFromNumberList(numbers);
    } catch (err) {
      console.error("Failed to fetch phone numbers:", err);
    }
  };

  // Initialize data and fetch phone numbers
  useEffect(() => {
    fetchNumbers();

    if (campaign.slotTime) {
      // Parse existing slotTime
      if (
        campaign.slotTime === "fullDay" ||
        campaign.slotTime === "firstHalf" ||
        campaign.slotTime === "secondHalf"
      ) {
        setCallTiming(campaign.slotTime);
      } else if (campaign.slotTime.includes("-")) {
        setCallTiming("custom");
        const [start, end] = campaign.slotTime.split("-");
        setCustomStartTime(start);
        setCustomEndTime(end);
      }
    }
    if (campaign.slotDates) {
      setSelectedDays(campaign.slotDates as Weekday[]);
    }
  }, [campaign]);

  // Auto-set followUp to true if noOfFollowUps > 0
  useEffect(() => {
    if (
      campaign.noOfFollowUps &&
      parseInt(campaign.noOfFollowUps) > 0 &&
      campaign.followUp !== true
    ) {
      setCampaign({
        ...campaign,
        followUp: true,
      });
    }
  }, [campaign.noOfFollowUps, campaign.followUp, campaign, setCampaign]);

  return (
    <div className="p-4 bg-gray-50 h-full overflow-y-auto">
      <div className="flex flex-col gap-2">
        {/* Campaign Details Section */}
        <CollapsibleSection
          title="Campaign Details"
          icon={MdOutlineDescription}
          isOpen={openSections.details}
          description="Define the campaign name, type, and basic configuration"
          iconClassname="text-fuchsia-600"
          onToggle={() => toggleSection("details")}
        >
          <div className="space-y-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent
                </label>
                {isEditable ? (
                  <SelectionDropdown
                    options={[
                      { name: "Select an agent", value: "" },
                      ...agents.map((agent) => ({
                        name: agent.agentName,
                        value: agent.agentId,
                      })),
                    ]}
                    selectedOption={campaign.agentId || ""}
                    setOption={(value: any) =>
                      handleInputChange("agentId", value)
                    }
                  />
                ) : (
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm">
                    {agentName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Number
                </label>
                {isEditable ? (
                  <SelectionDropdown
                    options={[
                      { name: "Select a phone number", value: "" },
                      ...fromNumberList.map((number) => ({
                        name: number,
                        value: number,
                      })),
                    ]}
                    selectedOption={campaign.fromNumber || ""}
                    setOption={(value: any) =>
                      handleInputChange("fromNumber", value)
                    }
                  />
                ) : (
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm">
                    {campaign.fromNumber || "Not specified"}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="concurrentCalls"
                >
                  Max Concurrent Calls
                </label>
                {isEditable ? (
                  <input
                    type="number"
                    id="concurrentCalls"
                    name="concurrentCalls"
                    value={campaign.concurrentCalls || 0}
                    onChange={(e) =>
                      handleInputChange(
                        "concurrentCalls",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm">
                    {campaign.concurrentCalls || 0}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up
                </label>
                {isEditable ? (
                  <div className="flex items-center gap-4">
                    <div className="flex gap-4">
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          name="followUp"
                          value="false"
                          checked={(() => {
                            const hasFollowups =
                              campaign.noOfFollowUps &&
                              parseInt(campaign.noOfFollowUps) > 0;
                            return (
                              campaign.followUp === false ||
                              (!campaign.followUp && !hasFollowups)
                            );
                          })()}
                          onChange={(e) =>
                            handleInputChange(
                              "followUp",
                              e.target.value === "true"
                            )
                          }
                          className="mr-2 text-sm"
                        />
                        No
                      </label>
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          name="followUp"
                          value="true"
                          checked={(() => {
                            const hasFollowups =
                              campaign.noOfFollowUps &&
                              parseInt(campaign.noOfFollowUps) > 0;
                            return hasFollowups || campaign.followUp === true;
                          })()}
                          onChange={(e) =>
                            handleInputChange(
                              "followUp",
                              e.target.value === "true"
                            )
                          }
                          className="mr-2 text-sm"
                        />
                        Yes
                      </label>
                    </div>
                    {(campaign.followUp === true ||
                      (campaign.noOfFollowUps &&
                        parseInt(campaign.noOfFollowUps) > 0)) && (
                      <input
                        type="number"
                        value={campaign.noOfFollowUps || ""}
                        onChange={(e) =>
                          handleInputChange("noOfFollowUps", e.target.value)
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-[6px] text-sm"
                        placeholder="#"
                        min="1"
                        max="5"
                      />
                    )}
                  </div>
                ) : (
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm">
                    {campaign.followUp ? "Yes" : "No"}
                    {campaign.followUp === true && campaign.noOfFollowUps && (
                      <span className="ml-2">
                        ({campaign.noOfFollowUps} follow-ups)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Recipients Section */}
        <CollapsibleSection
          title="Recipients"
          icon={MdPeopleAlt}
          iconClassname="text-gray-700"
          isOpen={openSections.recipients}
          description="Manage and upload the list of users to contact"
          onToggle={() => toggleSection("recipients")}
        >
          <RecipientsTab
            campaign={campaign}
            setCampaign={setCampaign}
            isEditable={isEditable}
          />
        </CollapsibleSection>

        {/* Goals Section */}
        <CollapsibleSection
          title="Goals"
          icon={LuGoal}
          iconClassname="text-cyan-950"
          isOpen={openSections.goals}
          description="Set and track the success metrics for your campaign"
          onToggle={() => toggleSection("goals")}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">
                Campaign Goal{" "}
                <span className="italic text-gray-500 text-sm">
                  (Define what the AI voice agent should achieve in a single
                  sentence.)
                </span>
              </label>
              <div className="text-gray-500 text-xs mb-2">
                💡 Example: "Remind users to renew their subscription"
              </div>
              {isEditable ? (
                <textarea
                  ref={goalInputRef}
                  value={campaign.goal || ""}
                  onChange={handleGoalChange}
                  rows={2}
                  className="w-full px-3 pt-2 border border-gray-300 rounded-[6px] text-sm placeholder:text-gray-400"
                  placeholder="Describe the main objective of this campaign..."
                />
              ) : (
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm min-h-[60px]">
                  {campaign.goal || "No goal specified"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data to Collect
              </label>
              {isEditable ? (
                <textarea
                  ref={dataTextareaRef}
                  value={campaign.dataToCollect?.join("\n") || ""}
                  onChange={handleDataCollectChange}
                  rows={3}
                  className="w-full px-3 pt-2 border border-gray-300 rounded-[6px] text-sm"
                  placeholder="Specify what information you want to gather (one per line)..."
                />
              ) : (
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm min-h-[60px]">
                  {campaign.dataToCollect &&
                  campaign.dataToCollect.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {campaign.dataToCollect.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    "No data collection specified"
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mandatory Adherence
              </label>
              {isEditable ? (
                <textarea
                  ref={mandatoryAdherenceTextareaRef}
                  value={campaign.mandatoryAdherence || ""}
                  onChange={handleMandatoryAdherenceChange}
                  rows={3}
                  className="w-full px-3 pt-2 border border-gray-300 rounded-[6px] text-sm"
                  placeholder="Define compliance requirements and mandatory protocols..."
                />
              ) : (
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm min-h-[60px]">
                  {campaign.mandatoryAdherence ||
                    "No mandatory adherence specified"}
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Scheduling Section */}
        <CollapsibleSection
          title="Scheduling"
          icon={RiCalendarScheduleFill}
          isOpen={openSections.scheduling}
          iconClassname="text-purple-700"
          description="Configure the start time, end time, and sending frequency"
          onToggle={() => toggleSection("scheduling")}
        >
          <div className="space-y-6">
            {/* Time Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              {isEditable ? (
                <TimezoneDropdown
                  value={campaign.callTimezone || ""}
                  onChange={(value) => handleInputChange("callTimezone", value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm">
                  {campaign.callTimezone || "Not specified"}
                </div>
              )}
            </div>

            {/* Schedule call days */}
            {isEditable && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3 text-sm">
                  Schedule your call days
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {weekdays.map((day) => (
                    <label
                      key={day}
                      className="inline-flex items-center space-x-2 p-2 border border-gray-300 rounded-[6px] hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="w-3 h-3 text-indigo-600"
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Days Display (Read-only view) */}
            {!isEditable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Days
                </label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm">
                  {campaign.slotDates && campaign.slotDates.length > 0
                    ? campaign.slotDates.join(", ")
                    : "No specific days selected"}
                </div>
              </div>
            )}

            {/* Call timings */}
            {isEditable && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3 text-sm">
                  Select call timings during the day
                </h4>
                <div className="flex flex-wrap gap-2 justify-between">
                  <label className="w-full md:w-1/4 flex items-center p-2 border border-gray-300 rounded-[6px] hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="callTiming"
                      className="w-3 h-3 text-indigo-600"
                      value="fullDay"
                      checked={callTiming === "fullDay"}
                      onChange={(e) => handleCallTimingChange(e.target.value)}
                    />
                    <span className="ml-2 text-sm">
                      Full day - 10 AM to 6 PM
                    </span>
                  </label>
                  <label className="w-full md:w-1/4 flex items-center p-2 border border-gray-300 rounded-[6px] hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="callTiming"
                      className="w-3 h-3 text-indigo-600"
                      value="firstHalf"
                      checked={callTiming === "firstHalf"}
                      onChange={(e) => handleCallTimingChange(e.target.value)}
                    />
                    <span className="ml-2 text-sm">
                      1st Half only - 10 AM to 2 PM
                    </span>
                  </label>
                  <label className="w-full md:w-1/4 flex items-center p-2 border border-gray-300 rounded-[6px] hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="callTiming"
                      className="w-3 h-3 text-indigo-600"
                      value="secondHalf"
                      checked={callTiming === "secondHalf"}
                      onChange={(e) => handleCallTimingChange(e.target.value)}
                    />
                    <span className="ml-2 text-sm">
                      2nd Half only - 2 PM to 6 PM
                    </span>
                  </label>
                  <label className="w-full md:w-1/4 flex items-center p-2 border border-gray-300 rounded-[6px] hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="callTiming"
                      className="w-3 h-3 text-indigo-600"
                      value="custom"
                      checked={callTiming === "custom"}
                      onChange={(e) => handleCallTimingChange(e.target.value)}
                    />
                    <span className="ml-2 text-sm">Custom</span>
                  </label>
                  {callTiming === "custom" && (
                    <div className="flex items-center mt-3 space-x-4 ml-2 w-full">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <input
                          type="time"
                          value={customStartTime}
                          onChange={(e) => {
                            setCustomStartTime(e.target.value);
                            handleInputChange(
                              "slotTime",
                              `${e.target.value}-${customEndTime}`
                            );
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-[6px] text-sm"
                        />
                      </div>
                      <span className="text-sm">to</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <input
                          type="time"
                          value={customEndTime}
                          onChange={(e) => {
                            setCustomEndTime(e.target.value);
                            handleInputChange(
                              "slotTime",
                              `${customStartTime}-${e.target.value}`
                            );
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-[6px] text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Call Time Display (Read-only view) */}
            {!isEditable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call Time
                </label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm">
                  {campaign.slotTime || "Not specified"}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default CampaignGeneralTab;

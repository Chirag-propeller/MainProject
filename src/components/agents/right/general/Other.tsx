import React, { useState, useEffect } from "react";
import { Agent } from "@/components/agents/types";
import { X } from "lucide-react";
import { IoSettings } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import TooltipLabel from "@/components/ui/tooltip";
import { MdKeyboardArrowDown } from "react-icons/md";

const HANGUP_PHASES = [
  "bye",
  "goodbye",
  "that's it",
  "i don't want to talk anymore",
  "hang up",
  "end call",
  "see you later",
  "talk to you later",
];

const OtherContent = ({
  agent,
  setAgent,
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}) => {
  const [callDuration, setCallDuration] = useState<number>(
    agent.maxCallDuration || 150
  );
  const [numberTransfer, setNumberTransfer] = useState<boolean>(
    agent.numberTransfer || false
  );
  const [transferNumber, setTransferNumber] = useState<string>(
    agent.numberTransferNumber || ""
  );
  const [callHangup, setCallHangup] = useState<boolean>(
    agent.callHangup || false
  );
  const [selectedPhases, setSelectedPhases] = useState<string[]>(
    agent.callHangupPhase || []
  );
  const [inputPhrase, setInputPhrase] = useState<string>("");

  // Sync effects
  useEffect(
    () => setCallDuration(agent.maxCallDuration || 150),
    [agent.maxCallDuration]
  );
  useEffect(
    () => setNumberTransfer(agent.numberTransfer || false),
    [agent.numberTransfer]
  );
  useEffect(
    () => setTransferNumber(agent.numberTransferNumber || ""),
    [agent.numberTransferNumber]
  );
  useEffect(() => setCallHangup(agent.callHangup || false), [agent.callHangup]);
  useEffect(
    () => setSelectedPhases(agent.callHangupPhase || []),
    [agent.callHangupPhase]
  );

  // Updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (agent.maxCallDuration !== callDuration)
        setAgent({ ...agent, maxCallDuration: callDuration });
    }, 500);
    return () => clearTimeout(timeout);
  }, [callDuration, agent, setAgent]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (agent.numberTransferNumber !== transferNumber)
        setAgent({ ...agent, numberTransferNumber: transferNumber });
    }, 500);
    return () => clearTimeout(timeout);
  }, [transferNumber, agent, setAgent]);

  useEffect(() => {
    if (agent.numberTransfer !== numberTransfer)
      setAgent({ ...agent, numberTransfer: numberTransfer });
  }, [numberTransfer, agent, setAgent]);

  useEffect(() => {
    if (agent.callHangup !== callHangup)
      setAgent({ ...agent, callHangup: callHangup });
  }, [callHangup, agent, setAgent]);

  useEffect(() => {
    if (
      JSON.stringify(agent.callHangupPhase) !== JSON.stringify(selectedPhases)
    ) {
      setAgent({ ...agent, callHangupPhase: selectedPhases });
    }
  }, [selectedPhases, agent, setAgent]);

  const handlePhaseToggle = (phrase: string) => {
    setSelectedPhases((prev) =>
      prev.includes(phrase)
        ? prev.filter((p) => p !== phrase)
        : [...prev, phrase]
    );
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Call Duration */}
      <div className="bg-gray-50 p-4 rounded-[6px] shadown-sm">
        <TooltipLabel
          label="Maximum Call Duration (seconds)"
          fieldKey="MaxmCallDuration"
          htmlFor="callDuration"
          className="font-semibold"
        />
        <input
          id="callDuration"
          type="number"
          min="20"
          max="3600"
          value={callDuration}
          onChange={(e) => setCallDuration(parseInt(e.target.value) || 150)}
          className="w-full max-w-xs p-2 rounded-[6px] border border-gray-200 text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Default: 1200 seconds (20 minutes)
        </p>
      </div>

      {/* Number Transfer */}
      <div className="bg-gray-50 p-4 rounded-[6px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className=" text-sm font-semibold text-gray-900">
              Number Transfer
            </h4>
            <p className="font-light text-gray-600">
              Allow calls to be transferred to another number
            </p>
          </div>
          <hr className="border-t border-gray-600 my-4" />

          <div
            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
              numberTransfer ? "bg-indigo-600" : "bg-gray-200"
            }`}
            onClick={() => setNumberTransfer(!numberTransfer)}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                numberTransfer ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
        </div>
        {numberTransfer && (
          <div className="flex flex-col gap-1">
            <hr className="border-t border-gray-200 my-4" />
            <TooltipLabel
              label="Transfer Number"
              fieldKey="NumberTransfer"
              htmlFor="transferNumber"
            />
            <input
              id="transferNumber"
              type="tel"
              placeholder="+1234567890"
              value={transferNumber}
              onChange={(e) => setTransferNumber(e.target.value)}
              className="w-full max-w-xs p-2 rounded-[6px] border border-gray-200 shadow-sm text-sm"
            />
            <p className="text-xs text-gray-500">
              Include country code (e.g., +91 for India)
            </p>
          </div>
        )}
      </div>

      {/* Call Hangup */}
      <div className="bg-gray-50 p-4 rounded-[6px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Call Hangup</h4>
            <p className="font-light text-gray-600">
              Automatically end calls when specific phrases are detected
            </p>
          </div>
          <div
            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
              callHangup ? "bg-indigo-600" : "bg-gray-200"
            }`}
            onClick={() => setCallHangup(!callHangup)}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                callHangup ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
        </div>

        {callHangup && (
          <div className="flex flex-col gap-3">
            <hr className="border-t border-gray-200 my-4" />
            <TooltipLabel
              label="Hangup Trigger Phrases"
              fieldKey="CallHangup"
            />
            {/* Display Added Phrases */}
            {selectedPhases.length > 0 && (
              <div className="min-h-[80px] border border-gray-300 p-3 rounded-[6px] bg-white/30">
                <p className="text-xs text-gray-500 mb-2">Selected Phrases</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPhases.map((phrase) => (
                    <span
                      key={phrase}
                      className="inline-flex items-center bg-indigo-50 text-black border border-indigo-100 px-3 py-1 rounded-[6px] text-sm"
                    >
                      {phrase}
                      <button
                        onClick={() =>
                          setSelectedPhases((prev) =>
                            prev.filter((p) => p !== phrase)
                          )
                        }
                        className="ml-2 hover:bg-blue-200 rounded-[6px] p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Input with + Button */}
            <div className="flex gap-2 rounded-[6px]">
              <input
                type="text"
                placeholder="Type a phrase and press Enter or +"
                value={inputPhrase}
                onChange={(e) => setInputPhrase(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const trimmed = inputPhrase.trim();
                    if (trimmed && !selectedPhases.includes(trimmed)) {
                      setSelectedPhases([...selectedPhases, trimmed]);
                      setInputPhrase("");
                    }
                  }
                }}
                className="p-2 rounded-[6px] border border-gray-300 text-sm w-full"
              />
              <button
                onClick={() => {
                  const trimmed = inputPhrase.trim();
                  if (trimmed && !selectedPhases.includes(trimmed)) {
                    setSelectedPhases([...selectedPhases, trimmed]);
                    setInputPhrase(""); // Clear input
                  }
                }}
                className="px-3 py-1 bg-indigo-200 text-black text-lg rounded-[6px] font-bold"
              >
                +
              </button>
            </div>
            <p className="text-gray-500 font-light text-xs">
              {`Common phrases: "bye", "goodbye", "that's it", "stop calling"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Other = ({
  agent,
  setAgent,
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border bg-white rounded-[6px] border-gray-200 shadow-sm hover:border-gray-300">
      <header
        className="cursor-pointer bg-white border-b-background px-2 py-1 m-1 rounded-[6px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between m-1.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center">
              <span className="text-gray-700 text-lg">
                <IoSettings />
              </span>
            </div>
            <div>
              <h2 className="text-[14px] text-gray-900 font-semibold ml-1.5">
                Other Settings
                <span className="text-[14px] text-gray-500 font-medium pl-2">
                  (Call Duration, Transfer & Hangup)
                </span>
              </h2>
              <p className="font-light text-gray-500 text-sm pt-1 ml-1.5">
                Advanced call handling settings
              </p>
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
      {isOpen && <OtherContent agent={agent} setAgent={setAgent} />}
    </div>
  );
};

export default Other;

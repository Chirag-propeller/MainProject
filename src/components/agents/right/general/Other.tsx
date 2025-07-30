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
  const [hangupMessage, setHangupMessage] = useState<string>(
    agent.hangupMessage || ""
  );
  const [userAwayTimeOut, setUserAwayTimeOut] = useState<number>(
    agent.userAwayTimeOut || 5
  );
  const [isLanguageFillersActive, setIsLanguageFillersActive] = useState<boolean>(
    agent.isLanguageFillersActive || false
  );
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
  useEffect(
    () => setHangupMessage(agent.hangupMessage || ""),
    [agent.hangupMessage]
  );
  useEffect(
    () => setIsLanguageFillersActive(agent.isLanguageFillersActive || false),
    [agent.isLanguageFillersActive]
  );

  // Updates
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (agent.maxCallDuration !== callDuration)
  //       setAgent({ ...agent, maxCallDuration: callDuration });
  //   }, 500);
  //   return () => clearTimeout(timeout);
  // }, [callDuration, agent, setAgent]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (agent.numberTransferNumber !== transferNumber)
  //       setAgent({ ...agent, numberTransferNumber: transferNumber });
  //   }, 500);
  //   return () => clearTimeout(timeout);
  // }, [transferNumber, agent, setAgent]);

  // useEffect(() => {
  //   if (agent.numberTransfer !== numberTransfer)
  //     setAgent({ ...agent, numberTransfer: numberTransfer });
  // }, [numberTransfer, agent, setAgent]);

  // useEffect(() => {
  //   if (agent.callHangup !== callHangup)
  //     setAgent({ ...agent, callHangup: callHangup });
  // }, [callHangup, agent, setAgent]);

  // useEffect(() => {
  //   if (
  //     JSON.stringify(agent.callHangupPhase) !== JSON.stringify(selectedPhases)
  //   ) {
  //     setAgent({ ...agent, callHangupPhase: selectedPhases });
  //   }
  // }, [selectedPhases, agent, setAgent]);

  const handleAddPhrase = (phrase: string) => {
    if (!selectedPhases.includes(phrase)) {
      const updated = [...selectedPhases, phrase];
      setSelectedPhases(updated);
      setAgent({ ...agent, callHangupPhase: updated });
    }
  };

  const handleRemovePhrase = (phrase: string) => {
    const updated = selectedPhases.filter((p) => p !== phrase);
    setSelectedPhases(updated);
    setAgent({ ...agent, callHangupPhase: updated });
  };

  // const handlePhaseToggle = (phrase: string) => {
  //   setSelectedPhases((prev) =>
  //     prev.includes(phrase)
  //       ? prev.filter((p) => p !== phrase)
  //       : [...prev, phrase]4
  //   );
  // };

  return (
    <div className="p-4 flex rounded-[6px] flex-col gap-6 bg-gray-50 dark:bg-gray-900">
      {/* Call Duration */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-[6px] shadow-sm">
        <TooltipLabel
          label="Maximum Call Duration (seconds)"
          fieldKey="MaxmCallDuration"
          htmlFor="callDuration"
          className="font-semibold"
          position="bottom"
        />
        <input
          id="callDuration"
          type="number"
          min="20"
          max="3600"
          value={callDuration}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 150;
            setCallDuration(value);
            setAgent({ ...agent, maxCallDuration: value });
          }}
          className="w-full max-w-xs p-2 rounded-[6px] border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
        />
        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
          Default: 1200 seconds (20 minutes)
        </p>
      </div>

      {/* User Away Time Out */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-[6px] shadow-sm">
        <TooltipLabel
          label="User Away Time Out (seconds)"
          fieldKey="UserAwayTimeOut"
          htmlFor="userAwayTimeOut"
          className="font-semibold"
          position="bottom"
        />
        <input
          id="userAwayTimeOut"
          type="number"
          min="1"
          max="60"
          value={userAwayTimeOut}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 5;
            setUserAwayTimeOut(value);
            setAgent({ ...agent, userAwayTimeOut: value });
          }}
          className="w-full max-w-xs p-2 rounded-[6px] border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
        />
        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
          Default: 5 seconds
        </p>
      </div>

      {/* Number Transfer */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-[6px] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className=" text-sm font-semibold text-gray-900 dark:text-white">
              Number Transfer
            </h4>
            <p className="font-light text-gray-600 dark:text-gray-300 text-sm">
              Allow calls to be transferred to another number
            </p>
          </div>
          <hr className="border-t border-gray-600 dark:border-gray-700 my-4" />

          <div
            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
              numberTransfer ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => {
              const newValue = !numberTransfer;
              setNumberTransfer(newValue); // local update
              setAgent({ ...agent, numberTransfer: newValue }); // parent update
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
                numberTransfer ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
        </div>
        {numberTransfer && (
          <div className="flex flex-col gap-1">
            <hr className="border-t border-gray-200 dark:border-gray-700 my-4" />
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
              onChange={(e) => {
                setTransferNumber(e.target.value);
                setAgent({ ...agent, numberTransferNumber: e.target.value });
              }}
              className="max-w-xs p-2 rounded-[6px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm w-1/2"
            />
            <p className="text-xs text-gray-500 dark:text-gray-300">
              Include country code (e.g., +91 for India)
            </p>
          </div>
        )}
      </div>

      {/* Call Hangup */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-[6px] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              Call Hangup
            </h4>
            <p className="font-light text-gray-600 dark:text-gray-300 text-sm">
              Automatically end calls when specific phrases are detected
            </p>
          </div>
          <div
            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
              callHangup ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => {
              const newValue = !callHangup;
              setCallHangup(newValue); // local update
              setAgent({ ...agent, callHangup: newValue }); // parent update
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
                callHangup ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
        </div>

        {callHangup && (
          <div className="flex flex-col gap-3">
            <hr className="border-t border-gray-200 dark:border-gray-700 my-4" />
            <TooltipLabel
              label="Hangup Trigger Phrases"
              fieldKey="CallHangup"
            />
            {/* Display Added Phrases */}
            {selectedPhases.length > 0 && (
              <div className="min-h-[80px] border border-gray-300 dark:border-gray-700 p-3 rounded-[6px] bg-white/30 dark:bg-gray-900/30">
                <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
                  Selected Phrases
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedPhases.map((phrase) => (
                    <span
                      key={phrase}
                      className="inline-flex items-center bg-indigo-50 dark:bg-indigo-900 text-black dark:text-white border border-indigo-100 dark:border-indigo-700 px-3 py-1 rounded-[6px] text-sm"
                    >
                      {phrase}
                      <button
                        onClick={() => handleRemovePhrase(phrase)}
                        className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-900 rounded-[6px] p-0.5 transition-colors"
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
                      handleAddPhrase(trimmed);
                      setInputPhrase("");
                    }
                  }
                }}
                className="p-2 rounded-[6px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm w-full"
              />
              <button
                onClick={() => {
                  const trimmed = inputPhrase.trim();
                  if (trimmed && !selectedPhases.includes(trimmed)) {
                    handleAddPhrase(trimmed);
                    setInputPhrase("");
                  }
                }}
                className="px-3 py-1 bg-indigo-200 dark:bg-indigo-900 text-black dark:text-white text-lg rounded-[6px] font-bold"
              >
                +
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-300 font-light text-xs">
              {`Common phrases: "bye", "goodbye", "that's it", "stop calling"`}
            </p>
            
            {/* Hangup Message */}
            <div className="mt-4">
              <TooltipLabel
                label="Hangup Message"
                fieldKey="HangupMessage"
                htmlFor="hangupMessage"
                className="font-semibold"
              />
              <textarea
                id="hangupMessage"
                placeholder="Enter the message that will be said to the user before hanging up..."
                value={hangupMessage}
                onChange={(e) => {
                  setHangupMessage(e.target.value);
                  setAgent({ ...agent, hangupMessage: e.target.value });
                }}
                rows={3}
                className="w-full p-2 rounded-[6px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                This message will be spoken to the user before the call ends
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Language Fillers */}
      <div className="bg-gray-50 p-4 rounded-[6px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Language Fillers</h4>
            <p className="font-light text-gray-600 text-sm">
              Enable automatic detection and handling of filler words
            </p>
          </div>
          <div
            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
              isLanguageFillersActive ? "bg-indigo-600" : "bg-gray-200"
            }`}
            onClick={() => {
              const newValue = !isLanguageFillersActive;
              setIsLanguageFillersActive(newValue);
              setAgent({ ...agent, isLanguageFillersActive: newValue }); 
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isLanguageFillersActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
        </div>
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
    <div className="border bg-white dark:bg-gray-900 rounded-[6px] border-gray-200 dark:border-gray-700 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 mr-2">
      <header
        className="cursor-pointer bg-white dark:bg-gray-900 border-b-background px-2 py-1 m-1 rounded-[6px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between m-1.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-[6px] flex items-center justify-center">
              <span className="text-gray-700 dark:text-gray-200 text-lg">
                <IoSettings />
              </span>
            </div>
            <div>
              <h2 className="text-[14px] text-gray-900 dark:text-white font-semibold ml-1.5">
                Other Settings
                <span className="text-[14px] text-gray-500 dark:text-gray-300 font-medium pl-2">
                  (Call Duration, Transfer & Hangup)
                </span>
              </h2>
              <p className="font-light text-gray-500 dark:text-gray-300 text-sm pt-1 ml-1.5">
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

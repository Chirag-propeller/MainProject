import React, { useState, useEffect } from "react";
import { Agent } from "@/components/agents/types";
import { Settings, Triangle, X } from "lucide-react";
import { RiArrowDropDownLine } from "react-icons/ri";
import TooltipLabel from "@/components/ui/tooltip";

// Predefined call hangup phases
// const HANGUP_PHRASES = [
//     'bye',
//     'goodbye',
//     'that\'s it',
//     'i don\'t want to talk anymore',
//     'hang up',
//     'end call',
//     'stop calling',
//     'not interested',
//     'remove me from list',
//     'see you later',
//     'talk to you later',
//     'catch you later',
//     'i\'m done',
//     'enough for now',
//     'that will be all',
//     'that\'s all',
//     'we\'re done',
//     'i\'m finished',
//     'you can stop now',
//     'stop talking',
//     'disconnect',
//     'no more',
//     'i have to go',
//     'let\'s end this',
//     'that\'s enough',
//     'thank you, goodbye',
//     'i\'m signing off',
//     'we\'re done here',
//     'exit',
//     'close conversation',
//     'terminate call',
//     'wrap it up',
//     'that concludes our chat',
//     'i\'m logging off',
//     'finish',
//     'end session',
//     'quit'
// ];

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

// const OtherLeft = ({
//   callDuration,
//   setCallDuration,
// }: {
//   callDuration: number;
//   setCallDuration: React.Dispatch<React.SetStateAction<number>>;
// }) => {
//   return (
//     <div className="w-3/5 pr-4">
//       <div className="flex flex-col gap-4">
//         {/* Call Duration Field */}
//         <div className="flex flex-col gap-2">
//           <label
//             htmlFor="callDuration"
//             className="text-sm font-medium text-gray-700"
//           >
//             Call Duration (seconds)
//           </label>
//           <input
//             id="callDuration"
//             type="number"
//             min="20"
//             max="3600"
//             className="w-full p-2 rounded-md border border-gray-300 text-sm"
//             value={callDuration}
//             onChange={(e) => setCallDuration(parseInt(e.target.value) || 150)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const OtherRight = ({
//   numberTransfer,
//   setNumberTransfer,
//   transferNumber,
//   setTransferNumber,
//   callHangup,
//   setCallHangup,
//   selectedPhases,
//   setSelectedPhases,
// }: {
//   numberTransfer: boolean;
//   setNumberTransfer: React.Dispatch<React.SetStateAction<boolean>>;
//   transferNumber: string;
//   setTransferNumber: React.Dispatch<React.SetStateAction<string>>;
//   callHangup: boolean;
//   setCallHangup: React.Dispatch<React.SetStateAction<boolean>>;
//   selectedPhases: string[];
//   setSelectedPhases: React.Dispatch<React.SetStateAction<string[]>>;
// }) => {
//   const handlePhaseToggle = (phase: string) => {
//     setSelectedPhases((prev) =>
//       prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase]
//     );
//   };

//   return (
//     <div className="w-2/5 pl-4 border-l border-gray-200">
//       <div className="flex flex-col gap-6">
//         {/* Number Transfer Toggle */}
//         <div className="flex flex-col gap-3">
//           <div className="flex items-center justify-start gap-4">
//             <label className="text-sm font-medium text-gray-700">
//               Number Transfer
//             </label>
//             <div
//               className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
//                 numberTransfer ? "bg-indigo-600" : "bg-gray-200"
//               }`}
//               onClick={() => setNumberTransfer(!numberTransfer)}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   numberTransfer ? "translate-x-6" : "translate-x-1"
//                 }`}
//               />
//             </div>
//           </div>

//           {/* Conditional Transfer Number Field */}
//           {numberTransfer && (
//             <div className="flex flex-col gap-2">
//               <label htmlFor="transferNumber" className="text-xs text-gray-600">
//                 Transfer Number
//               </label>
//               <input
//                 id="transferNumber"
//                 type="tel"
//                 placeholder="+1234567890"
//                 className="w-full p-2 rounded-md border border-gray-300 text-sm"
//                 value={transferNumber}
//                 onChange={(e) => setTransferNumber(e.target.value)}
//               />
//             </div>
//           )}
//         </div>

//         {/* Call Hangup Feature Toggle */}
//         <div className="flex flex-col gap-3">
//           <div className="flex items-center justify-start gap-4">
//             <label className="text-sm font-medium text-gray-700">
//               Call Hangup
//             </label>
//             <div
//               className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
//                 callHangup ? "bg-indigo-600" : "bg-gray-200"
//               }`}
//               onClick={() => setCallHangup(!callHangup)}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   callHangup ? "translate-x-6" : "translate-x-1"
//                 }`}
//               />
//             </div>
//           </div>

//           {callHangup && (
//             <div className="flex flex-col gap-2">
//               <label className="text-xs text-gray-600">
//                 Hangup Trigger Phrases
//               </label>
//               <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
//                 <div className="flex flex-col gap-0">
//                   {HANGUP_PHASES.map((phrase) => (
//                     <label
//                       key={phrase}
//                       className="flex items-center gap-2 cursor-pointer p-1 py-0.5 hover:bg-gray-50 rounded text-xs"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedPhases.includes(phrase)}
//                         onChange={() => handlePhaseToggle(phrase)}
//                         className="w-3 h-3 rounded border-gray-300"
//                       />
//                       <span className="text-gray-700">{phrase}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Selected Phrase Tags */}
//               {selectedPhases.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {selectedPhases.map((phrase) => (
//                     <span
//                       key={phrase}
//                       className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full"
//                     >
//                       {phrase}
//                     </span>
//                   ))}
//                 </div>
//               )}

//               <p className="text-xs text-gray-500">
//                 Select phrases that will trigger call hangup
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

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
      <div className="bg-white p-4 rounded-[6px] border shadown-sm border-gray-200">
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
          className="w-full max-w-xs p-2 rounded-[6px] border border-gray-200 shadow-sm text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Default: 1200 seconds (20 minutes)
        </p>
      </div>

      {/* Number Transfer */}
      <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className=" text-sm font-semibold text-gray-900">
              Number Transfer
            </h4>
          </div>
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
      <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Call Hangup</h4>
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
    <div className="border bg-white rounded-[6px] border-gray-200 shadow-sm">
      <header
        className="cursor-pointer bg-white border-b border-gray-200 px-2 py-3 rounded-[6px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between m-1.5">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-900 self-center" />
            <h2 className="text-md text-gray-900 font-semibold">
              Other Settings
              <span className="text-sm ml-1 text-gray-400">
                (Call Duration, Transfer & Hangup)
              </span>
            </h2>
          </div>
          <RiArrowDropDownLine
            className={`w-10 h-10 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ fill: "black" }}
          />
        </div>
      </header>
      {isOpen && <OtherContent agent={agent} setAgent={setAgent} />}
    </div>
  );
};

export default Other;

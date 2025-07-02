import React from "react";
import { Agent } from "../types";
import Model from "./general/Model";
import Transcriber from "./general/Transcriber";
import Voice from "./general/Voice";
import Tools from "./general/Tools";
import Other from "./general/Other";
import Pricing from "./general/Pricing";

interface AgentGeneralTabProps {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}

const AgentGeneralTab: React.FC<AgentGeneralTabProps> = ({
  agent,
  setAgent,
}) => {
  return (
    <div className="flex flex-col gap-3 bg-gray-50 p-5">
      <div className="flex flex-wrap gap-4 px-5 text-sm items-center">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
          proPal
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
          STT
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-indigo-300"></span>
          LLM
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-indigo-800"></span>
          TTS
        </div>
      </div>
      <Pricing agent={agent} />
      <Model agent={agent} setAgent={setAgent} />
      <Transcriber agent={agent} setAgent={setAgent} />
      <Voice agent={agent} setAgent={setAgent} />
      <Tools agent={agent} setAgent={setAgent} />
      <Other agent={agent} setAgent={setAgent} />
    </div>
  );
};

export default AgentGeneralTab;

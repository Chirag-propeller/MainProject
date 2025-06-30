import React from "react";
import { Agent } from "../types";
import Model from "./general/Model";
import Transcriber from "./general/Transcriber";
import Voice from "./general/Voice";
import Tools from "./general/Tools";
import Other from "./general/Other";

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
      <Model agent={agent} setAgent={setAgent} />
      <Transcriber agent={agent} setAgent={setAgent} />
      <Voice agent={agent} setAgent={setAgent} />
      <Tools agent={agent} setAgent={setAgent} />
      <Other agent={agent} setAgent={setAgent} />
    </div>
  );
};

export default AgentGeneralTab;

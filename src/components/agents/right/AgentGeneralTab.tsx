import React from 'react';
import { Agent } from '../types';
import Model from './general/Model';
import Transcriber from './general/Transcriber';
import Voice from './general/Voice';
import Tools from './general/Tools';

interface AgentGeneralTabProps {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}

const AgentGeneralTab: React.FC<AgentGeneralTabProps> = ({ agent, setAgent }) => {
  return (
    <div className='flex flex-col gap-3'>
        <Model agent={agent} setAgent={setAgent} />
        <Transcriber agent={agent} setAgent={setAgent} />
        <Voice agent={agent} setAgent={setAgent} />
        <Tools agent={agent} setAgent={setAgent} />
    </div>
  );
};

export default AgentGeneralTab; 
import React from 'react';
import { Agent } from '../types';

interface AgentPromptTabProps {
  agent: Agent;
}

const AgentPromptTab: React.FC<AgentPromptTabProps> = ({ agent }) => {
  if (!agent.prompt) {
    return (
      <div className="text-center py-10 text-gray-500">
        No prompt available for this agent.
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">Prompt</p>
      <div className="bg-gray-50 p-3 rounded border text-sm whitespace-pre-wrap">
        {agent.prompt}
      </div>
    </div>
  );
};

export default AgentPromptTab; 
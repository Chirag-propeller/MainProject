import React from 'react';
import { Agent } from '../types';

interface AgentPromptTabProps {
  agent: Agent;
}

const AgentPromptTab: React.FC<AgentPromptTabProps> = ({ agent }) => {
  if (!agent.prompt) {
    return (
      <div className="text-center py-10 text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-900">
        No prompt available for this agent.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">Prompt</p>
      <div className="bg-gray-50 p-3 rounded border text-sm whitespace-pre-wrap text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
        {agent.prompt}
      </div>
    </div>
  );
};

export default AgentPromptTab; 
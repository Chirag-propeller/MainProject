import React from 'react';
import { Button } from '@/components/ui/button';
interface CampaignHeaderProps {
  title: string;
  onCreate: () => Promise<void>;
}

const AgentHeader: React.FC<CampaignHeaderProps> = ({ title, onCreate }) => {
  return (
    <div className="flex justify-between items-center mb-4 bg-white dark:bg-gray-950 dark:text-gray-100">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
      <Button variant="default" onClick={onCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700">
        Create
      </Button>
    </div>
  );
};

export default AgentHeader; 
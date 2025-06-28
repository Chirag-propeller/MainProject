import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface AgentHeaderProps {
  title: string;
  onCreate: () => void;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ title, onCreate }) => {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-950 dark:text-gray-100">
      <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button 
          onClick={onCreate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white"
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default AgentHeader; 
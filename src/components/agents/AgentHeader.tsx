import React from 'react';
import { Button } from '@/components/ui/button';

interface AgentHeaderProps {
  title: string;
  onCreate: () => void;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ title, onCreate }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-medium">{title}</h1>
      <Button 
        onClick={onCreate}
        className="bg-indigo-500 hover:bg-indigo-600 text-white"
      >
        Create
      </Button>
    </div>
  );
};

export default AgentHeader; 
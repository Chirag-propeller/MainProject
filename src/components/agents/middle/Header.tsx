import React from 'react';
import { Button } from '@/components/ui/button';
interface CampaignHeaderProps {
  title: string;
  onCreate: () => Promise<void>;
}

const AgentHeader: React.FC<CampaignHeaderProps> = ({ title, onCreate }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <Button variant="default" onClick={onCreate}>
        Create
      </Button>
    </div>
  );
};

export default AgentHeader; 
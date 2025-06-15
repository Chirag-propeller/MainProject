import React from 'react';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';

interface CampaignHeaderProps {
  title: string;
  onCreate: () => Promise<void>;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ title, onCreate }) => {
  return (
    <div className="flex justify-between items-center">
      <div className='flex gap-1.5'>
        <Megaphone className='w-3.5 h-3.5 self-center text-indigo-600' />
        <h1 className="text-lg self-center text-indigo-600">{title}</h1>
      </div>

      <Button 
        onClick={onCreate}
        className='px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-300'
      >
        Create
      </Button>
    </div>
  );
};

export default CampaignHeader; 
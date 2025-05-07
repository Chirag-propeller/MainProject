import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CampaignHeaderProps {
  title: string;
  createButtonLink: string;
  createButtonText: string;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  title,
  createButtonLink,
  createButtonText
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <Link href={createButtonLink}>
        <Button className="cursor-pointer text-sm px-3 py-1 h-8">
          {createButtonText}
        </Button>
      </Link>
    </div>
  );
};

export default CampaignHeader; 
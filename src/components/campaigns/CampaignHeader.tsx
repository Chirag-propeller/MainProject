import React from "react";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";

interface CampaignHeaderProps {
  title: string;
  onCreate: () => Promise<void>;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ title, onCreate }) => {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex gap-1.5 min-w-0 flex-1">
        <Megaphone className="w-3.5 h-3.5 self-center text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-lg self-center text-indigo-600 truncate min-w-0 dark:text-indigo-400">
          {title}
        </h1>
      </div>
      <Button
        onClick={onCreate}
        className="px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-300 whitespace-nowrap ml-2"
      >
        Create
      </Button>
    </div>
  );
};

export default CampaignHeader;

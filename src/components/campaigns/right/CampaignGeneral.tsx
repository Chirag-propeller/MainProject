"use client";
import React from 'react';
import { Campaign, Agent } from '../types';
import GeneralInfo from './general/GeneralInfo';
import AgentConfiguration from './general/AgentConfiguration';
import Goal from './general/Goal';
import GoalsAndData from './general/GoalsAndData';

interface CampaignGeneralProps {
  campaign: Campaign;
  agents: Agent[];
}

const CampaignGeneral: React.FC<CampaignGeneralProps> = ({ campaign, agents }) => {
  return (
    <div className='flex flex-col gap-3'>
      <GeneralInfo campaign={campaign} />
      <AgentConfiguration campaign={campaign} agents={agents} />
      <GoalsAndData campaign={campaign} />
      <Goal campaign={campaign} />
    </div>
  );
};

export default CampaignGeneral; 
export interface Campaign {
  _id: string;
  campaignCallId: string;
  campaignCallName: string;
  status: 'ongoing' | 'completed' | 'draft';
  createdAt: string;
  fromNumber?: string;
  agentId?: string;
}

export interface Agent {
  _id: string;
  agentId: string;
  agentName: string;
} 
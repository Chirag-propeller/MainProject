export interface Campaign {
  _id: string;
  campaignCallId: string;
  campaignCallName: string;
  status: 'ongoing' | 'completed' | 'draft';
  createdAt: string;
  fromNumber?: string;
  agentId?: string;
  concurrentCalls?: number;
  sendOption?: string;
  scheduleDate?: string;
  timeZone?: string;
  recipientsFile?: File | null;
  recipients?: string[];
  followUp?: string;
  noOfFollowUps?: string;
  
  // New fields from the database model
  goal?: string;
  dataToCollect?: string[];
  mandatoryAdherence?: string;
  slotDates?: string[];
  slotTime?: string;
  callDate?: string;
  callTimezone?: string;
  callScheduledOrNot?: boolean;
  callTime?: string;
}

export interface Agent {
  _id: string;
  agentId: string;
  agentName: string;
} 
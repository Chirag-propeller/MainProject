import { Campaign, Agent } from './types';

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const res = await fetch('/api/createCampaign/get');
    const data = await res.json();
    
    // If status is not provided from API, set a default for backward compatibility
    return data.map((campaign: any) => ({
      ...campaign,
      status: campaign.status || 'ongoing'
    }));
  } catch (err) {
    console.error('Failed to fetch campaigns:', err);
    return [];
  }
};

export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const res = await fetch('/api/agent/get');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch agents:', err);
    return [];
  }
};

export const deleteCampaign = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch('/api/createCampaign/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    return res.ok;
  } catch (err) {
    console.error('Delete failed:', err);
    return false;
  }
}; 
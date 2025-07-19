import { create } from 'zustand';
import { Campaign } from '@/components/campaigns/types';

interface CampaignStore {
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;
  updateCampaign: (updated: Campaign) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  campaigns: [],
  setCampaigns: (campaigns) => set({ campaigns }),
  updateCampaign: (updated) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c._id === updated._id ? updated : c
      ),
    })),
}));
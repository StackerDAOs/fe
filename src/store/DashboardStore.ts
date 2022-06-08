import create from 'zustand';

interface DashboardStore {
  organization: Organization;
  setOrganization: (organization: Organization) => void;
  proposals: Proposal[];
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  contractAddress: string;
  Extensions: any[];
};

type Proposal = {
  proposer: string;
  votesFor: string;
  votesAgainst: string;
  startHeight: string;
  endHeight: string;
};

const initialState = {
  organization: {} as Organization,
  proposals: [] as Proposal[],
}

export const useStore = create<DashboardStore>((set: any) => ({
  ...initialState,
  setOrganization: (organization: any) => {
    set((state: any) => ({
      ...state,
      organization,
    }));
  },
}));
import create from 'zustand';

interface ProposalStore {
  proposals: Proposal[];
  setProposals: (proposals: Proposal[]) => void;
};

type Proposal = {
  fungible_tokens: object;
  non_fungible_tokens: object;
  stx: object;
};

const initialState = {
  proposals: [] as Proposal[],
}

export const useStore = create<ProposalStore>((set: any) => ({
  ...initialState,
  setProposals: (proposals: object) => {
    set((state: any) => ({
      ...state,
      proposals,
    }));
  },
}));
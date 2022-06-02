import create from 'zustand';

interface VaultStore {
  balance: Balance;
  setBalance: (balance: Balance) => void;
};

type Balance = {
  fungible_tokens: object;
  non_fungible_tokens: object;
  stx: object;
};

const initialState = {
  balance: {} as Balance,
}

export const useStore = create<VaultStore>((set: any) => ({
  ...initialState,
  setBalance: (balance: object) => {
    set((state: any) => ({
      ...state,
      balance,
    }));
  },
}));
import create from 'zustand';

interface TransactionStore {
  transaction: Transaction;
  setTransaction: (transaction: Transaction) => void;
};

type Transaction = {
  txId: any;
  data: any;
};

const initialState = {
  transaction: {} as Transaction,
}

export const useStore = create<TransactionStore>((set: any) => ({
  ...initialState,
  setTransaction: (transaction: object) => {
    set((state: any) => ({
      ...state,
      transaction,
    }));
  },
}));
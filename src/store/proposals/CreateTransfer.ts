import create from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';

interface AssetStore {
  selectedAssetType: string;
  selectedAsset: string;
  handleSelectAsset: (type: string, selection: string) => void;
}

const initialAssetState = {
  selectedAssetType: 'Token',
  selectedAsset: 'STX',
};

export const useStore = create<AssetStore>(persist(
  (set) => ({
    ...initialAssetState,
    handleSelectAsset: (type: string, selection: string) => {
      set(state => ({
        ...state,
        [type]: selection
      }));
    },
  }),
  {
    name: 'create-proposal-assets',
    getStorage: () => sessionStorage,
  }
));

interface ProposalStore {
  transferAmount: string;
  transferTo: string;
  description: string;
  handleChange: (e: any) => void;
}

const initialProposalState = {
  transferAmount: '',
  transferTo: '',
  description: '',
};

export const proposalStore = create<ProposalStore>(persist(
  (set) => ({
    ...initialProposalState,
    handleChange: (e: any) => {
      set(state => ({
        ...state,
        [e.target.name]: e.target.value,
      }));
    },
  }),
  {
    name: 'create-proposal-details',
    getStorage: () => sessionStorage,
  }
));
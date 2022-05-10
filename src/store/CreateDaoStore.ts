import create from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';

interface CreateDaoStore {
  name: string;
  membershipExtension: ExtensionType;
  vaultExtension: VaultExtensionType;
  proposalExtension: ExtensionType;
  votingExtension: ExtensionType;
  emergencyExtension: ExtensionType;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNestedInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addAsset: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selectAsset: (e: any) => void;
}

type ExtensionType = {
  name: string;
  config: object;
}

type VaultExtensionType = {
  newAsset: string;
  whiteListedAddresses: string[];
}

const initialState = {
  name: '',
  membershipExtension: {} as ExtensionType,
  vaultExtension: { newAsset: '', whiteListedAddresses: [] } as VaultExtensionType,
  proposalExtension: {} as ExtensionType,
  votingExtension: {} as ExtensionType,
  emergencyExtension: {} as ExtensionType,
}

export const useStore = create<CreateDaoStore>(persist(
  (set) => ({
    ...initialState,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      set(state => ({
        ...state,
        [name]: value
      }));
    },
    handleNestedInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      set(produce(state => {
        state.vaultExtension.newAsset = value;
      }));
    },
    addAsset: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      set(produce(state => {
        const { newAsset } = state.vaultExtension;
        state.vaultExtension.whiteListedAddresses = state.vaultExtension.whiteListedAddresses.concat(newAsset);
        state.vaultExtension.newAsset = '';
      }));
    },
    selectAsset: (e: any) => {
      set(produce(state => {
        const { checked, value } = e.target;
        const { whiteListedAddresses } = state.vaultExtension;
        if (checked) {
          state.vaultExtension.whiteListedAddresses = whiteListedAddresses.concat(value);
        } else {
          state.vaultExtension.whiteListedAddresses = whiteListedAddresses.filter((contractAddress: string) => contractAddress !== value);
        }
      }));
    },
  }),
  {
    name: 'dao-storage',
    getStorage: () => sessionStorage,
  }
));
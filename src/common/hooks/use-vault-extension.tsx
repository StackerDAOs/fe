// Hook (use-vault-extension.tsx)
import { useEffect, useState } from 'react';

import { useCurrentStxAddress } from '@micro-stacks/react';

type TVaultExtension = {
  isLoading: boolean;
  contractAddress: string;
  contractName: string;
};

interface IVaultExtension {
  organization?: any;
}

const initialState = {
  isLoading: true,
  contractAddress: '',
  contractName: '',
};

export function useVaultExtension({ organization }: IVaultExtension = {}) {
  const [state, setState] = useState<TVaultExtension>(initialState);
  const currentStxAddress = useCurrentStxAddress();

  useEffect(() => {
    async function fetchVaultExtension() {
      const vaultExtension = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === 'Vault',
      );
      const contractAddress = vaultExtension?.contractAddress?.split('.')[0];
      const contractName = vaultExtension?.contractAddress?.split('.')[1];

      setState({
        ...state,
        isLoading: false,
        contractAddress,
        contractName,
      });
    }
    fetchVaultExtension();
  }, [organization, currentStxAddress]);

  return {
    isLoading: state.isLoading,
    contractAddress: state.contractAddress,
    contractName: state.contractName,
  };
}

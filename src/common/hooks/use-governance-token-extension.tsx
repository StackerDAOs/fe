// Hook (use-voting-extension.tsx)
import { useEffect, useState } from 'react';
import { useCurrentStxAddress } from '@micro-stacks/react';

type GovernanceTokenExtension = {
  isLoading: boolean;
  contractAddress: string;
  contractName: string;
};

interface IGovernanceTokenExtension {
  organization?: any;
}

const initialState = {
  isLoading: true,
  contractAddress: '',
  contractName: '',
};

export function useGovernanceTokenExtension({
  organization,
}: IGovernanceTokenExtension = {}) {
  const [state, setState] = useState<GovernanceTokenExtension>(initialState);
  const currentStxAddress = useCurrentStxAddress();

  useEffect(() => {
    async function fetchTokenExtension() {
      try {
        const tokenExtension = organization?.Extensions?.find(
          (extension: any) =>
            extension?.ExtensionTypes?.name === 'Governance Token',
        );
        const contractAddress = tokenExtension?.contractAddress.split('.')[0];
        const contractName = tokenExtension?.contractAddress.split('.')[1];
        setState({ ...state, isLoading: false, contractAddress, contractName });
      } catch (e: any) {
        console.error({ e });
      }
    }
    fetchTokenExtension();
  }, [organization, currentStxAddress]);

  return {
    isLoading: state.isLoading,
    contractAddress: state.contractAddress,
    contractName: state.contractName,
  };
}

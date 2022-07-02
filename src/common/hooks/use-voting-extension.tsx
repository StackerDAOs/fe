// Hook (use-voting-extension.tsx)
import { useEffect, useState } from 'react';

import { useCurrentStxAddress } from '@micro-stacks/react';

type TVotingExtension = {
  isLoading: boolean;
  contractAddress: string;
  contractName: string;
};

interface IVotingExtension {
  organization?: any;
}

const initialState = {
  isLoading: true,
  contractAddress: '',
  contractName: '',
};

export function useVotingExtension({ organization }: IVotingExtension = {}) {
  const [state, setState] = useState<TVotingExtension>(initialState);
  const currentStxAddress = useCurrentStxAddress();

  useEffect(() => {
    async function fetchVotingExtension() {
      const voteExtension = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === 'Voting',
      );
      const contractAddress = voteExtension?.contractAddress?.split('.')[0];
      const contractName = voteExtension?.contractAddress?.split('.')[1];
      try {
        if (currentStxAddress) {
          setState({
            ...state,
            isLoading: false,
            contractAddress,
            contractName,
          });
        }
      } catch (e: any) {
        console.log({ e });
      } finally {
        console.log('done');
      }
    }
    fetchVotingExtension();
  }, [organization, currentStxAddress]);

  return {
    isLoading: state.isLoading,
    contractAddress: state.contractAddress,
    contractName: state.contractName,
  };
}

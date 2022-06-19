// Hook (use-organization.tsx)
import { useEffect, useState } from 'react';
import { useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { standardPrincipalCV } from 'micro-stacks/clarity';

type TVotingExtension = {
  isLoading: boolean;
  contractAddress: string;
  contractName: string;
  balance: string;
};

interface IVotingExtension {
  organization?: any;
}

const initialState = {
  isLoading: true,
  contractAddress: '',
  contractName: '',
  balance: '',
};

export function useGovernanceToken({ organization }: IVotingExtension = {}) {
  // TODO: check if slug is present and return error if not
  // TODO: check if oranization exists before checking balance
  const [state, setState] = useState<TVotingExtension>(initialState);
  const { network } = useNetwork();
  const currentStxAddress = useCurrentStxAddress();

  useEffect(() => {
    async function fetchGovernanceToken() {
      const governanceToken = organization?.Extensions?.find(
        (extension: any) =>
          extension?.ExtensionTypes?.name === 'Governance Token',
      );
      const contractAddress = governanceToken?.contractAddress?.split('.')[0];
      const contractName = governanceToken?.contractAddress?.split('.')[1];
      const senderAddress = currentStxAddress;

      const functionArgsForBalance = currentStxAddress
        ? [standardPrincipalCV(currentStxAddress || '')]
        : [];
      try {
        if (currentStxAddress && contractAddress && contractName) {
          const fetchBalance: any = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress,
            functionArgs: functionArgsForBalance,
            functionName: 'get-balance',
          });
          setState({
            ...state,
            isLoading: false,
            contractAddress,
            contractName,
            balance: fetchBalance.toString(),
          });
        }
      } catch (e: any) {
        console.log({ e });
      } finally {
        console.log('done');
      }
    }
    fetchGovernanceToken();
  }, [organization, currentStxAddress]);

  return {
    isLoading: state.isLoading,
    contractAddress: state.contractAddress,
    contractName: state.contractName,
    balance: state.balance,
  };
}

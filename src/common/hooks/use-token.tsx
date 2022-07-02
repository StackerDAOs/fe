// Hook (use-organization.tsx)
import { useEffect, useState } from 'react';
import { useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { standardPrincipalCV } from 'micro-stacks/clarity';

type TVotingExtension = {
  isLoading: boolean;
  contractAddress: string;
  contractName: string;
  balance: number;
  symbol: string;
};

interface IVotingExtension {
  tokenAddress: string;
}

const initialState = {
  isLoading: true,
  contractAddress: '',
  contractName: '',
  balance: 0,
  symbol: '',
};

export function useToken(
  { tokenAddress }: IVotingExtension = { tokenAddress: '' },
) {
  const [state, setState] = useState<TVotingExtension>(initialState);
  const { network } = useNetwork();
  const currentStxAddress = useCurrentStxAddress();

  useEffect(() => {
    async function fetchGovernanceToken() {
      try {
        const [contractAddress, contractName] = tokenAddress.split('.');
        if (currentStxAddress && tokenAddress) {
          const balance: any = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress: currentStxAddress,
            functionArgs: [standardPrincipalCV(currentStxAddress || '')],
            functionName: 'get-balance',
          });
          const symbol: any = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress: currentStxAddress,
            functionArgs: [],
            functionName: 'get-symbol',
          });
          setState({
            ...state,
            isLoading: false,
            contractAddress,
            contractName,
            symbol,
            balance,
          });
        }
      } catch (e: any) {
        console.error({ e });
      }
    }
    fetchGovernanceToken();
  }, [tokenAddress, currentStxAddress]);

  return {
    isLoading: state.isLoading,
    contractAddress: state.contractAddress,
    contractName: state.contractName,
    balance: state.balance,
    symbol: state.symbol,
  };
}

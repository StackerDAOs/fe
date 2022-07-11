// Hook (use-organization.tsx)
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { standardPrincipalCV } from 'micro-stacks/clarity';

type TVotingExtension = {
  isLoading: boolean;
  contractAddress: string;
  contractName: string;
  balance: number;
  decimals: number;
  symbol: string;
};

interface IVotingExtension {
  organization?: any;
}

const initialState = {
  isLoading: true,
  contractAddress: '',
  contractName: '',
  balance: 0,
  decimals: 0,
  symbol: '',
};

export function useGovernanceToken({ organization }: IVotingExtension = {}) {
  // TODO: check if slug is present and return error if not
  // TODO: check if oranization exists before checking balance
  const [state, setState] = useState<TVotingExtension>(initialState);
  const { network } = useNetwork();
  const { stxAddress }: any = useAccount();

  useEffect(() => {
    async function fetchGovernanceToken() {
      const governanceToken = organization?.Extensions?.find(
        (extension: any) =>
          extension?.ExtensionTypes?.name === 'Governance Token',
      );
      const contractAddress = governanceToken?.contractAddress?.split('.')[0];
      const contractName = governanceToken?.contractAddress?.split('.')[1];
      const senderAddress = stxAddress;

      const functionArgsForBalance = stxAddress
        ? [standardPrincipalCV(stxAddress || '')]
        : [];
      try {
        if (stxAddress && contractAddress && contractName) {
          const balance: any = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress,
            functionArgs: functionArgsForBalance,
            functionName: 'get-balance',
          });
          const decimals: any = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress,
            functionArgs: [],
            functionName: 'get-decimals',
          });
          const symbol: any = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress,
            functionArgs: [],
            functionName: 'get-symbol',
          });
          setState({
            ...state,
            isLoading: false,
            contractAddress,
            contractName,
            balance,
            decimals,
            symbol,
          });
        }
      } catch (e: any) {
        console.error({ e });
      }
    }
    fetchGovernanceToken();
  }, [organization, stxAddress]);

  return {
    isLoading: state.isLoading,
    contractAddress: state.contractAddress,
    contractName: state.contractName,
    balance: state.balance,
    decimals: state.decimals,
    symbol: state.symbol,
  };
}

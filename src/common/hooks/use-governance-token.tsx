// Hook (use-organization.tsx)
import { useEffect, useState } from 'react';

import { useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { standardPrincipalCV } from 'micro-stacks/clarity';

import { useOrganization } from './use-organization';

type VotingExtension = {
  isLoading: boolean;
  contractAddress: string;
  contractName: string;
  votingWeight: number;
};

const initialState = {
  isLoading: true,
  contractAddress: '',
  contractName: '',
  votingWeight: 0,
};

export function useGovernanceToken() {
  // TODO: check if slug is present and return error if not
  // TODO: check if oranization exists before checking balance
  const [state, setState] = useState<VotingExtension>(initialState);
  const { organization } = useOrganization();
  const { network } = useNetwork();
  const currentStxAddress = useCurrentStxAddress();

  useEffect(() => {
    async function fetchGovernanceToken() {
      const governanceToken = organization?.Extensions?.find(
        (extension: any) =>
          extension?.ExtensionTypes?.name === 'Governance Token',
      );
      const contractAddress = governanceToken?.contract_address.split('.')[0];
      const contractName = governanceToken?.contract_address.split('.')[1];
      const senderAddress = currentStxAddress;
      const functionArgs = currentStxAddress
        ? [standardPrincipalCV(currentStxAddress || '')]
        : [];
      const functionName = 'get-voting-weight';
      try {
        if (currentStxAddress) {
          const data: any = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress,
            functionArgs,
            functionName,
          });
          setState({
            ...state,
            isLoading: false,
            contractAddress,
            contractName,
            votingWeight: data.toString(),
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
    votingWeight: state.votingWeight,
  };
}

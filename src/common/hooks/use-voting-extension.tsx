// Hook (use-voting-extension.tsx)
import { useEffect, useState } from 'react';

import { useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { contractPrincipalCV, standardPrincipalCV } from 'micro-stacks/clarity';

type TVotingExtension = {
  isLoading: boolean;
  contractAddress: string;
  contractName: string;
  votingWeight: number;
};

interface IVotingExtension {
  organization?: any;
}

const initialState = {
  isLoading: true,
  contractAddress: '',
  contractName: '',
  votingWeight: 0,
};

export function useVotingExtension({ organization }: IVotingExtension = {}) {
  const [state, setState] = useState<TVotingExtension>(initialState);
  const { network } = useNetwork();
  const currentStxAddress = useCurrentStxAddress();

  useEffect(() => {
    async function fetchVotingExtension() {
      const governanceTokenExtension = organization?.Extensions?.find(
        (extension: any) =>
          extension?.ExtensionTypes?.name === 'Governance Token',
      );
      const tokenContractAddress =
        governanceTokenExtension?.contractAddress?.split('.')[0];
      const tokenContractName =
        governanceTokenExtension?.contractAddress?.split('.')[1];
      const voteExtension = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === 'Voting',
      );
      const contractAddress = voteExtension?.contractAddress?.split('.')[0];
      const contractName = voteExtension?.contractAddress?.split('.')[1];

      const senderAddress = currentStxAddress;
      const functionArgs =
        currentStxAddress && tokenContractAddress && tokenContractName
          ? [
              contractPrincipalCV(
                'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
                'sdp-transfer-stx',
              ),
              standardPrincipalCV(currentStxAddress || ''),
              contractPrincipalCV(tokenContractAddress, tokenContractName),
            ]
          : [];
      const functionName = 'get-current-total-votes';
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
    fetchVotingExtension();
  }, [organization, currentStxAddress]);

  return {
    isLoading: state.isLoading,
    contractAddress: state.contractAddress,
    contractName: state.contractName,
    votingWeight: state.votingWeight,
  };
}

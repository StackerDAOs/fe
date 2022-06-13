// Hook (use-voting-extension.tsx)
import { useEffect, useState } from 'react';

import { useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { contractPrincipalCV, standardPrincipalCV } from 'micro-stacks/clarity';

import { useOrganization } from './use-organization';

type GovernanceTokenExtension = {
  isLoading: boolean;
  contractAddress: string;
  contractName: string;
};

const initialState = {
  isLoading: true,
  contractAddress: '',
  contractName: '',
};

export function useGovernanceTokenExtension() {
  const [state, setState] = useState<GovernanceTokenExtension>(initialState);
  const { organization } = useOrganization();
  const currentStxAddress = useCurrentStxAddress();

  useEffect(() => {
    async function fetchSubmissionExtension() {
      try {
        const submissionExtension = organization?.Extensions?.find(
          (extension: any) =>
            extension?.ExtensionTypes?.name === 'Governance Token',
        );
        const contractAddress =
          submissionExtension?.contract_address.split('.')[0];
        const contractName =
          submissionExtension?.contract_address.split('.')[1];
        setState({ ...state, isLoading: false, contractAddress, contractName });
      } catch (error) {
        console.error({ error });
      } finally {
        console.log('finally');
      }
    }
    fetchSubmissionExtension();
  }, [organization, currentStxAddress]);

  return {
    isLoading: state.isLoading,
    contractAddress: state.contractAddress,
    contractName: state.contractName,
  };
}

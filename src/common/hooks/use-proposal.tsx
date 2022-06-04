// Hook (use-proposal.tsx)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchReadOnlyFunction, fetchContractSource } from 'micro-stacks/api';
import { contractPrincipalCV } from 'micro-stacks/clarity';

import { useOrganization } from './use-organization';

import { pluckSourceCode } from '@common/helpers';

interface IProposal {
  proposal?: Proposal;
}

type Proposal = {
  contractAddress?: string;
  contractName?: string;
};

export function useProposal({ proposal }: IProposal = {}) {
  // TODO: check if slug is present and return error if not
  // TODO: check if oranization exists before checking balance
  const [state, setState] = useState<any>({});
  const router = useRouter();
  const { id: proposalPrincipal } = router.query;
  const { organization } = useOrganization();
  const { network } = useNetwork();
  const currentStxAddress = useCurrentStxAddress();
  const proposalInfo = proposalPrincipal
    ? {
        contractAddress: proposalPrincipal.split('.')[0],
        contractName: proposalPrincipal.split('.')[1],
      }
    : proposal?.contractAddress && proposal?.contractName
    ? {
        contractAddress: proposal?.contractAddress,
        contractName: proposal?.contractName,
      }
    : null;

  useEffect(() => {
    const fetchProposal = async () => {
      const proposalVoting = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === 'Voting',
      );
      const contractAddress = proposalVoting?.contract_address.split('.')[0];
      const contractName = proposalVoting?.contract_address.split('.')[1];
      const senderAddress = currentStxAddress;
      const functionArgs = proposalInfo
        ? [
            contractPrincipalCV(
              proposalInfo.contractAddress,
              proposalInfo.contractName,
            ),
          ]
        : [];

      const functionName = 'get-proposal-data';
      try {
        const proposalData: any = await fetchReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          senderAddress,
          functionArgs,
          functionName,
        });

        const contractSource = await fetchContractSource({
          url: network.getCoreApiUrl(),
          contract_address: proposalPrincipal
            ? proposalInfo?.contractAddress
            : '',
          contract_name: proposalPrincipal ? proposalInfo?.contractName : '',
          proof: 0x0,
          tip: '',
        });

        console.log({ contractSource });
        const { source } = contractSource;
        const title = pluckSourceCode(source, 'title');
        const description = pluckSourceCode(source, 'description');
        const type = pluckSourceCode(source, 'type');
        setState({
          contractAddress: proposalPrincipal
            ? proposalInfo?.contractAddress
            : proposal?.contractAddress,
          contractName: proposalPrincipal
            ? proposalInfo?.contractName
            : proposal?.contractName,
          title,
          description,
          type,
          ...proposalData,
        });
      } catch (e: any) {
        console.log({ e });
      } finally {
        console.log('done');
      }
    };
    fetchProposal();
  }, [organization, router.isReady, currentStxAddress]);

  return { ...state };
}

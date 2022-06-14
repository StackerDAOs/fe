// Hook (use-proposal.tsx)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchReadOnlyFunction, fetchContractSource } from 'micro-stacks/api';
import { contractPrincipalCV, stringAsciiCV } from 'micro-stacks/clarity';

import { useOrganization, useContractEvents } from '../hooks';

import { pluckSourceCode } from '@common/helpers';

interface IProposal {
  contractAddress?: string;
  contractName?: string;
  filterByProposal?: string;
}

export function useProposal({
  contractAddress,
  contractName,
  filterByProposal,
}: IProposal = {}) {
  // TODO: check if slug is present and return error if not
  // TODO: check if oranization exists before checking balance
  const [state, setState] = useState<any>({});
  const router = useRouter();
  const { id: proposalPrincipal } = router.query as any;
  const { organization } = useOrganization();
  const { events: voteEvents } = useContractEvents({
    extensionName: 'Voting',
    filter: 'vote',
    filterByProposal,
  });
  const { network } = useNetwork();
  const currentStxAddress = useCurrentStxAddress();
  const proposalInfo = proposalPrincipal
    ? {
        contractAddress: proposalPrincipal.split('.')[0],
        contractName: proposalPrincipal.split('.')[1],
      }
    : contractAddress && contractName
    ? {
        contractAddress,
        contractName,
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

        const { source } = contractSource;
        const title = pluckSourceCode(source, 'title');
        const description = pluckSourceCode(source, 'description');
        const type = pluckSourceCode(source, 'type');

        const quorumThreshold: any = await fetchReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          senderAddress,
          functionArgs: [stringAsciiCV('quorumThreshold')],
          functionName: 'get-parameter',
        });

        setState({
          contractAddress: proposalPrincipal
            ? proposalInfo?.contractAddress
            : contractAddress,
          contractName: proposalPrincipal
            ? proposalInfo?.contractName
            : contractName,
          title,
          description,
          type,
          events: voteEvents,
          quorumThreshold: quorumThreshold.toString(),
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

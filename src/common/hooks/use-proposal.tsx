// Hook (use-proposal.tsx)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchReadOnlyFunction, fetchContractSource } from 'micro-stacks/api';
import { contractPrincipalCV, stringAsciiCV } from 'micro-stacks/clarity';

import { useContractEvents } from '../hooks';

import { pluckDetails, pluckSourceCode } from '@common/helpers';

interface IProposal {
  organization?: any;
  contractAddress?: string;
  contractName?: string;
  filterByProposal?: string;
}

export function useProposal({
  organization,
  contractAddress,
  contractName,
  filterByProposal,
}: IProposal = {}) {
  const [state, setState] = useState<any>({});
  const router = useRouter();
  const { id: proposalPrincipal } = router.query as any;
  const { events: voteEvents } = useContractEvents({
    organization,
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
      const contractAddress = proposalVoting?.contractAddress?.split('.')[0];
      const contractName = proposalVoting?.contractAddress?.split('.')[1];
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
        console.log({ source });
        const title = pluckSourceCode(source, 'title');
        const description = pluckDetails(source);
        const type = pluckSourceCode(source, 'type');

        const quorumThreshold: any = await fetchReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          senderAddress,
          functionArgs: [stringAsciiCV('quorumThreshold')],
          functionName: 'get-parameter',
        });

        const executionDelay: any = await fetchReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          senderAddress,
          functionArgs: [stringAsciiCV('executionDelay')],
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
          executionDelay: executionDelay.toString(),
          ...proposalData,
        });
      } catch (e: any) {
        console.log({ e });
      } finally {
        console.log('done');
      }
    };
    fetchProposal();
  }, [organization, voteEvents, currentStxAddress]);

  return { ...state };
}

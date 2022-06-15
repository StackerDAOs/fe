// Hook (use-proposals.tsx)
import { useEffect, useState } from 'react';
import { useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchContractSource, fetchReadOnlyFunction } from 'micro-stacks/api';
import { contractPrincipalCV } from 'micro-stacks/clarity';
import { useContractEvents } from '../hooks';
import { pluckSourceCode } from '@common/helpers';

type TProposals = {
  isLoading: boolean;
  proposals: any[];
};

interface IProposals {
  organization?: any;
}

const initialState = {
  isLoading: true,
  proposals: [],
};

export function useProposals({ organization }: IProposals = {}) {
  const [state, setState] = useState<TProposals>(initialState);
  const currentStxAddress = useCurrentStxAddress();
  const { network } = useNetwork();
  const { events: proposalEvents } = useContractEvents({
    organization: organization,
    extensionName: 'Voting',
    filter: 'propose',
  });

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const proposalVoting = organization?.Extensions?.find(
          (extension: any) => extension?.ExtensionTypes?.name === 'Voting',
        );
        async function fetchProposal(proposal: any) {
          const contractAddress =
            proposalVoting?.contract_address.split('.')[0];
          const contractName = proposalVoting?.contract_address.split('.')[1];
          const senderAddress = currentStxAddress;
          const functionArgs = [
            contractPrincipalCV(
              proposal?.proposal?.value.split('.')[0],
              proposal?.proposal?.value.split('.')[1],
            ),
          ];
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
            const contract_address = proposal?.proposal?.value.split('.')[0];
            const contract_name = proposal?.proposal?.value.split('.')[1];
            const contractSource = await fetchContractSource({
              url: network.getCoreApiUrl(),
              contract_address,
              contract_name,
              proof: 0x0,
              tip: '',
            });
            const { source } = contractSource;
            const title = pluckSourceCode(source, 'title');
            const description = pluckSourceCode(source, 'description');
            const type = pluckSourceCode(source, 'type');
            return {
              contractAddress: proposal?.proposal?.value,
              title,
              description,
              type,
              ...proposalData,
            };
          } catch (e: any) {
            console.log({ e });
          } finally {
            console.log('done');
          }
        }
        const proposals = proposalEvents.map((proposal: any) => {
          return fetchProposal(proposal);
        });
        const final = await Promise.all(proposals);
        setState({ ...state, isLoading: false, proposals: final });
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
      }
    };
    fetchProposals();
  }, [organization, proposalEvents]);

  return { isLoading: state.isLoading, proposals: state.proposals };
}

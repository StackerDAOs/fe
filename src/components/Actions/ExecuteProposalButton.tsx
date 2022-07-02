import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCurrentStxAddress, useNetwork } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { supabase } from '@utils/supabase';
import { contractPrincipalCV } from 'micro-stacks/clarity';
import { ContractCallButton } from '@widgets/ContractCallButton';
import { generatePostConditions } from '@common/functions';
import { tokenToNumber } from '@common/helpers';
import { useOrganization, useGovernanceToken } from '@common/hooks';

type TProposal = {
  postConditions?: any;
  assetName?: string;
};

export const ExecuteProposalButton = ({
  proposalContractAddress,
  proposalContractName,
  votingData,
  contractAddress,
  contractName,
}: any) => {
  const [state, setState] = useState<TProposal>({ postConditions: [] });
  const currentStxAddress = useCurrentStxAddress();
  const router = useRouter();
  const { dao } = router.query as any;
  const { network } = useNetwork();
  const { organization } = useOrganization({ name: dao });
  const { decimals } = useGovernanceToken({ organization });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('Proposals')
          .select('postConditions')
          .eq(
            'contractAddress',
            `${proposalContractAddress}.${proposalContractName}`,
          );
        if (error) throw error;
        if (data) {
          if (data[0].postConditions) {
            // Post Conditions are either for STX or for Tokens
            if (data[0].postConditions?.asset) {
              setState({
                ...state,
                postConditions: data[0].postConditions,
              });
            } else if (data[0].postConditions?.assetAddress) {
              const [contractAddress, contractName] =
                data[0].postConditions.assetAddress.split('.');
              const assetName: any = await fetchReadOnlyFunction({
                network,
                contractAddress,
                contractName,
                senderAddress: currentStxAddress,
                functionArgs: [],
                functionName: 'get-name',
              });
              setState({
                ...state,
                postConditions: data[0].postConditions,
                assetName,
              });
            }
          } else {
            setState({ ...state, postConditions: data[0].postConditions });
          }
        }
      } catch (e: any) {
        console.error({ e });
      }
    };
    fetchData();
  }, [proposalContractAddress]);
  const { postConditions: pc, assetName } = state;
  const { votesFor, votesAgainst, totalVotes, quorumThreshold } = votingData;

  const convertedVotesFor = tokenToNumber(Number(votesFor), Number(decimals));
  const convertedVotesAgainst = tokenToNumber(
    Number(votesAgainst),
    Number(decimals),
  );
  const convertedTotalVotes = tokenToNumber(
    Number(totalVotes),
    Number(decimals),
  );
  const isPassing =
    convertedVotesFor > convertedVotesAgainst &&
    convertedTotalVotes >= Number(quorumThreshold);

  const functionName = 'conclude';
  const functionArgs = proposalContractAddress &&
    proposalContractName && [
      contractPrincipalCV(proposalContractAddress, proposalContractName),
    ];
  const postConditions = generatePostConditions({
    postConditions: pc,
    isPassing,
    assetName,
  });

  const concludeProposal = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  };

  return (
    <ContractCallButton
      title={isPassing ? 'Execute' : 'Conclude'}
      color='white'
      bg='secondary.900'
      isFullWidth
      disabled={false}
      _disabled={{
        bg: 'secondary.900',
        opacity: 0.5,
        cursor: 'not-allowed',
        _hover: {
          bg: 'secondary.900',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      }}
      {...concludeProposal}
    />
  );
};

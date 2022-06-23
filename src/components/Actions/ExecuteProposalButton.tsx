import { useEffect, useState } from 'react';
import { useCurrentStxAddress } from '@micro-stacks/react';
import { supabase } from '@utils/supabase';
import { contractPrincipalCV } from 'micro-stacks/clarity';
import { ContractCallButton } from '@widgets/ContractCallButton';
import { generatePostConditions } from '@common/functions';
import { tokenToNumber } from '@common/helpers';

type TProposal = {
  postConditions?: any;
};

export const ExecuteProposalButton = ({
  proposalContractAddress,
  proposalContractName,
  votingData,
  contractAddress,
  contractName,
}: any) => {
  const [state, setState] = useState<TProposal>({ postConditions: [] });

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
        console.log({ proposalContractAddress });
        console.log({ proposalContractName });
        if (error) throw error;
        if (data) {
          console.log({ data });
          setState({ ...state, postConditions: data[0].postConditions });
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        console.log('finally');
      }
    };
    fetchData();
  }, [proposalContractAddress]);

  const { votesFor, votesAgainst, totalVotes, quorumThreshold } = votingData;

  const convertedVotesFor = tokenToNumber(Number(votesFor), 2);
  const convertedVotesAgainst = tokenToNumber(Number(votesAgainst), 2);
  const convertedTotalVotes = tokenToNumber(Number(totalVotes), 2);
  const isPassing =
    convertedVotesFor > convertedVotesAgainst &&
    convertedTotalVotes >= Number(quorumThreshold);

  const functionName = 'conclude';
  const functionArgs = proposalContractAddress &&
    proposalContractName && [
      contractPrincipalCV(proposalContractAddress, proposalContractName),
    ];
  const postConditions = generatePostConditions({
    postConditions: state.postConditions,
    isPassing,
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
      title={'Execute'}
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

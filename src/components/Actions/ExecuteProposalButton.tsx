import { useEffect, useState } from 'react';
import { useCurrentStxAddress, useNetwork } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { supabase } from '@utils/supabase';
import { contractPrincipalCV } from 'micro-stacks/clarity';
import { ContractCallButton } from '@widgets/ContractCallButton';
import { generatePostConditions } from '@common/functions';
import { tokenToNumber } from '@common/helpers';

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
  const { network } = useNetwork();

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
            if (data[0].postConditions?.assetAddress) {
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
      } catch (error) {
        console.log('error', error);
      } finally {
        console.log('finally');
      }
    };
    fetchData();
  }, [proposalContractAddress]);
  const { postConditions: pc, assetName } = state;
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
    postConditions: pc,
    isPassing,
    assetName,
  });

  console.log({ postConditions });

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

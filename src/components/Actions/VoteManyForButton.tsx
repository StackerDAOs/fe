import { useCurrentStxAddress } from '@micro-stacks/react';
import { size } from 'lodash';
import {
  trueCV,
  contractPrincipalCV,
  listCV,
  tupleCV,
  noneCV,
} from 'micro-stacks/clarity';
import { ContractCallButton } from '@widgets/ContractCallButton';
import { generateWithDelegators, getDelegators } from '@common/functions';

export const VoteManyForButton = ({
  proposalContractAddress,
  proposalContractName,
  delegatorEvents,
  contractAddress,
  contractName,
}: any) => {
  const currentStxAddress = useCurrentStxAddress();
  const currentVoterDelegators = delegatorEvents?.filter(
    (item: any) => item?.who?.value === currentStxAddress,
  );
  const delegateVoteFor =
    proposalContractAddress &&
    proposalContractName &&
    listCV([
      tupleCV({
        for: trueCV(),
        proposal: contractPrincipalCV(
          proposalContractAddress,
          proposalContractName,
        ),
        delegator: noneCV(),
      }),
    ]);

  const delegators = getDelegators({
    voteFor: true,
    proposalContractAddress,
    proposalContractName,
    currentVoterDelegators,
  });
  const hasDelegators = size(delegators) > 0;

  const functionArgs = hasDelegators
    ? [
        listCV(
          generateWithDelegators({
            voteFor: true,
            proposalContractAddress,
            proposalContractName,
            delegators,
          }),
        ),
      ]
    : [delegateVoteFor];

  const functionName = 'vote-many';
  const postConditions: any = [];

  const voteFor = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  };

  return (
    <ContractCallButton
      title={'Approve'}
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
      {...voteFor}
    />
  );
};

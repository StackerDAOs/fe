import { useCurrentStxAddress } from '@micro-stacks/react';
import { size } from 'lodash';
import {
  falseCV,
  contractPrincipalCV,
  listCV,
  tupleCV,
  noneCV,
} from 'micro-stacks/clarity';
import { ContractCallButton } from '@widgets/ContractCallButton';
import { generateWithDelegators, getDelegators } from '@common/functions';

export const VoteManyAgainstButton = ({
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
  const delegateVoteAgainst =
    proposalContractAddress &&
    proposalContractName &&
    listCV([
      tupleCV({
        for: falseCV(),
        proposal: contractPrincipalCV(
          proposalContractAddress,
          proposalContractName,
        ),
        delegator: noneCV(),
      }),
    ]);

  const delegators = getDelegators({
    voteFor: false,
    proposalContractAddress,
    proposalContractName,
    currentVoterDelegators,
  });
  const hasDelegators = size(delegators) > 0;

  const functionArgs = hasDelegators
    ? [
        listCV(
          generateWithDelegators({
            voteFor: false,
            proposalContractAddress,
            proposalContractName,
            delegators,
          }),
        ),
      ]
    : [delegateVoteAgainst];

  const functionName = 'vote-many';
  const postConditions: any = [];

  const voteAgainst = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  };

  return (
    <ContractCallButton
      title={'Reject'}
      color='white'
      bg='base.800'
      isFullWidth
      disabled={false}
      _disabled={{
        bg: 'base.800',
        opacity: 0.5,
        cursor: 'not-allowed',
        _hover: {
          bg: 'base.800',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      }}
      {...voteAgainst}
    />
  );
};

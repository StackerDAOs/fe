import React from 'react';
import type { ButtonProps } from '@chakra-ui/react';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { useOpenContractCall } from '@micro-stacks/react';
import {
  trueCV,
  falseCV,
  contractPrincipalCV,
  listCV,
  tupleCV,
  noneCV,
} from 'micro-stacks/clarity';
import { TxToast } from '@components/Toast';
import { generateWithDelegators, getDelegators } from 'lib/functions';
import { useDelegates, useExtension, useTransaction } from '@common/hooks';

import { useVoteFor, useVoteAgainst } from '@common/mutations/votes';

// utils
import { map, size } from 'lodash';
import { contractPrincipal, getExplorerLink } from '@common/helpers';
import { FaCheck } from 'react-icons/fa';

type TVoteManyButtonProps = ButtonProps & {
  text: string;
  proposalPrincipal: string;
  voteFor: boolean;
};

export const VoteManyButton = (props: TVoteManyButtonProps) => {
  const toast = useToast();
  const { text, proposalPrincipal, voteFor } = props;
  const [transactionId, setTransactionId] = React.useState('');
  const { data: voting } = useExtension('Voting');
  const { data: transaction } = useTransaction(transactionId);
  const { data: delegatorData } = useDelegates();
  const { openContractCall, isRequestPending } = useOpenContractCall();
  const [proposalContractAddress, proposalContractName] =
    contractPrincipal(proposalPrincipal);
  const { mutate: voteForMutation } = useVoteFor();
  const { mutate: voteAgainstMutation } = useVoteAgainst();

  const updateVote: any = async () => {
    try {
      if (voteFor) {
        await voteForMutation({ proposalPrincipal, amount: 1000000 });
      } else {
        await voteAgainstMutation({ proposalPrincipal, amount: 1000000 });
      }
    } catch (e: any) {
      console.error({ e });
    }
  };

  const handleVote = React.useCallback(async () => {
    const delegatorAddresses = map(delegatorData, 'delegatorAddress');
    const delegateVote = listCV([
      tupleCV({
        for: voteFor ? trueCV() : falseCV(),
        proposal: contractPrincipalCV(
          proposalContractAddress,
          proposalContractName,
        ),
        delegator: noneCV(),
      }),
    ]);
    const delegators = getDelegators({
      voteFor,
      proposalContractAddress,
      proposalContractName,
      delegatorAddresses,
    });
    const hasDelegators = size(delegators) > 0;
    const functionArgs = hasDelegators
      ? [
          listCV(
            generateWithDelegators({
              voteFor,
              proposalContractAddress,
              proposalContractName,
              delegators,
            }),
          ),
        ]
      : [delegateVote];
    const [contractAddress, contractName] = contractPrincipal(
      voting?.contractAddress,
    );
    const functionName = 'vote-many';
    const postConditions: any = [];

    await openContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      postConditions,
      onFinish,
      onCancel: () => {
        console.log('Cancelled vote');
      },
    });
  }, [proposalPrincipal, delegatorData]);

  const decisionText = voteFor ? 'approve' : 'reject';
  const onFinish = async (data: any) => {
    updateVote();
    setTransactionId(data.txId);
    toast({
      duration: 5000,
      position: 'bottom-right',
      isClosable: true,
      render: () => (
        <TxToast
          message='Transaction submitted'
          body={`Your vote to ${decisionText} has been submitted`}
          url={getExplorerLink(data.txId)}
          closeAll={toast.closeAll}
        />
      ),
    });
  };

  const isPending = transaction?.tx_status === 'pending';
  const isSuccessful = transaction?.tx_status === 'success';
  const isDisabled = isRequestPending || isPending || isSuccessful || true;

  return (
    <Button {...props} onClick={handleVote} disabled={isDisabled}>
      {isPending ? (
        <Spinner size='xs' />
      ) : isSuccessful ? (
        <FaCheck fontSize='1rem' color='light.900' />
      ) : (
        text
      )}
    </Button>
  );
};

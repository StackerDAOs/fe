import React from 'react';
import type { ButtonProps } from '@chakra-ui/react';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { map, size } from 'lodash';
import { useOpenContractCall } from '@micro-stacks/react';
import {
  falseCV,
  contractPrincipalCV,
  listCV,
  tupleCV,
  noneCV,
} from 'micro-stacks/clarity';
import { TxToast } from '@components/feedback';
import { generateWithDelegators, getDelegators } from 'lib/functions';
import { useDelegates, useExtension, useTransaction } from '@common/hooks';
import { contractPrincipal, getExplorerLink } from '@common/helpers';

export const VoteAgainstButton = (props: ButtonProps & any) => {
  const toast = useToast();
  const { text, proposalPrincipal, voteFor } = props;
  const [transactionId, setTransactionId] = React.useState('');
  const { data: voting } = useExtension('Voting');
  const { data: transaction } = useTransaction(transactionId);
  const { data: delegatorData } = useDelegates();
  const { openContractCall, isRequestPending } = useOpenContractCall();
  const [proposalContractAddress, proposalContractName] =
    contractPrincipal(proposalPrincipal);
  const handleVoteAgainst = React.useCallback(async () => {
    const delegatorAddresses = map(delegatorData, 'delegatorAddress');
    const delegateVoteFor = listCV([
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
      : [delegateVoteFor];
    const [contractAddress, contractName] = voting?.contractAddress.split('.');
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
        console.log('popup closed!');
      },
    });
  }, [proposalPrincipal]);

  const onFinish = async (data: any) => {
    setTransactionId(data.txId);
    toast({
      duration: 5000,
      position: 'bottom-right',
      isClosable: true,
      render: () => (
        <TxToast
          message='Transaction submitted'
          body='Your vote to reject the proposal has been submitted'
          url={getExplorerLink(data.txId)}
          closeAll={toast.closeAll}
        />
      ),
    });
  };

  const isPending = transaction?.tx_status === 'pending';
  const isSuccessful = transaction?.tx_status === 'success';
  const isDisabled = isRequestPending || isPending || isSuccessful;

  return (
    <Button
      {...props}
      onClick={handleVoteAgainst}
      disabled={isDisabled}
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
    >
      {isPending ? <Spinner size='xs' /> : isSuccessful ? `Rejected` : text}
    </Button>
  );
};

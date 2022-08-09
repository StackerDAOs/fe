import React from 'react';
import type { ButtonProps } from '@chakra-ui/react';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { useOpenContractCall } from '@micro-stacks/react';
import { uintCV, contractPrincipalCV } from 'micro-stacks/clarity';
import { TxToast } from '@components/Toast';
import { useBlocks } from '@common/hooks';
import {
  useExtension,
  useSubmissionExtension,
  useTransaction,
} from '@common/hooks';

// Mutations
import { useSubmitProposal } from '@common/mutations/proposals';

// utils
import { contractPrincipal, getExplorerLink } from '@common/helpers';
import { FaCheck } from 'react-icons/fa';

type TProposeButtonProps = ButtonProps & {
  text: string;
  proposalPrincipal: string;
  notDeployer: boolean;
};

export const ProposeButton = (props: TProposeButtonProps) => {
  const toast = useToast();
  const { text, notDeployer, proposalPrincipal } = props;
  const [transactionId, setTransactionId] = React.useState('');
  const { currentBlockHeight } = useBlocks();
  const { data: submission } = useExtension('Submission');
  const { data: governance } = useExtension('Governance Token');
  const { data: submissionData } = useSubmissionExtension();
  const { data: transaction } = useTransaction(transactionId);
  const { openContractCall, isRequestPending } = useOpenContractCall();
  const { mutate: submitProposal } = useSubmitProposal();
  const startBlockHeight =
    currentBlockHeight + Number(submissionData?.minimumProposalStartDelay) + 25;
  const endBlockHeight =
    startBlockHeight + Number(submissionData?.proposalDuration);

  const onFinishUpdate = async () => {
    try {
      submitProposal({
        contractAddress: proposalPrincipal,
        startBlockHeight,
        endBlockHeight,
        submitted: true,
      });
    } catch (e: any) {
      console.error({ e });
    }
  };

  const handleVote = React.useCallback(async () => {
    const [contractAddress, contractName] = contractPrincipal(
      submission?.contractAddress,
    );
    const [governanceContractAddress, governanceContractName] =
      contractPrincipal(governance?.contractAddress);
    const [proposalContractAddress, proposalContractName] =
      contractPrincipal(proposalPrincipal);

    const functionArgs = [
      contractPrincipalCV(proposalContractAddress, proposalContractName),
      uintCV(startBlockHeight),
      contractPrincipalCV(governanceContractAddress, governanceContractName),
    ];
    const functionName = 'propose';
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
  }, [
    proposalPrincipal,
    submission,
    governance,
    currentBlockHeight,
    startBlockHeight,
    endBlockHeight,
  ]);

  const onFinish = async (data: any) => {
    onFinishUpdate();
    setTransactionId(data.txId);
    toast({
      duration: 5000,
      position: 'bottom-right',
      isClosable: true,
      render: () => (
        <TxToast
          message='Transaction submitted'
          body={`Your proposal has been submitted`}
          url={getExplorerLink(data.txId)}
          closeAll={toast.closeAll}
        />
      ),
    });
  };

  const isPending = transaction?.tx_status === 'pending';
  const isSuccessful = transaction?.tx_status === 'success';
  const isDisabled =
    isRequestPending || isPending || isSuccessful || notDeployer;

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

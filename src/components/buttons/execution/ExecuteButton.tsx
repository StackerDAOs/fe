import React from 'react';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { useOpenContractCall } from '@micro-stacks/react';
import { contractPrincipalCV } from 'micro-stacks/clarity';
import { TxToast } from '@components/feedback';
import { generatePostConditions } from '@lib/functions';
import { defaultTo } from 'lodash';
import {
  contractPrincipal,
  getExplorerLink,
  tokenToNumber,
} from '@common/helpers';
import {
  useExtension,
  useFungibleToken,
  useToken,
  useTransaction,
  useProposal,
  usePostConditions,
} from '@lib/hooks';
import { useConcludeProposal } from '@lib/mutations/proposals';
import { FaCheck } from 'react-icons/fa';
import { ExecuteProposalProps } from '../types';

export const ExecuteButton = (props: ExecuteProposalProps) => {
  const toast = useToast();
  const { proposalPrincipal } = props;
  const [transactionId, setTransactionId] = React.useState('');
  const { token } = useToken();
  const { data: voting } = useExtension('Voting');
  const { data: transaction } = useTransaction(transactionId);
  const [proposalContractAddress, proposalContractName] =
    contractPrincipal(proposalPrincipal);
  const { isLoading, data } = useProposal(proposalPrincipal);
  const { data: conditions } = usePostConditions(proposalPrincipal);
  const [contractAddress, contractName] = contractPrincipal(
    voting?.contractAddress,
  );
  const { openContractCall, isRequestPending } = useOpenContractCall();
  const { data: fungibleToken } = useFungibleToken(
    conditions?.postConditions?.assetAddress,
  );
  const { mutate: concludeProposal } = useConcludeProposal();

  const onFinishInsert: any = async () => {
    try {
      concludeProposal({
        contractAddress: proposalPrincipal,
      });
    } catch (e: any) {
      console.error({ e });
    }
  };

  const handleExecute = React.useCallback(async () => {
    const { votesFor, votesAgainst } = data?.proposal;
    const fungibleTokenDecimals = defaultTo(fungibleToken?.decimals, 6);
    const totalVotes = Number(votesFor) + Number(votesAgainst);
    const convertedVotesFor = tokenToNumber(
      Number(votesFor),
      Number(token?.decimals),
    );
    const convertedVotesAgainst = tokenToNumber(
      Number(votesAgainst),
      Number(token?.decimals),
    );
    const convertedTotalVotes = tokenToNumber(
      Number(totalVotes),
      Number(token?.decimals),
    );
    const isPassing =
      convertedVotesFor > convertedVotesAgainst &&
      convertedTotalVotes >= Number(data?.quorumThreshold);

    const functionName = 'conclude';
    const functionArgs = [
      contractPrincipalCV(proposalContractAddress, proposalContractName),
    ];
    const postConditions = generatePostConditions({
      postConditions: conditions?.postConditions,
      isPassing,
      assetName: conditions?.postConditions?.assetName,
      fungibleTokenDecimals,
    });

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
  }, [conditions, fungibleToken]);

  const onFinish = async (data: any) => {
    onFinishInsert();
    setTransactionId(data.txId);
    toast({
      duration: 5000,
      position: 'bottom-right',
      isClosable: true,
      render: () => (
        <TxToast
          message='Transaction submitted'
          body={`Proposal execution has been submitted successfully`}
          url={getExplorerLink(data.txId)}
          closeAll={toast.closeAll}
        />
      ),
    });
  };

  const isPending = transaction?.tx_status === 'pending';
  const isSuccessful = transaction?.tx_status === 'success';
  const isDisabled = isRequestPending || isPending || isSuccessful;

  if (isLoading) {
    return null;
  }

  return (
    <Button {...props} onClick={handleExecute} disabled={isDisabled}>
      {isPending ? (
        <Spinner size='xs' />
      ) : isSuccessful ? (
        <FaCheck fontSize='1rem' color='light.900' />
      ) : (
        'Execute'
      )}
    </Button>
  );
};

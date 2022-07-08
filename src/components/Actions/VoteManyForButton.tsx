import { useState } from 'react';
import {
  Button,
  ButtonGroup,
  CloseButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { map, size } from 'lodash';
import {
  trueCV,
  contractPrincipalCV,
  listCV,
  tupleCV,
  noneCV,
} from 'micro-stacks/clarity';
import { ContractCallButton } from '@widgets/ContractCallButton';
import { generateWithDelegators, getDelegators } from '@common/functions';
import { Notification } from '@components/Notification';
import { useTransaction } from '@common/queries';

export const VoteManyForButton = ({
  proposalContractAddress,
  proposalContractName,
  delegatorData,
  contractAddress,
  contractName,
}: any) => {
  const toast = useToast();
  const [transactionId, setTransactionId] = useState('');
  const { data: transaction } = useTransaction(transactionId);
  const delegatorAddresses = map(delegatorData, 'delegatorAddress');
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
    delegatorAddresses,
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

  const onFinish: any = async (data: any) => {
    setTransactionId(data.txId);
    try {
      toast({
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
        render: () => (
          <Notification>
            <Stack direction='row' p='4' spacing='3'>
              <Stack spacing='2.5'>
                <Stack spacing='1'>
                  <Text fontSize='md' color='light.900' fontWeight='medium'>
                    Transaction Submitted
                  </Text>
                  <Text fontSize='sm' color='gray.900'>
                    Your transaction was submitted successfully.
                  </Text>
                </Stack>
                <ButtonGroup variant='link' size='sm' spacing='2'>
                  <Button
                    color='secondary.900'
                    as='a'
                    target='_blank'
                    href={
                      process.env.NODE_ENV !== 'production'
                        ? `http://localhost:8000/txid/${data.txId}?chain=testnet`
                        : `https://explorer.stacks.co/txid/${data.txId}?chain=mainnet`
                    }
                  >
                    View transaction
                  </Button>
                </ButtonGroup>
              </Stack>
              <CloseButton
                aria-label='close'
                transform='translateY(-6px)'
                color='white'
                onClick={() => toast.closeAll()}
              />
            </Stack>
          </Notification>
        ),
      });
    } catch (e: any) {
      console.error({ e });
    }
  };

  const voteFor = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
    onFinish,
  };

  return (
    <ContractCallButton
      title={'Approve'}
      color='white'
      bg='secondary.900'
      isFullWidth
      disabled={transaction?.tx_status === 'pending'}
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

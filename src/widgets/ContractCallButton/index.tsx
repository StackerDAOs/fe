import { useState, useCallback } from 'react';
import {
  Button,
  ButtonProps,
  ButtonGroup,
  Stack,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';

// Stacks
import type { FinishedTxData } from 'micro-stacks/connect';
import { StacksTestnet } from 'micro-stacks/network';
import { useNetwork, useContractCall } from '@micro-stacks/react';
import { fetchTransaction } from 'micro-stacks/api';

// Hooks
import { usePolling } from '@common/hooks/use-polling';

// Components
import { Notification } from '@components/Notification';
import { CloseButton } from '@components/CloseButton';

type ContractCallType = {
  title: string;
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  postConditions?: any[];
  onContractCall?: () => void;
};

export const ContractCallButton = (props: ButtonProps & ContractCallType) => {
  const { network } = useNetwork();
  const toast = useToast();
  const [transaction, setTransaction] = useState({
    txId: '',
    isPending: false,
  });

  usePolling(() => {
    fetchTransactionData(transaction.txId);
  }, transaction.isPending);

  async function fetchTransactionData(transactionId: string) {
    try {
      const transaction = await fetchTransaction({
        url: network.getCoreApiUrl(),
        txid: transactionId,
        event_offset: 0,
        event_limit: 0,
      });
      console.log({ transaction });
      if (transaction?.tx_status === 'success') {
        setTransaction({
          txId: '',
          isPending: false,
        });
        onComplete(transaction);
      }
    } catch (e: any) {
      console.log({ e });
    }
  }

  const {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
    onContractCall,
  } = props;

  const onFinish = useCallback((data: FinishedTxData) => {
    setTransaction({ txId: data.txId, isPending: true });
    toast({
      duration: 7500,
      isClosable: true,
      position: 'top-right',
      render: () => (
        <Notification>
          <Stack direction='row' p='4' spacing='3'>
            <Stack spacing='2.5'>
              <Stack spacing='1'>
                <Text fontSize='md' color='light.900' fontWeight='medium'>
                  Transaction Submitted
                </Text>
                <Text fontSize='sm' color='gray.900'>
                  Your transaction was successfully submitted.
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
  }, []);

  const onComplete = useCallback((data: FinishedTxData) => {
    if (onContractCall) {
      onContractCall();
    }
    toast({
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      render: () => (
        <Notification>
          <Stack direction='row' p='4' spacing='3'>
            <Stack spacing='2.5'>
              <Stack spacing='1'>
                <Text fontSize='md' color='light.900' fontWeight='medium'>
                  Transaction Minted
                </Text>
                <Text fontSize='sm' color='gray.900'>
                  Your transaction was minted successfully.
                </Text>
              </Stack>
              <ButtonGroup variant='link' size='sm' spacing='2'>
                <Button
                  color='secondary.900'
                  as='a'
                  target='_blank'
                  href={
                    process.env.NODE_ENV !== 'production'
                      ? `http://localhost:8000/txid/${data.tx_id}?chain=testnet`
                      : `https://explorer.stacks.co/txid/${data.tx_id}?chain=mainnet`
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
  }, []);

  const { handleContractCall, isLoading } = useContractCall({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
    onFinish,
  });

  return (
    <Button
      {...props}
      type='submit'
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
      onClick={transaction?.isPending ? null : () => handleContractCall()}
    >
      {isLoading ? (
        <Spinner />
      ) : transaction?.isPending ? (
        <Spinner size='xs' />
      ) : (
        props.title
      )}
    </Button>
  );
};

import { useState, useCallback } from 'react';
import {
  Button,
  ButtonProps,
  ButtonGroup,
  Stack,
  Spinner,
  Text,
  useToast,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Stacks
import type { FinishedTxData } from 'micro-stacks/connect';
import { StacksTestnet } from 'micro-stacks/network';
import { useContractCall } from '@micro-stacks/react';
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
};

export const ContractCallButton = (props: ButtonProps & ContractCallType) => {
  const network = new StacksTestnet();
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
        onComplete();
      }
    } catch (e: any) {
      console.log({ e });
    }
  }

  const onFinish = useCallback((data: FinishedTxData) => {
    console.log({ data });
    setTransaction({ txId: data.txId, isPending: true });
    toast({
      duration: null,
      isClosable: true,
      position: 'top-right',
      render: () => (
        <Notification>
          <Stack direction='row' p='4' spacing='3'>
            <Stack spacing='2.5'>
              <Stack spacing='1'>
                <Text
                  fontSize='md'
                  color={mode('light.900', 'base.900')}
                  fontWeight='medium'
                >
                  Transaction Submitted
                </Text>
                <Text fontSize='sm' color={mode('light.700', 'light.200')}>
                  Your transaction has been submitted.
                </Text>
              </Stack>
              <ButtonGroup variant='link' size='md' spacing='3'>
                <Button
                  bgGradient='linear(to-br, primaryGradient.900, primary.900)'
                  bgClip='text'
                  as='a'
                  target='_blank'
                  href={`https://explorer.stacks.co/txid/0x5171834b43bfcdf841d0cc91e13fb78243f677574f7f4060fe5092579e4904f7?chain=testnet/${data.txId}`}
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

  const onComplete = useCallback(() => {
    toast({
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      render: () => (
        <Notification>
          <Stack direction='row' p='4' spacing='3'>
            <Stack spacing='2.5'>
              <Stack spacing='1'>
                <Text
                  fontSize='md'
                  color={mode('light.900', 'base.900')}
                  fontWeight='medium'
                >
                  Transaction confirmed
                </Text>
                <Text fontSize='sm' color={mode('light.700', 'light.200')}>
                  Your transaction has been confirmed.
                </Text>
              </Stack>
              <ButtonGroup variant='link' size='md' spacing='3'>
                <Button
                  bgGradient='linear(to-br, primaryGradient.900, primary.900)'
                  bgClip='text'
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

  const {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  } = props;

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
      onClick={() => handleContractCall()}
    >
      {isLoading ? <Spinner /> : props.title}
    </Button>
  );
};

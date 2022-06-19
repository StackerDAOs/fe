import { useState, useCallback } from 'react';
import { supabase } from '@utils/supabase';
import {
  Button,
  ButtonGroup,
  ButtonProps,
  Stack,
  Spinner,
  Text,
  useToast,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Stacks
import type { FinishedTxData } from 'micro-stacks/connect';
import { useNetwork, useContractDeploy } from '@micro-stacks/react';
import { fetchTransaction } from 'micro-stacks/api';

// Hooks
import { usePolling } from '@common/hooks/use-polling';

// Components
import { Notification } from '@components/Notification';
import { CloseButton } from '@components/CloseButton';

type ContractDeployType = {
  title?: string;
  codeBody: string;
  contractName: string;
  onContractCall?: () => void;
};

export const ContractDeployButton = (
  props: ButtonProps & ContractDeployType,
) => {
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
        event_limit: 1,
      });
      console.log({ transaction });
      if (transaction?.tx_status === 'success') {
        setTransaction({
          txId: '',
          isPending: false,
        });
        onComplete(transaction);
      } else if (transaction?.tx_status === 'abort_by_response') {
        setTransaction({
          txId: '',
          isPending: false,
        });
        onError();
      }
    } catch (e: any) {
      console.log({ e });
    }
  }

  const { title, contractName, codeBody, onContractCall } = props;

  const onFinish = useCallback((data: FinishedTxData) => {
    if (onContractCall) {
      onContractCall();
    }
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
                <Text
                  fontSize='md'
                  color={mode('light.900', 'base.900')}
                  fontWeight='medium'
                >
                  Transaction Submitted
                </Text>
                <Text fontSize='sm' color={mode('light.700', 'light.200')}>
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
    // if (onContractCall) {
    //   onContractCall();
    // }
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

  const onError = useCallback(() => {
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
                  Transaction failed
                </Text>
                <Text fontSize='sm' color={mode('light.700', 'light.200')}>
                  Your transaction has failed.
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

  const { handleContractDeploy, isLoading } = useContractDeploy({
    codeBody,
    contractName,
    onFinish,
  });

  return (
    <Button
      {...props}
      type='submit'
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
      onClick={() => handleContractDeploy()}
    >
      {isLoading ? <Spinner /> : title || 'Deploy'}
    </Button>
  );
};

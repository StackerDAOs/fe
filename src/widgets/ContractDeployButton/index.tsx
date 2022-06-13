import { useState, useCallback } from 'react';
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

// Store
import { useStore as useCommunityStepStore } from 'store/CommunityStepStore';

// Stacks
import type { FinishedTxData } from 'micro-stacks/connect';
import { StacksTestnet } from 'micro-stacks/network';
import { useContractDeploy, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchTransaction } from 'micro-stacks/api';

// Hooks
import { usePolling } from '@common/hooks/use-polling';
import { useOrganization, useCreateRecord } from '@common/hooks';

// Components
import { Notification } from '@components/Notification';
import { CloseButton } from '@components/CloseButton';

type ContractDeployType = {
  title?: string;
  codeBody: string;
  contractName: string;
};

export const ContractDeployButton = (
  props: ButtonProps & ContractDeployType,
) => {
  const network = new StacksTestnet();
  const toast = useToast();
  const { currentStep, setStep } = useCommunityStepStore();
  const [transaction, setTransaction] = useState({
    txId: '',
    isPending: false,
  });
  const { organization } = useOrganization();
  const currentStxAddress = useCurrentStxAddress();

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
        setStep(currentStep + 1);
        onComplete();
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

  const onFinish = useCallback((data: FinishedTxData) => {
    const { attributes } = useCreateRecord({
      tableName: 'proposals',
      attributes: {
        organization_id: organization.id,
        transactionId: data.txId,
        contractAddress: contractName,
        submittedBy: currentStxAddress,
      },
    });
    console.log({ attributes });
    setTransaction({ txId: data.txId, isPending: true });
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

  const onCancel = useCallback(() => {
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
                  Transaction cancelled
                </Text>
                <Text fontSize='sm' color={mode('light.700', 'light.200')}>
                  Your transaction has been cancelled.
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

  const { title, contractName, codeBody } = props;
  const { handleContractDeploy, isLoading } = useContractDeploy({
    codeBody,
    contractName,
    onFinish,
    onCancel,
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

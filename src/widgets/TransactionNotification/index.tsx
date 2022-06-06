import {
  Button,
  ButtonGroup,
  Stack,
  Text,
  useToast,
  useColorModeValue as mode,
} from '@chakra-ui/react';

import type { FinishedTxData } from 'micro-stacks/connect';

import { Notification } from '@components/Notification';
import { CloseButton } from '@components/CloseButton';

export const onFinish = async (data: FinishedTxData) => {
  const toast = useToast();
  toast({
    duration: 5000,
    isClosable: true,
    position: 'bottom-right',
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
};

export const onCancel = () => {
  toast({
    duration: 5000,
    isClosable: true,
    position: 'bottom-right',
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
};

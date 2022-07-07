import { useCallback } from 'react';
import { Button, ButtonGroup, Stack, Text, useToast } from '@chakra-ui/react';
import { Notification } from '@components/Notification';
import { CloseButton } from '@components/CloseButton';

// import { useSubmitProposal } from '@common/mutations/proposals';

// const { mutate: submitProposal } = useSubmitProposal();

// const onFinishUpdate = async (contractAddress: string) => {
//   try {
//     submitProposal({ contractAddress, submitted: true });
//   } catch (e: any) {
//     console.error({ e });
//   }
// };

export const onFinish = useCallback((data: any) => {
  const toast = useToast();
  toast({
    duration: null,
    isClosable: false,
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
}, []);

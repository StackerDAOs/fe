import { useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  ButtonProps,
  Stack,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';

// Stacks
import { useContractDeploy } from '@micro-stacks/react';

// Components
import { Notification } from '@components/Notification';
import { CloseButton } from '@components/CloseButton';

// Store
import { useStore } from 'store/TransactionStore';

type ContractDeployType = {
  title?: string;
  codeBody: string;
  contractName: string;
  onContractCall?: (data: any) => void;
};

export const ContractDeployButton = (
  props: ButtonProps & ContractDeployType,
) => {
  const { setTransaction } = useStore();
  const toast = useToast();
  const { title, contractName, codeBody, onContractCall } = props;

  const onFinish = useCallback((data: any) => {
    if (onContractCall) {
      onContractCall(data);
    }
    setTransaction(data);
    toast({
      duration: 3500,
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
  }, []);

  // const onError = useCallback((data: FinishedTxData) => {
  //   // if (onContractCallError) {
  //   // TODO: Delete record from Proposals
  //   // }
  //   toast({
  //     duration: 2500,
  //     isClosable: true,
  //     position: 'top-right',
  //     render: () => (
  //       <Notification>
  //         <Stack direction='row' p='4' spacing='3'>
  //           <Stack spacing='2.5'>
  //             <Stack spacing='1'>
  //               <Text fontSize='md' color='light.900' fontWeight='medium'>
  //                 Transaction failed
  //               </Text>
  //               <Text fontSize='sm' color='gray.900'>
  //                 Your transaction failed.
  //               </Text>
  //             </Stack>
  //             <ButtonGroup variant='link' size='md' spacing='3'>
  //               <Button
  //                 color='secondary.900'
  //                 as='a'
  //                 target='_blank'
  //                 href={
  //                   process.env.NODE_ENV !== 'production'
  //                     ? `http://localhost:8000/txid/${data.txId}?chain=testnet`
  //                     : `https://explorer.stacks.co/txid/${data.txId}?chain=mainnet`
  //                 }
  //               >
  //                 View transaction
  //               </Button>
  //             </ButtonGroup>
  //           </Stack>
  //           <CloseButton
  //             aria-label='close'
  //             transform='translateY(-6px)'
  //             color='white'
  //             onClick={() => toast.closeAll()}
  //           />
  //         </Stack>
  //       </Notification>
  //     ),
  //   });
  // }, []);

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

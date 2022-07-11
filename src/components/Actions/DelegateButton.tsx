import {
  Button,
  ButtonGroup,
  CloseButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

// Components
import { ContractCallButton } from '@widgets/ContractCallButton';
import { Notification } from '@components/Notification';

// Web3
import { standardPrincipalCV } from 'micro-stacks/clarity';
import { useAccount } from '@micro-stacks/react';

// Utils
import { validateStacksAddress } from '@common/helpers';

// Queries
import { useDAO } from '@common/queries';

// Mutations
import { useAddDelegate, useDeleteDelegate } from '@common/mutations/delegates';

export const DelegateButton = ({
  title,
  delegateAddress,
  contractAddress,
  contractName,
  functionName,
  isDisabled,
}: any) => {
  const { dao } = useDAO();
  const { stxAddress } = useAccount();
  const { mutate: createDelegate } = useAddDelegate(stxAddress);
  const { mutate: deleteDelegate } = useDeleteDelegate(stxAddress);
  const toast = useToast();

  const onFinish: any = async (data: any) => {
    try {
      if (functionName === 'delegate') {
        createDelegate({
          organizationId: dao?.id,
          delegatorAddress: stxAddress,
          delegateAddress: delegateAddress,
        });
      } else {
        deleteDelegate({
          organizationId: dao?.id,
          delegatorAddress: stxAddress,
        });
      }
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
  const isValid = delegateAddress && validateStacksAddress(delegateAddress);
  const functionArgs = isValid && [standardPrincipalCV(delegateAddress)];
  const postConditions: any = [];

  const contractData = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
    onFinish,
  };

  return (
    <ContractCallButton
      title={title}
      color='white'
      bg='secondary.900'
      size='md'
      isFullWidth
      disabled={isDisabled}
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
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
      {...contractData}
    />
  );
};

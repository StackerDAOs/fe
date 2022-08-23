import React from 'react';
import {
  Button,
  ButtonGroup,
  HStack,
  Stack,
  IconButton,
  Spinner,
  Text,
} from '@chakra-ui/react';

// Utils
import { truncate } from '@common/helpers';

// Icons
import { FiExternalLink } from 'react-icons/fi';

// Queries
import { useTransaction } from '@lib/hooks';

// Mutations
import { useDisableProposal } from '@lib/mutations/proposals';

export const ContractCard = ({
  proposalContractAddress,
  transactionId,
  contractData,
}: any) => {
  const [state, setState] = React.useState({ isRemoving: false });
  console.log({ contractData });
  // const { mutate: submitProposal } = useSubmitProposal();
  const { mutate: disableProposal } = useDisableProposal();
  const { data: transaction } = useTransaction(transactionId);

  // const onFinishUpdate = async (contractAddress: string) => {
  //   try {
  //     console.log({ contractAddress });
  //     // submitProposal({ contractAddress, submitted: true });
  //   } catch (e: any) {
  //     console.error({ e });
  //   }
  // };

  const onDisable = async (contractAddress: string) => {
    try {
      disableProposal({ contractAddress, disabled: true });
    } catch (e: any) {
      console.error({ e });
    }
  };

  return (
    <Stack
      px='3'
      py='3'
      bg='base.900'
      borderRadius='lg'
      border='1px solid'
      borderColor='base.500'
      _hover={{ bg: 'base.800' }}
    >
      <HStack justify='space-between'>
        <HStack spacing='3'>
          {transaction?.tx_status === 'pending' && (
            <Button
              bg='base.900'
              color='white'
              size='sm'
              fontWeight='semibold'
              onClick={() => onDisable(proposalContractAddress)}
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
            >
              <Spinner size='xs' speed='0.5s' />
            </Button>
          )}
          <Text color='light.900' fontSize='sm'>
            {proposalContractAddress &&
              truncate(`${proposalContractAddress}`, 4, 14)}
          </Text>
        </HStack>
        <HStack spacing='3'>
          {transaction?.tx_status === 'success' && (
            <>
              <Button
                bg='secondary.900'
                color='white'
                size='sm'
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
              >
                Deploy
              </Button>
              <ButtonGroup>
                <>
                  {state.isRemoving ? (
                    <Button
                      bg='red.900'
                      color='white'
                      size='sm'
                      variant='outline'
                      fontWeight='semibold'
                      onClick={() => onDisable(proposalContractAddress)}
                      _hover={{ opacity: 0.9 }}
                      _active={{ opacity: 1 }}
                    >
                      Confirm
                    </Button>
                  ) : (
                    <Button
                      bg='red.600'
                      color='white'
                      size='sm'
                      onClick={() => setState({ isRemoving: true })}
                      _hover={{ opacity: 0.9 }}
                      _active={{ opacity: 1 }}
                    >
                      Disable
                    </Button>
                  )}
                </>
              </ButtonGroup>
            </>
          )}
          <IconButton
            icon={<FiExternalLink />}
            as='a'
            target='_blank'
            href={
              process.env.NODE_ENV !== 'production'
                ? `http://localhost:8000/txid/${proposalContractAddress}?chain=testnet`
                : `https://explorer.stacks.co/txid/${proposalContractAddress}?chain=mainnet`
            }
            size='sm'
            bg='base.800'
            border='1px solid'
            borderColor='base.500'
            aria-label='Transfer'
            _hover={{ bg: 'base.500' }}
          />
        </HStack>
      </HStack>
    </Stack>
  );
};

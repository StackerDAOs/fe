import { useState } from 'react';
import { Button, HStack, Stack, IconButton, Text } from '@chakra-ui/react';

// Hooks
import { useUpdate } from 'react-supabase';

// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Utils
import { truncate } from '@common/helpers';

// Icons
import { FiExternalLink } from 'react-icons/fi';

export const ContractCard = ({
  proposalContractAddress,
  contractData,
}: any) => {
  const [state, setState] = useState({ isRemoving: false });
  const [_, execute] = useUpdate('Proposals');
  const onFinishUpdate = async (contractAddress: string) => {
    try {
      const { error } = await execute({ submitted: true }, (q) =>
        q.eq('contractAddress', contractAddress),
      );
      if (error) throw error;
    } catch (e: any) {
      console.error({ e });
    }
  };

  const onDisable = async (contractAddress: string) => {
    try {
      const { error } = await execute({ disabled: true }, (q) =>
        q.eq('contractAddress', contractAddress),
      );
      if (error) throw error;
    } catch (e: any) {
      console.error({ e });
    }
  };

  return (
    <Stack
      color='white'
      bg='base.900'
      border='1px solid'
      borderColor='base.500'
      py='2'
      px='3'
      borderRadius='lg'
      _even={{
        bg: 'base.800',
        border: '1px solid',
        borderColor: 'base.500',
      }}
      _last={{ mb: '0' }}
    >
      <Stack
        direction='row'
        spacing='5'
        display='flex'
        justifyContent='space-between'
      >
        <HStack spacing='3'>
          <Text color='light.900' fontSize='sm'>
            {proposalContractAddress &&
              truncate(`${proposalContractAddress}`, 4, 14)}
          </Text>
        </HStack>
        <HStack spacing='3'>
          <ContractCallButton
            title='Propose'
            color='white'
            bg='secondary.900'
            size='sm'
            onContractCall={() => onFinishUpdate(proposalContractAddress)}
            {...contractData}
          />
          {state.isRemoving ? (
            <Button
              bg='red.900'
              color='white'
              size='sm'
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
      </Stack>
    </Stack>
  );
};

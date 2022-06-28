import type { StackProps } from '@chakra-ui/react';
import { Button, HStack, Stack, Text } from '@chakra-ui/react';

// Hooks
import { useUpdate } from 'react-supabase';

// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Utils
import { truncate } from '@common/helpers';

export const ContractCard = ({
  type,
  proposalContractAddress,
  contractData,
}: any) => {
  const [_, execute] = useUpdate('Proposals');
  const onFinishUpdate = async (contractAddress: string) => {
    try {
      const { error } = await execute({ submitted: true }, (q) =>
        q.eq('contractAddress', contractAddress),
      );
      if (error) throw error;
    } catch (error) {
      console.log({ error });
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
      mb='2'
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
          <Text fontSize='sm' fontWeight='medium' color='light.900'>
            {type}
          </Text>
        </HStack>
        <HStack spacing='3'>
          <Text color='gray.900' fontSize='sm'>
            {proposalContractAddress &&
              truncate(`${proposalContractAddress}`, 4, 24)}
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
          <Button
            as='a'
            target='_blank'
            href={
              process.env.NODE_ENV !== 'production'
                ? `http://localhost:8000/txid/${proposalContractAddress}?chain=testnet`
                : `https://explorer.stacks.co/txid/${proposalContractAddress}?chain=mainnet`
            }
            bg='base.800'
            color='white'
            size='sm'
            _hover={{ opacity: 0.9 }}
            _active={{ opacity: 1 }}
          >
            View details
          </Button>
        </HStack>
      </Stack>
    </Stack>
  );
};

import type { StackProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { supabase } from '@utils/supabase';

// Web3
import { useNetwork } from '@micro-stacks/react';
import { fetchTransaction } from 'micro-stacks/api';

// Hooks
import { useUpdate } from 'react-supabase';

// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Utils
import { truncate } from '@common/helpers';

export const TransactionCard = ({ transactionId }: any) => {
  const { network } = useNetwork();
  const [state, setState] = useState<any>({});
  useEffect(() => {
    fetchTransactionData(transactionId);
  }, [transactionId]);

  async function fetchTransactionData(transactionId: string) {
    try {
      const transaction = await fetchTransaction({
        url: network.getCoreApiUrl(),
        txid: transactionId,
        event_offset: 0,
        event_limit: 0,
      });
      console.log({ transaction });
      setState({ ...state, transaction });
    } catch (e: any) {
      console.error({ e });
    }
  }

  return (
    <Stack color='white' py='2' px='3' my='2' borderRadius='lg' bg='base.800'>
      <Stack
        direction='row'
        spacing='5'
        display='flex'
        justifyContent='space-between'
      >
        <HStack spacing='3'>
          icon
          <Text fontSize='sm' fontWeight='medium' color='light.900'>
            asd
          </Text>
        </HStack>
        <HStack spacing='3'>
          <Text fontSize='sm' fontWeight='regular' color='light.900'>
            asd
          </Text>
          <Text fontSize='sm' fontWeight='medium' color='gray.900'>
            MEGA
          </Text>
        </HStack>
        <HStack spacing='3'>
          <Text fontSize='xs' fontWeight='regular' color='gray.900'>
            submitted by
          </Text>
          <Text fontSize='xs' fontWeight='regular' color='gray.900'>
            asd
          </Text>
        </HStack>
      </Stack>
    </Stack>
  );
};

import { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  StackDivider,
  VStack,
} from '@chakra-ui/react';

// Components
import { Stat } from '@components/Stat';

// Stacks
import {
  useAuth,
  useNetwork,
  useUser,
  useCurrentStxAddress,
  useContractCall,
} from '@micro-stacks/react';
import {
  useAccountBalancesClient,
  useCurrentAccountBalances,
  useAccountTransactionsClient,
  useAccountMempoolTransactionsClient,
} from '@micro-stacks/query';
import type { FinishedTxData } from 'micro-stacks/connect';
import {
  fetchAccountBalances,
  fetchTransaction,
  fetchReadOnlyFunction,
} from 'micro-stacks/api';
import { uintCV, principalCV } from 'micro-stacks/clarity';

// Data
import { stats } from '@utils/data';

export const Header = () => {
  const currentStxAddress = useCurrentStxAddress();
  const { network } = useNetwork();
  useEffect(() => {
    async function fetchProposals() {
      try {
        console.log('fetch proposals');
      } catch (error) {
        console.log({ error });
      }
    }
    fetchProposals();
  }, []);

  useEffect(() => {
    async function fetchBalances() {
      try {
        const url = network.getCoreApiUrl();
        const principal = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sde-vault';
        const balances = await fetchAccountBalances({
          url,
          principal,
        });
        console.log({ balances });
      } catch (error) {
        console.log({ error });
      }
    }
    fetchBalances();
  }, []);
  return (
    <Stack spacing={{ base: '8', lg: '6' }} my='3'>
      <Container>
        <Stack
          spacing='4'
          mb='2'
          direction={{ base: 'column', md: 'row' }}
          justify='flex-start'
          align='center'
          color='white'
        >
          <VStack maxW='xl' spacing='3' alignItems='baseline'>
            <HStack>
              <Box
                w='50px'
                h='50px'
                borderRadius='50%'
                bgGradient='linear(to-l, secondaryGradient.900, secondary.900)'
              />
              <Heading size='xl' pb='2' fontWeight='regular' color='light.900'>
                StackerDAO
              </Heading>
            </HStack>
          </VStack>
        </Stack>
        <Stack
          spacing='4'
          mb='6'
          direction={{ base: 'column', md: 'row' }}
          justify='center'
          align='center'
          color='white'
        >
          <Stack
            w='100%'
            direction={{ base: 'column', md: 'row' }}
            divider={<StackDivider borderColor='base.500' />}
          >
            {stats.map((stat, id) => (
              <Stat
                key={id}
                id={id.toString()}
                flex='1'
                _first={{ pl: '0' }}
                {...stat}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

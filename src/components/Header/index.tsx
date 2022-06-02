import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
  fetchContractEventsById,
} from 'micro-stacks/api';
import {
  uintCV,
  principalCV,
  tupleCV,
  bufferCV,
  deserializeCV,
  cvToValue,
} from 'micro-stacks/clarity';

// Data
import { supabase } from '@utils/supabase';
import { stats } from '@utils/data';

// Store
import { useStore as DashboardStore } from 'store/DashboardStore';
import { useStore as VaultStore } from 'store/VaultStore';
import { FaSignLanguage } from 'react-icons/fa';
import { SafeSuspense } from '@components/SafeSuspense';

interface HeaderState {
  organizations: any[];
  proposals: any[];
}

export const Header = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { organization, setOrganization } = DashboardStore();
  const { balance, setBalance } = VaultStore();
  const router = useRouter();
  const { dao: slug } = router.query;
  const currentStxAddress = useCurrentStxAddress();
  const { network } = useNetwork();
  useEffect(() => {
    async function fetch() {
      try {
        const { data: Organizations, error } = await supabase
          .from('Organizations')
          .select(
            'name, slug, contract_address, Extensions (contract_address, ExtensionTypes (name))',
          )
          .eq('slug', slug);
        if (error) throw error;
        if (Organizations.length > 0) {
          const organization = Organizations[0];
          const vault = organization?.Extensions?.find(
            (extension: any) => extension?.ExtensionTypes?.name === 'Vault',
          );
          try {
            const url = network.getCoreApiUrl();
            const principal = vault?.contract_address;
            const balance = await fetchAccountBalances({
              url,
              principal,
            });
            setBalance(balance);
            setOrganization(organization);
            console.log({ balance, organization });
          } catch (error) {
            console.log({ error });
          }
        }
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
      }
    }
    fetch();
  }, [slug]);

  useEffect(() => {
    async function fetch() {
      const vault = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === 'Vault',
      );

      try {
        const url = network.getCoreApiUrl();
        const principal = vault?.contract_address;
        const balance = await fetchAccountBalances({
          url,
          principal,
        });
        setBalance(balance);
        console.log({ balance, organization });
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
      }
    }
    fetch();
  }, [organization]);

  useEffect(() => {
    async function fetch() {
      const proposalVoting = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === 'Voting',
      );
      console.log({ proposalVoting });
      try {
        const url = network.getCoreApiUrl();
        const contractId = proposalVoting?.contract_address;
        const events = await fetchContractEventsById({
          url,
          contract_id: contractId,
          limit: 10,
          offset: 0,
          unanchored: false,
        });
        const deserialized = deserializeCV(
          events?.results[0].contract_log.value.hex,
        );
        const value = cvToValue(deserialized);
        console.log({ value });
        setLoading(false);
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
      }
    }
    fetch();
  }, [organization]);

  const Vault = () => {
    const { stx, non_fungible_tokens, fungible_tokens } = balance;
    console.log({ stx, non_fungible_tokens, fungible_tokens });
    const fungibleTokens = Object.assign({}, fungible_tokens);
    const nonFungibleTokens = Object.assign({}, non_fungible_tokens);
    return (
      <Stat
        flex='1'
        _first={{ pl: '0' }}
        _last={{ borderRightWidth: '0' }}
        borderColor='base.500'
        borderRightWidth='1px'
        label='Vault'
        value={`${stx?.balance} STX`}
        info={`${Object.values(fungibleTokens)?.length} tokens & ${
          Object.values(nonFungibleTokens)?.length
        } NFTs`}
        path='vault'
      />
    );
  };

  const Proposals = () => {
    // const { results: proposalEvents } = events;
    return (
      <Stat
        flex='1'
        _first={{ pl: '0' }}
        _last={{ borderRightWidth: '0' }}
        borderColor='base.500'
        borderRightWidth='1px'
        label='Proposals'
        value={`2`}
        info={`1 active`}
        path='governance'
      />
    );
  };

  const Profile = () => {
    // const { results: proposalEvents } = events;
    return (
      <Stat
        flex='1'
        _first={{ pl: '0' }}
        _last={{ borderRightWidth: '0' }}
        borderColor='base.500'
        borderRightWidth='1px'
        label='Governance'
        value={`2%`}
        info={`> 1.5% required`}
        path='delegates'
      />
    );
  };

  if (loading) {
    return null;
  }

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
                {organization?.name}
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
            <SafeSuspense fallback={<>Loading...</>}>
              <Vault />
              <Proposals />
              <Profile />
            </SafeSuspense>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

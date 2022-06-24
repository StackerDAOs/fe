import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Heading, HStack, Stack, VStack } from '@chakra-ui/react';

import { useNetwork } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';

import { ustxToStx, convertToken } from '@common/helpers';
import Avatar from 'boring-avatars';

import { EmptyState } from '@components/EmptyState';
import { Stat } from '@components/Stat';

import {
  useBalance,
  useBlocks,
  useOrganization,
  useProposals,
  useGovernanceToken,
} from '@common/hooks';

import { defaultTo, get } from 'lodash';

type THeader = {
  symbol: string | null;
};

const initialValue: THeader = {
  symbol: null,
} as THeader;

export const Header = () => {
  const { network } = useNetwork();
  const router = useRouter();
  const { dao } = router.query as any;
  const [state, setState] = useState<THeader>(initialValue);
  const { currentBlockHeight } = useBlocks();
  const { organization } = useOrganization({ name: dao });
  const { proposals } = useProposals({ organization: organization });
  const { isLoading: isLoadingBalance, balance } = useBalance({
    organization: organization,
  });
  const {
    balance: userBalance,
    contractAddress,
    contractName,
  } = useGovernanceToken({
    organization: organization,
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (contractAddress) {
          const symbol: any = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress: contractAddress,
            functionArgs: [],
            functionName: 'get-symbol',
          });
          setState({ ...state, symbol });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchToken();
  }, [contractAddress]);

  const Vault = () => {
    const { stx } = balance as any;
    const amount = defaultTo(stx?.balance, 0);
    const stxBalance = ustxToStx(amount);
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Vault'
        value={stxBalance}
        info={`Total STX`}
        path='vault'
      />
    );
  };

  const Proposals = () => {
    const openProposals = proposals.filter(
      ({ startBlockHeight, endBlockHeight }) => {
        const isOpen =
          currentBlockHeight <= endBlockHeight &&
          currentBlockHeight >= startBlockHeight;
        return isOpen;
      },
    );
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Proposals'
        value={openProposals?.length}
        info={`Active`}
        path='proposals'
      />
    );
  };

  const Governance = () => {
    const { symbol } = state;
    const balance = defaultTo(userBalance, 0);
    const tokenBalance = defaultTo(convertToken(balance.toString(), 2), 0);
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Governance'
        value={tokenBalance} // TODO: Get decimals for token
        info={defaultTo(symbol, 'Token')}
        path='governance'
      />
    );
  };

  if (isLoadingBalance) {
    return (
      <EmptyState
        heading='Unable to load balance'
        linkTo={`/d/${dao}/proposals/create/transfer`}
        buttonTitle='Try again'
      />
    );
  }

  return (
    <Container>
      <Stack spacing={{ base: '6', lg: '4' }} mt='5'>
        <Container>
          <Stack
            spacing='2'
            mt='4'
            mb='2'
            direction={{ base: 'column', md: 'row' }}
            justify='flex-start'
            color='white'
          >
            <VStack maxW='xl' spacing='3'>
              <Link href={`/d/${dao}`}>
                <a>
                  <HStack align='baseline'>
                    <Avatar
                      size={40}
                      name={organization?.name}
                      variant='marble'
                      colors={[
                        '#50DDC3',
                        '#624AF2',
                        '#EB00FF',
                        '#7301FA',
                        '#25C2A0',
                      ]}
                    />
                    <Heading
                      size='lg'
                      pb='2'
                      fontWeight='light'
                      color='light.900'
                    >
                      {organization?.name}
                    </Heading>
                  </HStack>
                </a>
              </Link>
            </VStack>
          </Stack>
          <Stack
            spacing='6'
            direction={{ base: 'column', md: 'row' }}
            justify='center'
            align='center'
            color='white'
          >
            <Vault />
            <Proposals />
            <Governance />
          </Stack>
        </Container>
      </Stack>
    </Container>
  );
};

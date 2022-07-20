import Link from 'next/link';
import {
  Container,
  Heading,
  HStack,
  Stack,
  VStack,
  useBreakpointValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

import { ustxToStx, convertToken } from '@common/helpers';
import Avatar from 'boring-avatars';

//components
import { EmptyState } from '@components/EmptyState';
import { Stat } from '@components/Stat';
import { Card } from '@components/Card';

import { defaultTo } from 'lodash';

import {
  useDAO,
  useToken,
  useTokenBalance,
  useProposals,
} from '@common/queries';

export const Header = () => {
  const { dao } = useDAO();
  const { data } = useProposals();
  const { dao: DAO } = useDAO();
  const { isLoading, isIdle, isError, token, balance } = useToken();
  const { balance: userBalance } = useTokenBalance();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const Vault = () => {
    const stx = balance?.stx;
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
    const proposalSize = defaultTo(data?.length, 0);
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Proposals'
        value={proposalSize}
        info={`Total`}
        path='proposals'
      />
    );
  };

  const Governance = () => {
    const balance = defaultTo(userBalance, 0);
    const decimals = defaultTo(token?.decimals, 0);
    const tokenBalance = defaultTo(
      convertToken(balance?.toString(), decimals),
      0,
    );
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Governance'
        value={tokenBalance} // TODO: Get decimals for token
        info={defaultTo(token?.symbol, 'Token')}
        path='governance'
      />
    );
  };

  if (isError) {
    return (
      <EmptyState
        heading='Unable to load balance'
        linkTo={`/d/${dao}/proposals/create/transfer`}
        buttonTitle='Try again'
      />
    );
  }

  if (isLoading || isIdle) {
    <Container maxW='5xl'>
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
                      name={DAO?.name}
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
                      {DAO?.name}
                    </Heading>
                  </HStack>
                </a>
              </Link>
            </VStack>
          </Stack>
          <motion.div
            variants={FADE_IN_VARIANTS}
            initial={FADE_IN_VARIANTS.hidden}
            animate={FADE_IN_VARIANTS.enter}
            exit={FADE_IN_VARIANTS.exit}
            transition={{ duration: 0.75, type: 'linear' }}
          >
            <Stack
              spacing='6'
              display={isMobile ? 'block' : 'flex'}
              direction={{ base: 'column', md: 'row' }}
              justify='center'
              align='center'
              color='white'
            >
              <EmptyState heading='Fetching vault data...' />
            </Stack>
          </motion.div>
        </Container>
      </Stack>
    </Container>;
  }

  return (
    <Container maxW='5xl'>
      <Stack spacing={{ base: '6', lg: '4' }} mt='5'>
        <Container>
          <Popover
            trigger='click'
            openDelay={0}
            placement='right'
            defaultIsOpen={false}
          >
            <Stack
              spacing='2'
              mt='4'
              mb='2'
              direction={{ base: 'column', md: 'row' }}
              justify='flex-start'
              color='white'
            >
              <VStack maxW='xl' spacing='3'>
                <PopoverTrigger>
                  <HStack align='baseline' cursor='pointer'>
                    <Avatar
                      size={40}
                      name={DAO?.name}
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
                      {DAO?.name}
                    </Heading>
                  </HStack>
                </PopoverTrigger>
              </VStack>
            </Stack>
            <PopoverContent
              borderColor='base.500'
              _focus={{ outline: 'none' }}
              bg='base.900'
              w='auto'
              my='2'
            >
              <SimpleGrid columns={{ base: 1 }}>
                <Stack spacing='4' direction='row' p='3'>
                  <Stack spacing='1'>
                    <Card
                      bg='transparent'
                      border='none'
                      minW='150px'
                      px={{ base: '2', md: '2' }}
                      py={{ base: '2', md: '2' }}
                      _hover={{
                        cursor: 'pointer',
                        bg: 'base.900',
                      }}
                    >
                      <VStack align='left'>
                        <Text
                          px='2'
                          fontSize='m'
                          fontWeight='regular'
                          color='white'
                        >
                          DAO Info
                        </Text>
                        <Text
                          px='2'
                          fontSize='sm'
                          fontWeight='regular'
                          color='white'
                        >
                          Quorum: 12500
                        </Text>
                        <Text
                          px='2'
                          fontSize='sm'
                          fontWeight='regular'
                          color='white'
                        >
                          {'Discourse:' + ' '}
                          <Link href='www.google.com'>www.google.com</Link>
                        </Text>
                      </VStack>
                    </Card>
                  </Stack>
                </Stack>
              </SimpleGrid>
            </PopoverContent>
          </Popover>
          <motion.div
            variants={FADE_IN_VARIANTS}
            initial={FADE_IN_VARIANTS.hidden}
            animate={FADE_IN_VARIANTS.enter}
            exit={FADE_IN_VARIANTS.exit}
            transition={{ duration: 0.75, type: 'linear' }}
          >
            <Stack
              spacing='6'
              display={isMobile ? 'block' : 'flex'}
              direction={{ base: 'column', md: 'row' }}
              justify='center'
              align='center'
              color='white'
            >
              <Vault />
              <Proposals />
              <Governance />
            </Stack>
          </motion.div>
        </Container>
      </Stack>
    </Container>
  );
};

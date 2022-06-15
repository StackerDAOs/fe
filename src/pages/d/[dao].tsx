import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Container,
  SimpleGrid,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';

// Web3
import { useAuth, useNetwork, useCurrentStxAddress } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { Card } from '@components/Card';
import { Header } from '@components/Header';

// Hooks
import { useBalance } from '@common/hooks';

//  Animation
import { motion } from 'framer-motion';

const DAODashboard = () => {
  const router = useRouter();
  const { dao } = router.query;
  const currentStxAddress = useCurrentStxAddress();
  const { isSignedIn } = useAuth();
  const { network } = useNetwork();
  const { isLoading, balance } = useBalance();
  const { non_fungible_tokens, fungible_tokens } = balance;

  const fetchTokenData = async (
    contractAddress: string,
    contractName: string,
    senderAddress: string,
    functionArgs: any = [],
    functionName: string,
  ) => {
    const tokenData = await fetchReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      senderAddress,
      functionArgs,
      functionName,
    });
    return tokenData;
  };

  const getValues = async () => {
    const getName = await fetchTokenData(
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      'sde-sip10-token',
      currentStxAddress || '',
      [],
      'get-name',
    );
    return {
      name: getName,
    };
  };

  const fungibleTokens: any = Object.assign({}, fungible_tokens);
  const fungibleTokensList = Object.keys(fungibleTokens).map((key) => {
    const tokenContract = key.split('::')[0].split('.')[0];
    const tokenContractName = key.split('::')[0].split('.')[1];
    const tokenValue = fungibleTokens[key];
    return {
      name: tokenContractName,
      balance: tokenValue?.balance,
    };
  });
  const nonFungibleTokens: any = Object.assign({}, non_fungible_tokens);
  const nonFungibleTokensList = Object.keys(nonFungibleTokens).map((key) => {
    const tokenKey = key.split('::')[1];
    const tokenValue = nonFungibleTokens[key];
    return {
      name: tokenKey,
      balance: tokenValue?.balance,
    };
  });

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  };

  const assets = [
    {
      name: 'Mega',
      symbol: 'MEGA',
      image: 'https://www.megapont.com/images/megacoin.png',
      balance: '2522.20',
    },
    {
      name: 'Alex',
      symbol: 'ALEX',
      image:
        'https://pbs.twimg.com/profile_images/1480241247780540420/BYH-WYE-_400x400.png',
      balance: '8422.99',
    },
    {
      name: 'MiamiCoin',
      symbol: 'MIA',
      image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/10300.png',
      balance: '2522.20',
    },
  ];

  const nfts = [
    {
      name: 'Megapont Ape Club',
      image: 'https://www.megapont.com/images/megacoin.png',
      amount: '3',
    },
  ];

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Box as='section'>
        <Container maxW='5xl'>
          <Stack spacing={{ base: '8', lg: '6' }}>
            <Container>
              <Stack spacing='5'>
                <Stack
                  spacing='4'
                  my='3'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  align='flex-end'
                  color='white'
                >
                  <Box>
                    <Text fontSize='2xl' fontWeight='medium'>
                      Vault
                    </Text>
                    <Text color='gray.900' fontSize='sm'>
                      List of shared assets owned by the DAO.
                    </Text>
                  </Box>
                  <Link href={`/d/${dao}/vault`}>
                    <Text
                      as='a'
                      cursor='pointer'
                      color='gray.900'
                      fontSize='sm'
                      fontWeight='regular'
                      textDecoration='underline'
                    >
                      View more
                    </Text>
                  </Link>
                </Stack>
              </Stack>
              <motion.div
                variants={FADE_IN_VARIANTS}
                initial={FADE_IN_VARIANTS.hidden}
                animate={FADE_IN_VARIANTS.enter}
                exit={FADE_IN_VARIANTS.exit}
                transition={{ duration: 0.25, type: 'linear' }}
              >
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 2 }}
                  spacing='6'
                  mb='10'
                  color='white'
                >
                  <Box>
                    <Card
                      bg='base.800'
                      position='relative'
                      pt={{ base: '3', md: '3' }}
                      border='1px solid'
                      borderColor='base.500'
                      _hover={{
                        cursor: 'pointer',
                      }}
                    >
                      <Box
                        as='section'
                        pb={{ base: '3', md: '3' }}
                        px={{ base: '3', md: '3' }}
                      >
                        <Box pb='3'>
                          <Text fontSize='md' fontWeight='medium'>
                            Tokens
                          </Text>
                        </Box>
                        <VStack
                          align='left'
                          maxW='md'
                          spacing='3'
                          direction={{
                            base: 'column',
                            md: 'row',
                          }}
                          justify='space-between'
                          color='white'
                        >
                          {assets.map(
                            ({ name, symbol, image, balance }, index) => (
                              <Stack
                                key={index}
                                color='white'
                                bg='base.800'
                                p='3'
                                borderRadius='lg'
                              >
                                <Stack
                                  direction='row'
                                  spacing='3'
                                  display='flex'
                                  justifyContent='space-between'
                                >
                                  <HStack spacing='3'>
                                    <Avatar
                                      borderRadius='lg'
                                      src={image}
                                      boxSize='6'
                                    />
                                    <HStack spacing='1' align='baseline'>
                                      <Text
                                        fontSize='sm'
                                        fontWeight='medium'
                                        color='light.900'
                                      >
                                        {name}
                                      </Text>
                                      <Text
                                        fontSize='xs'
                                        fontWeight='regular'
                                        color='gray.900'
                                      >
                                        {symbol}
                                      </Text>
                                    </HStack>
                                  </HStack>
                                  <HStack spacing='1'>
                                    <Text
                                      fontSize='sm'
                                      fontWeight='regular'
                                      color='light.900'
                                    >
                                      {balance}
                                    </Text>
                                  </HStack>
                                </Stack>
                              </Stack>
                            ),
                          )}
                        </VStack>
                      </Box>
                    </Card>
                  </Box>
                  <Box>
                    <Card
                      bg='base.800'
                      position='relative'
                      pt={{ base: '3', md: '3' }}
                      border='1px solid'
                      borderColor='base.500'
                      _hover={{
                        cursor: 'pointer',
                      }}
                    >
                      <Box
                        as='section'
                        pb={{ base: '3', md: '3' }}
                        px={{ base: '3', md: '3' }}
                      >
                        <Box pb='3'>
                          <Text fontSize='md' fontWeight='medium'>
                            NFTs
                          </Text>
                        </Box>
                        <VStack
                          align='left'
                          maxW='md'
                          spacing='3'
                          direction={{
                            base: 'column',
                            md: 'row',
                          }}
                          justify='space-between'
                          color='white'
                        >
                          {nfts.map(({ name, image, amount }) => (
                            <Stack
                              color='white'
                              bg='base.800'
                              p='3'
                              borderRadius='lg'
                            >
                              <Stack
                                direction='row'
                                spacing='3'
                                display='flex'
                                justifyContent='space-between'
                              >
                                <HStack spacing='3'>
                                  <Avatar
                                    borderRadius='lg'
                                    src={image}
                                    boxSize='6'
                                  />
                                  <HStack spacing='1' align='baseline'>
                                    <Text
                                      fontSize='sm'
                                      fontWeight='medium'
                                      color='light.900'
                                    >
                                      {name}
                                    </Text>
                                  </HStack>
                                </HStack>
                                <HStack spacing='1'>
                                  <Text
                                    fontSize='sm'
                                    fontWeight='regular'
                                    color='light.900'
                                  >
                                    {amount}
                                  </Text>
                                </HStack>
                              </Stack>
                            </Stack>
                          ))}
                        </VStack>
                      </Box>
                    </Card>
                  </Box>
                </SimpleGrid>
              </motion.div>
            </Container>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

DAODashboard.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default DAODashboard;

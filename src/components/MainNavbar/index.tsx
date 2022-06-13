import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  ButtonGroup,
  Button,
  Container,
  Circle,
  Flex,
  HStack,
  IconButton,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Tab,
  Tabs,
  TabList,
  Text,
  useBreakpointValue,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Components
import { Card } from '@components/Card';
import { ContractCallButton } from '@widgets/ContractCallButton';

// Icons
import { FiMenu } from 'react-icons/fi';

// Components
import { WalletConnectButton } from '@components/WalletConnectButton';

// Web3
import { useUser, useAuth, useNetwork } from '@micro-stacks/react';
import { fetchNamesByAddress } from 'micro-stacks/api';
import {
  boolCV,
  uintCV,
  contractPrincipalCV,
  standardPrincipalCV,
} from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from 'micro-stacks/transactions';

// Utils
import { stxToUstx, truncate } from '@common/helpers';

export const MainNavbar = () => {
  const [bns, setBns] = useState<string | undefined>('');
  const { currentStxAddress } = useUser();
  const { isSignedIn, handleSignIn, handleSignOut } = useAuth();
  const { network } = useNetwork();
  const router = useRouter();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const switchAccount = () => {
    handleSignIn();
  };
  const signOut = () => {
    handleSignOut();
    localStorage.setItem('chakra-ui-color-mode', 'dark');
    // router.push('/');
  };
  const { dao } = router.query;
  const isSelected = (path: string) => {
    return router.pathname.split('/')[3] === path;
  };

  useEffect(() => {
    async function fetch() {
      if (isSignedIn && currentStxAddress) {
        const data = await fetchNamesByAddress({
          url: network.getCoreApiUrl(),
          blockchain: 'stacks',
          address: currentStxAddress || '',
        });
        const { names } = data;
        if (names?.length > 0) {
          console.log(names);
          setBns(names[0]);
        }
      }
    }
    fetch();
  }, [currentStxAddress, network]);

  // INIT
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const contractName = 'executor-dao';
  const functionName = 'init';

  const functionArgs = [
    contractPrincipalCV(
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      'sdp-delegate-voting-dao',
    ),
  ];
  const postConditions: any = [];

  // DELEGATE
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'sde-governance-token-with-delegation';
  // const functionName = 'delegate';

  // const functionArgs = [
  //   standardPrincipalCV('STPJ2HPED2TMR1HAFBFA5VQF986CRD4ZWHH36F6X'),
  //   standardPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'),
  // ];
  // const postConditions: any = [];

  // REVOKE
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'sde-governance-token-with-delegation';
  // const functionName = 'revoke-delegation';

  // const functionArgs = [
  //   standardPrincipalCV('ST2ST2H80NP5C9SPR4ENJ1Z9CDM9PKAJVPYWPQZ50'),
  //   standardPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'),
  // ];
  // const postConditions: any = [];

  // PROPOSE
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'sde-proposal-submission-with-delegation';
  // const functionName = 'propose';

  // const functionArgs = [
  //   contractPrincipalCV(
  //     'STPJ2HPED2TMR1HAFBFA5VQF986CRD4ZWHH36F6X',
  //     'managing-coral-wallaby',
  //   ),
  //   uintCV(2230),
  //   contractPrincipalCV(
  //     'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  //     'sde-governance-token-with-delegation',
  //   ),
  // ];
  // const postConditions: any = [];

  // VOTE
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'sde-proposal-voting-with-delegation';
  // const functionName = 'vote';
  // const postConditions: any = [];

  // const functionArgs = [
  //   boolCV(true),
  //   contractPrincipalCV(
  //     'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  //     'sdp-transfer-stx',
  //   ),
  //   contractPrincipalCV(
  //     'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  //     'sde-governance-token-with-delegation',
  //   ),
  // ];
  // const postConditions: any = [];

  // DEPOSIT
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'sde-vault';
  // const functionName = 'deposit';
  // const functionArgs = [uintCV(stxToUstx('285'))];
  // const postConditionAddress = currentStxAddress || '';
  // const postConditionCode = FungibleConditionCode.LessEqual;
  // const postConditionAmount = stxToUstx('285');
  // const postConditions = currentStxAddress
  //   ? [
  //       makeStandardSTXPostCondition(
  //         postConditionAddress,
  //         postConditionCode,
  //         postConditionAmount,
  //       ),
  //     ]
  //   : [];

  const contractData = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  };

  return (
    <Box as='section' height='5vh'>
      <Box
        as='nav'
        position='fixed'
        w='100%'
        p='3'
        px='9'
        bg='base.900'
        borderBottom='1px solid'
        borderColor='base.500'
      >
        <HStack justify='space-around' spacing='2'>
          <Link href={`/d/${dao}`}>
            <Image
              cursor='pointer'
              height='30px'
              src='/img/logo-only.png'
              alt='logo'
            />
          </Link>
          {isDesktop ? (
            <>
              <Flex justify='flex-end' flex='1'>
                <HStack spacing='3'>
                  <ButtonGroup spacing='6' alignItems='center'>
                    {isSignedIn ? (
                      <HStack
                        cursor='pointer'
                        spacing='2'
                        color={mode('base.900', 'light.900')}
                      >
                        <Box
                          w='10px'
                          h='10px'
                          boxSize='4'
                          borderRadius='50%'
                          bgGradient='linear(to-l, secondaryGradient.900, secondary.900)'
                        />
                        <Text color='light.900' fontSize='sm'>
                          {bns
                            ? bns
                            : currentStxAddress &&
                              truncate(currentStxAddress, 4, 4)}
                        </Text>
                      </HStack>
                    ) : null}
                    {currentStxAddress && (
                      <Popover
                        trigger='click'
                        openDelay={0}
                        placement='bottom-start'
                        defaultIsOpen={false}
                      >
                        {({ isOpen }) => (
                          <>
                            <PopoverTrigger>
                              <HStack>
                                <FiMenu
                                  color='white'
                                  fontSize='sm'
                                  cursor='pointer'
                                />
                              </HStack>
                            </PopoverTrigger>
                            <PopoverContent
                              _focus={{ outline: 'none' }}
                              bg='base.900'
                              w='auto'
                              my='2'
                            >
                              <SimpleGrid columns={{ base: 1 }}>
                                <Stack spacing='4' direction='row' p='3'>
                                  <Stack spacing='1'>
                                    <Card
                                      bg='base.900'
                                      border='none'
                                      minW='150px'
                                      px={{ base: '2', md: '2' }}
                                      py={{ base: '2', md: '2' }}
                                      _hover={{
                                        cursor: 'pointer',
                                        bg: 'base.800',
                                      }}
                                    >
                                      <HStack>
                                        <Text
                                          px='2'
                                          fontSize='sm'
                                          fontWeight='regular'
                                          color='white'
                                        >
                                          Activity
                                        </Text>
                                      </HStack>
                                    </Card>
                                    <Card
                                      bg='base.900'
                                      border='none'
                                      minW='150px'
                                      px={{ base: '2', md: '2' }}
                                      py={{ base: '2', md: '2' }}
                                      _hover={{
                                        cursor: 'pointer',
                                        bg: 'base.800',
                                      }}
                                    >
                                      <HStack>
                                        <Text
                                          px='2'
                                          fontSize='sm'
                                          fontWeight='regular'
                                          color='white'
                                        >
                                          Settings
                                        </Text>
                                      </HStack>
                                    </Card>
                                    <Card
                                      bg='base.900'
                                      border='none'
                                      minW='150px'
                                      px={{ base: '2', md: '2' }}
                                      py={{ base: '2', md: '2' }}
                                      _hover={{
                                        cursor: 'pointer',
                                        bg: 'base.800',
                                      }}
                                    >
                                      <HStack>
                                        <Text
                                          px='2'
                                          fontSize='sm'
                                          fontWeight='regular'
                                          color='white'
                                          onClick={switchAccount}
                                        >
                                          Switch account
                                        </Text>
                                      </HStack>
                                    </Card>
                                    <Card
                                      bg='base.900'
                                      border='none'
                                      minW='150px'
                                      px={{ base: '2', md: '2' }}
                                      py={{ base: '2', md: '2' }}
                                      _hover={{
                                        cursor: 'pointer',
                                        bg: 'base.800',
                                      }}
                                    >
                                      <HStack>
                                        <Text
                                          px='2'
                                          fontSize='sm'
                                          fontWeight='regular'
                                          color='white'
                                          onClick={signOut}
                                        >
                                          Disconnect
                                        </Text>
                                      </HStack>
                                    </Card>
                                  </Stack>
                                </Stack>
                              </SimpleGrid>
                            </PopoverContent>
                          </>
                        )}
                      </Popover>
                    )}

                    {!currentStxAddress && (
                      <WalletConnectButton
                        color='white'
                        size='sm'
                        fontWeight='medium'
                        bg='secondary.900'
                        _hover={{ opacity: 0.9 }}
                        _active={{ opacity: 1 }}
                      />
                    )}
                  </ButtonGroup>
                </HStack>
              </Flex>
            </>
          ) : (
            <IconButton
              color='white'
              icon={<FiMenu fontSize='1.25rem' />}
              aria-label='Open Menu'
            />
          )}
        </HStack>
      </Box>
    </Box>
  );
};
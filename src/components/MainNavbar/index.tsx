import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

// Components
import { Card } from '@components/Card';

// Icons
import { FaEllipsisH } from 'react-icons/fa';

// Components
import { WalletConnectButton } from '@components/WalletConnectButton';
import { NotificationModal } from '@components/Modal';

// Web3
import { useUser, useAuth, useNetwork } from '@micro-stacks/react';
import {
  fetchAccountStxBalance,
  fetchNamesByAddress,
  fetchBlocks,
} from 'micro-stacks/api';

// Hooks
import { usePolling } from '@common/hooks';

// Utils
import { truncate, ustxToStx } from '@common/helpers';
import Avatar from 'boring-avatars';

export const MainNavbar = () => {
  const router = useRouter();
  const { dao } = router.query as any;
  const { network } = useNetwork();
  const [bns, setBns] = useState<string | undefined>('');
  const [balance, setBalance] = useState<string | undefined>('');
  const [blockHeight, setBlockHeight] = useState(0);
  const { currentStxAddress } = useUser();
  const { isSignedIn, handleSignIn, handleSignOut } = useAuth();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const NETWORK_CHAIN_ID: any = {
    1: 'Mainnet',
    2147483648: network.bnsLookupUrl?.includes('testnet')
      ? 'Testnet'
      : 'Devnet',
  };
  const switchAccount = () => {
    handleSignIn();
  };
  const signOut = () => {
    handleSignOut();
    localStorage.setItem('chakra-ui-color-mode', 'dark');
    // router.push('/');
  };

  const fetch = async () => {
    if (isSignedIn) {
      try {
        const blocks = await fetchBlocks({
          url: network.getCoreApiUrl(),
          limit: 1,
          offset: 0,
        });
        setBlockHeight(blocks.total);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  usePolling(
    () => {
      fetch();
    },
    true,
    600000,
  );

  useEffect(() => {
    async function fetch() {
      if (isSignedIn && currentStxAddress) {
        const stxBalance = await fetchAccountStxBalance({
          url: network.getCoreApiUrl(),
          principal: currentStxAddress || '',
        });
        const balance = stxBalance?.balance?.toString() || '0';
        setBalance(ustxToStx(balance));
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

  const isMobile = useBreakpointValue({ base: true, md: false });

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
        borderColor='base.800'
        zIndex='2'
      >
        <HStack
          justify={isMobile ? 'space-between' : 'space-around'}
          spacing='2'
        >
          <Link href={`/`}>
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
                      <HStack cursor='pointer' spacing='5' color='light.900'>
                        <HStack
                          cursor='default'
                          align='center'
                          justify='center'
                          color='light.900'
                        >
                          <HStack>
                            <Text
                              color='secondary.900'
                              fontSize='sm'
                              fontWeight='medium'
                            >
                              {NETWORK_CHAIN_ID[network.chainId]}
                            </Text>
                            <Box
                              minW='1'
                              maxW='1'
                              h='1'
                              w='1'
                              bg='secondary.900'
                              borderRadius='50%'
                            />
                            <Text
                              color='secondary.900'
                              fontSize='sm'
                              fontWeight='regular'
                            >
                              {blockHeight}
                            </Text>
                          </HStack>
                        </HStack>
                        <HStack spacing='1'>
                          <Text
                            as='span'
                            fontSize='sm'
                            fontWeight='regular'
                            color='light.900'
                          >
                            Ӿ
                          </Text>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            {balance}{' '}
                          </Text>
                        </HStack>
                        <HStack spacing='1'>
                          <Avatar
                            size={15}
                            name={currentStxAddress}
                            variant='beam'
                            colors={[
                              '#50DDC3',
                              '#624AF2',
                              '#EB00FF',
                              '#7301FA',
                              '#25C2A0',
                            ]}
                          />
                          <NotificationModal
                            title={
                              bns
                                ? bns
                                : currentStxAddress &&
                                  truncate(currentStxAddress, 4, 4)
                            }
                          />
                        </HStack>
                      </HStack>
                    ) : null}
                    {currentStxAddress && (
                      <Popover
                        trigger='click'
                        openDelay={0}
                        placement='bottom-start'
                        defaultIsOpen={false}
                      >
                        {() => (
                          <>
                            <PopoverTrigger>
                              <HStack>
                                <FaEllipsisH color='white' cursor='pointer' />
                              </HStack>
                            </PopoverTrigger>
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
              display='none'
              color='white'
              icon={<FaEllipsisH fontSize='1.25rem' />}
              aria-label='Open Menu'
            />
          )}
        </HStack>
      </Box>
    </Box>
  );
};

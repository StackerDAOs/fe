import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Image,
  ModalBody,
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
} from '@chakra-ui/react';

// Components
import { Card } from '@components/Card';

// Icons
import { FaEllipsisH } from 'react-icons/fa';

// Components
import { WalletConnectButton } from '@components/WalletConnectButton';
import { AdminModal } from '@components/Modal';

// Web3
import { useUser, useAuth, useNetwork } from '@micro-stacks/react';
import { fetchAccountStxBalance, fetchNamesByAddress } from 'micro-stacks/api';

// Utils
import { truncate, ustxToStx } from '@common/helpers';
import Avatar from 'boring-avatars';

export const AppNavbar = () => {
  const router = useRouter();
  const { dao } = router.query as any;
  const { network } = useNetwork();
  const [bns, setBns] = useState<string | undefined>('');
  const [balance, setBalance] = useState<string | undefined>('');
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
  const isSelected = (path: string) => {
    return router.pathname.split('/')[3] === path;
  };

  useEffect(() => {
    async function fetch() {
      if (isSignedIn && currentStxAddress) {
        const stxBalance = await fetchAccountStxBalance({
          url: network.getCoreApiUrl(),
          principal: currentStxAddress || '',
        });
        console.log({ stxBalance });
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
              <Flex justify='space-between' flex='1'>
                <Tabs color='white' isFitted variant='unstyled'>
                  <TabList>
                    {['Vault', 'Proposals', 'Governance', 'Extensions'].map(
                      (item) => (
                        <Link
                          key={item}
                          href={`/d/${dao}/${item?.toLocaleLowerCase()}`}
                        >
                          <Tab
                            key={item}
                            fontSize='sm'
                            color={
                              isSelected(item.toLowerCase())
                                ? 'light.900'
                                : 'gray.900'
                            }
                            _hover={{ color: 'light.800' }}
                          >
                            {item}
                          </Tab>
                        </Link>
                      ),
                    )}
                  </TabList>
                </Tabs>
                <HStack spacing='3'>
                  <ButtonGroup spacing='6' alignItems='center'>
                    {isSignedIn ? (
                      <HStack cursor='pointer' spacing='4' color='light.900'>
                        <Badge
                          cursor='default'
                          variant='subtle'
                          bg='base.800'
                          color='light.900'
                          px='3'
                          py='1'
                        >
                          <Text
                            color='secondary.900'
                            fontSize='sm'
                            fontWeight='medium'
                          >
                            {NETWORK_CHAIN_ID[network.chainId]}
                          </Text>
                        </Badge>
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
                          <AdminModal
                            title={
                              bns
                                ? bns
                                : currentStxAddress &&
                                  truncate(currentStxAddress, 4, 4)
                            }
                          >
                            <ModalBody pb={6}>
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
                            </ModalBody>
                          </AdminModal>
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
                              bg='base.800'
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
                                        >
                                          Settings
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

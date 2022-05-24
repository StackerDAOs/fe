import * as React from 'react';
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

// Icons
import { FiMenu } from 'react-icons/fi';
import { MdSettings } from 'react-icons/md';
import { FaInbox, FaSignOutAlt, FaExchangeAlt, FaBell } from 'react-icons/fa';

// Components
import { WalletConnectButton } from '@components/WalletConnectButton';
import { ProjectsPopover } from '@components/ProjectsPopover';

// Web3
import { useUser, useAuth, useNetwork } from '@micro-stacks/react';
import { fetchNamesByAddress } from 'micro-stacks/api';

// Utils
import { truncate } from '@utils/truncate-str';

export const AppNavbar = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bns, setBns] = useState<string | undefined>('');
  const { currentStxAddress } = useUser();
  const { isSignedIn, handleSignOut } = useAuth();
  const { network } = useNetwork();
  const router = useRouter();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const signOut = () => {
    handleSignOut();
    localStorage.setItem('chakra-ui-color-mode', 'dark');
    router.push('/');
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
      setLoading(false);
    }
    fetch();
  }, [currentStxAddress, network]);

  if (loading) {
    return null;
  }
  return (
    <Box as='section' height='5vh'>
      <Box
        as='nav'
        position='fixed'
        w='100%'
        bg='base.900'
        zIndex='9999'
        borderBottom='1px solid'
        borderColor='base.500'
      >
        <Container py={{ base: '4', lg: '5' }}>
          <HStack justify='space-around' spacing='2'>
            <Link href={`/dashboard/${dao}`}>
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
                      {['Vault', 'Proposals', 'Extensions', 'Delegates'].map(
                        (item) => (
                          <Link
                            href={`/dashboard/${dao}/${item?.toLocaleLowerCase()}`}
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
                      <Link href='/dashboard/dao/activity'>
                        <HStack position='relative' cursor='pointer'>
                          <FaBell fontSize='1.25rem' color='white' />
                          <Circle
                            position='absolute'
                            bottom='2'
                            boxSize='5'
                            bg='tomato'
                            color='white'
                            bgGradient='linear(to-l, primaryGradient.900, primary.900)'
                          >
                            <Text
                              fontSize='xs'
                              fontWeight='semibold'
                              color='white'
                            >
                              3
                            </Text>
                          </Circle>
                        </HStack>
                      </Link>
                      {currentStxAddress && (
                        <Popover
                          trigger='hover'
                          openDelay={0}
                          placement='bottom'
                          defaultIsOpen={false}
                          gutter={12}
                        >
                          {({ isOpen }) => (
                            <>
                              <PopoverTrigger>
                                <HStack
                                  cursor='pointer'
                                  spacing='2'
                                  color={mode('base.900', 'light.900')}
                                >
                                  <Box
                                    w='15px'
                                    h='15px'
                                    boxSize='5'
                                    borderRadius='50%'
                                    bgGradient='linear(to-l, secondaryGradient.900, secondary.900)'
                                  />
                                  <Text
                                    color={mode('base.900', 'light.900')}
                                    fontSize='sm'
                                  >
                                    {bns
                                      ? bns
                                      : truncate(currentStxAddress, 4, 4)}
                                  </Text>
                                </HStack>
                              </PopoverTrigger>
                              <PopoverContent
                                _focus={{ outline: 'none' }}
                                width='auto'
                                bg='base.900'
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
                                          <FaInbox color='white' />
                                          <Text
                                            px='2'
                                            fontSize='sm'
                                            fontWeight='regular'
                                            color='white'
                                          >
                                            Inbox
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
                                          <MdSettings color='white' />
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
                                          <FaExchangeAlt color='white' />
                                          <Text
                                            px='2'
                                            fontSize='sm'
                                            fontWeight='regular'
                                            color='white'
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
                                          <FaSignOutAlt color='white' />
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
                          border={mode(
                            '1px solid #624AF2',
                            '1px solid #EB00FF',
                          )}
                          bgGradient={mode(
                            'linear(to-br, secondaryGradient.900, secondary.900)',
                            'linear(to-br, primaryGradient.900, primary.900)',
                          )}
                          bgClip='text'
                          size='sm'
                          fontWeight='regular'
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
        </Container>
      </Box>
    </Box>
  );
};

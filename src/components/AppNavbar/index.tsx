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
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Hooks
import { useOrganization } from '@common/hooks';

// Components
import { Card } from '@components/Card';
import { ContractCallButton } from '@widgets/ContractCallButton';

// Icons
import { FaEllipsisH } from 'react-icons/fa';

// Components
import { WalletConnectButton } from '@components/WalletConnectButton';
import { AdminModal } from '@components/Modal';

// Web3
import { useUser, useAuth, useNetwork } from '@micro-stacks/react';
import { fetchAccountStxBalance, fetchNamesByAddress } from 'micro-stacks/api';
import { uintCV } from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from 'micro-stacks/transactions';

// Utils
import { stxToUstx, truncate, ustxToStx } from '@common/helpers';
import Avatar from 'boring-avatars';

export const AppNavbar = () => {
  const { network } = useNetwork();
  const [bns, setBns] = useState<string | undefined>('');
  const [balance, setBalance] = useState<string | undefined>('');
  const { organization } = useOrganization();
  const { currentStxAddress } = useUser();
  const { isSignedIn, handleSignIn, handleSignOut } = useAuth();
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
                      <HStack
                        cursor='pointer'
                        spacing='2'
                        color={mode('base.900', 'light.900')}
                      >
                        <HStack px='2'>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            {balance}{' '}
                          </Text>
                          <Text
                            as='span'
                            fontSize='sm'
                            fontWeight='regular'
                            color='gray.900'
                          >
                            STX
                          </Text>
                        </HStack>
                        <Avatar
                          size={10}
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

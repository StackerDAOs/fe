import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  ButtonGroup,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Tab,
  Tabs,
  TabList,
  TabIndicator,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';

// Icons
import { FiMenu } from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';

// Components
// import { ColorModeSwitcher } from '@components/ColorModeSwitcher';
import { WalletConnectButton } from '@components/WalletConnectButton';
import { ProjectsPopover } from '@components/ProjectsPopover';

// Web3
import { useUser, useNetwork, useIsSignedIn } from '@micro-stacks/react';
import { fetchNamesByAddress } from 'micro-stacks/api';

// Utils
import { truncate } from '@utils/truncate-str';

export const AppNavbar = ({ daoName, address }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bns, setBns] = useState<string | undefined>('');
  const { currentStxAddress } = useUser();
  const isSignedIn = useIsSignedIn();
  const { network } = useNetwork();
  const { colorMode } = useColorMode();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
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
      <Box as='nav'>
        <Container py={{ base: '4', lg: '5' }}>
          <HStack justify='space-around' spacing='8'>
            <Link href='/'>
              <Image
                cursor='pointer'
                height='35px'
                src='/img/logo-only.png'
                alt='logo'
              />
            </Link>
            {isDesktop ? (
              <>
                <Flex justify='space-between' flex='1'>
                  <Tabs color='white' isFitted variant='unstyled'>
                    <TabList>
                      {[
                        null,
                        'Proposals',
                        'Vault',
                        'Activity',
                        'Extensions',
                      ].map((item) => (
                        <Tab
                          key={item}
                          fontSize='md'
                          color='gray.900'
                          _first={{ display: 'none' }}
                          _selected={{ color: 'light.900' }}
                        >
                          {item}
                        </Tab>
                      ))}
                    </TabList>
                  </Tabs>
                  <HStack spacing='3'>
                    <Button color='white'>{daoName}</Button>
                    <Button color='white'>{address}</Button>
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

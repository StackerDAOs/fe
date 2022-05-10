import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Icons
import { FiMenu } from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';

// Components
// import { ColorModeSwitcher } from '@components/ColorModeSwitcher';
import { WalletConnectButton } from '@components/WalletConnectButton';

// Web3
import { useUser, useNetwork, useIsSignedIn } from '@micro-stacks/react';
import { fetchNamesByAddress } from 'micro-stacks/api';

// Utils
import { truncate } from '@utils/truncate-str';

export const Navbar = () => {
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
        <Container py={{ base: '3', lg: '4' }}>
          <Flex justify='space-between'>
            <HStack spacing='4' cursor='pointer'>
              <Link href='/'>
                {colorMode === 'dark' ? (
                  <Image height='40px' src='/img/logo-only.png' alt='logo' />
                ) : (
                  <Image height='40px' src='/img/logo-only.png' alt='logo' />
                )}
              </Link>
            </HStack>
            {isDesktop ? (
              <HStack>
                <ButtonGroup spacing='6' alignItems='center'>
                  {currentStxAddress && (
                    <HStack spacing='2' color={mode('base.900', 'light.900')}>
                      <FaCircle
                        color={mode('#624AF2', '#EB00FF')}
                        fontSize='15px'
                        aria-label='Connected'
                      />
                      <Text color={mode('base.900', 'light.900')} fontSize='md'>
                        {bns ? bns : truncate(currentStxAddress, 4, 4)}
                      </Text>
                    </HStack>
                  )}
                  <WalletConnectButton
                    border={mode('1px solid #624AF2', '1px solid #EB00FF')}
                    bgGradient={mode(
                      'linear(to-br, secondaryGradient.900, secondary.900)',
                      'linear(to-br, primaryGradient.900, primary.900)',
                    )}
                    bgClip='text'
                    size='md'
                    fontWeight='regular'
                    _hover={{ opacity: 0.9 }}
                    _active={{ opacity: 1 }}
                  />
                  {/* <ColorModeSwitcher justifySelf='flex-end' /> */}
                </ButtonGroup>
              </HStack>
            ) : (
              <IconButton
                variant='ghost'
                icon={<FiMenu fontSize='1.25rem' />}
                aria-label='Open Menu'
              />
            )}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

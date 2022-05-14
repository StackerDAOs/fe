import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  ButtonGroup,
  Button,
  Container,
  HStack,
  IconButton,
  Image,
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
        <Container py={{ base: '4', lg: '5' }}>
          <HStack justify='space-between'>
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
                <HStack spacing='5'>
                  <ButtonGroup color='white' spacing='8'>
                    <ProjectsPopover />
                  </ButtonGroup>
                  <Link href='/dashboard/dao'>
                    <Button color='white'>Use app</Button>
                  </Link>
                </HStack>
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

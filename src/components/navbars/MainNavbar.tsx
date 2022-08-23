import React from 'react';
import Link from 'next/link';
import {
  Box,
  ButtonGroup,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

// Components
import { Nav } from '@components/containers';
import { MobileAppNavbar } from '@components/navbars';
import { CustomPopover } from '@components/popovers';
import { WalletConnectButton } from '@components/buttons';
import { LogoIcon } from '@components/icons';

// Hooks
import { useAccountBalance } from '@lib/hooks';

// Web3
import { useAccount, useAuth } from '@micro-stacks/react';

// Utils
import { ustxToStx } from '@common/helpers';

const Navbar = () => {
  const { stxAddress } = useAccount();
  const { isSignedIn } = useAuth();
  const { data } = useAccountBalance();
  const isMobile = useBreakpointValue({ base: true, sm: false });

  if (isMobile) return <MobileAppNavbar />;

  return (
    <Flex justify='flex-end' flex='1'>
      <HStack spacing='3'>
        <ButtonGroup spacing='6' alignItems='center'>
          {isSignedIn ? (
            <HStack cursor='pointer' spacing='5' color='light.900'>
              <HStack spacing='1'>
                <Text fontSize='md' fontWeight='medium' color='light.900'>
                  {ustxToStx(data?.account?.balance)}{' '}
                </Text>
                <Text
                  as='span'
                  fontSize='md'
                  fontWeight='medium'
                  color='gray.900'
                >
                  STX
                </Text>
              </HStack>
              <HStack spacing='1'>
                <CustomPopover />
              </HStack>
            </HStack>
          ) : null}

          {!stxAddress && (
            <WalletConnectButton
              color='base.900'
              size='sm'
              fontWeight='medium'
              bg='light.900'
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
            />
          )}
        </ButtonGroup>
      </HStack>
    </Flex>
  );
};

export const MainNavbar = () => {
  return (
    <Box as='section' height='5vh'>
      <Nav bg='base.900' borderBottom='1px solid' borderColor='base.900'>
        <HStack justify='space-between' spacing='2'>
          <Link href={`/`}>
            <LogoIcon cursor='pointer' height='35px' />
          </Link>
          <Navbar />
        </HStack>
      </Nav>
    </Box>
  );
};

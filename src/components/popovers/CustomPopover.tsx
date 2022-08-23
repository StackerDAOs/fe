import React from 'react';
import {
  Button,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';

// Components
import { Card } from '@components/cards';

// Hooks
import { useAccountBalance } from '@lib/hooks';

// Web3
import { useAccount, useAuth } from '@micro-stacks/react';

// Utils
import { truncate } from '@common/helpers';

export const CustomPopover = () => {
  const { stxAddress } = useAccount();
  const { openAuthRequest, signOut } = useAuth();
  const { data } = useAccountBalance();
  const switchAccount = () => {
    openAuthRequest();
  };
  const handleSignOut = () => {
    signOut();
    localStorage.setItem('chakra-ui-color-mode', 'dark');
  };

  return (
    <Popover
      trigger='hover'
      openDelay={0}
      placement='bottom-start'
      defaultIsOpen={false}
    >
      <PopoverTrigger>
        <Button
          color='light.900'
          size='md'
          rounded='full'
          px='5'
          bg='base.800'
          border='1px solid'
          borderColor='base.500'
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 1 }}
        >
          <Text
            fontSize='sm'
            fontWeight='medium'
            color='light.900'
            letterSpacing='0.025em'
          >
            {data?.bns?.names[0]?.bns
              ? data?.bns?.names[0]?.bns
              : stxAddress && truncate(stxAddress, 4, 4)}
          </Text>
        </Button>
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
                    fontSize='md'
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
                    fontSize='md'
                    fontWeight='regular'
                    color='white'
                    onClick={handleSignOut}
                  >
                    Disconnect
                  </Text>
                </HStack>
              </Card>
            </Stack>
          </Stack>
        </SimpleGrid>
      </PopoverContent>
    </Popover>
  );
};

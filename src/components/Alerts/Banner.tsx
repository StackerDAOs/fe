import React from 'react';
import {
  Box,
  Button,
  CloseButton,
  Icon,
  Square,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

export const Banner = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box
      bgGradient='linear(to-l, secondary.900, secondaryGradient.900)'
      w='85%'
      px={{ base: '4', md: '3' }}
      py={{ base: '4', md: '2.5' }}
      position='fixed'
      bottom='5vh'
      left='50%'
      transform='translate(-50%, 0)'
      borderRadius='xl'
    >
      <CloseButton
        display={{ sm: 'none' }}
        position='absolute'
        right='2'
        top='2'
      />
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        justify='space-between'
        spacing={{ base: '3', md: '2' }}
        pb='0.5'
      >
        <Stack
          spacing='4'
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'start', md: 'center' }}
        >
          {!isMobile && (
            <Square size='12' bg='bg-subtle' borderRadius='md'>
              <Icon as={FiInfo} boxSize='6' />
            </Square>
          )}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: '0.5', md: '1.5' }}
            pe={{ base: '4', sm: '0' }}
          >
            <Text fontWeight='medium'>A new proposal is ready for voting.</Text>
            <Text color='muted'>6 more days until voting ends.</Text>
          </Stack>
        </Stack>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={{ base: '3', sm: '2' }}
          align={{ base: 'stretch', sm: 'center' }}
        >
          <Button color='primary' width='full'>
            View
          </Button>
          <CloseButton display={{ base: 'none', sm: 'inline-flex' }} />
        </Stack>
      </Stack>
    </Box>
  );
};

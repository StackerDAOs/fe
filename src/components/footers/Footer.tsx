import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';

import { LogoWithName } from '@components/icons';

export const Footer = () => {
  return (
    <Box mt='10vh' role='contentinfo' py={{ base: '12', md: '16' }} px='9'>
      <Stack spacing={{ base: '4', md: '5' }}>
        <HStack justify='space-between' align='flex-start'>
          <Stack>
            <ButtonGroup variant='ghost'>
              <LogoWithName height='50' />
            </ButtonGroup>
            <Text fontSize='sm' color='gray.900'>
              &copy; {new Date().getFullYear()} StackerDAO Labs Inc. All rights
              reserved.
            </Text>
          </Stack>
          <Stack direction='row' spacing='4'>
            <Stack spacing='4' minW='36' flex='1'>
              <Text fontSize='sm' fontWeight='semibold' color='gray.900'>
                Product
              </Text>
              <Stack spacing='3' shouldWrapChildren>
                <Button color='light.900' variant='link'>
                  Documentation
                </Button>
                <Button color='light.900' variant='link'>
                  Github
                </Button>
              </Stack>
            </Stack>
            <Stack spacing='4' minW='36' flex='1'>
              <Text fontSize='sm' fontWeight='semibold' color='gray.900'>
                Legal
              </Text>
              <Stack spacing='3' shouldWrapChildren>
                <Button color='light.900' variant='link'>
                  Terms
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </HStack>
      </Stack>
    </Box>
  );
};

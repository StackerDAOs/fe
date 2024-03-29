import {
  Box,
  Button,
  HStack,
  Stack,
  Square,
  Icon,
  IconButton,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

import { FiSend } from 'react-icons/fi';
import { FiExternalLink } from 'react-icons/fi';

export const ProposalList = () => {
  return (
    <Box color={mode('base.900', 'light.900')}>
      <Stack spacing='5'>
        <Stack spacing='1'>
          <Stack
            spacing='3'
            py={{ base: '0', md: '2', lg: '2' }}
            direction={{ base: 'column-reverse', md: 'row' }}
          >
            <Button
              maxW='md'
              color='white'
              bgGradient={mode(
                'linear(to-br, secondaryGradient.900, secondary.900)',
                'linear(to-br, primaryGradient.900, primary.900)',
              )}
              border='none'
              size='md'
              fontSize='md'
              fontWeight='regular'
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
            >
              Create proposal
            </Button>
          </Stack>
          <Text fontSize='sm' color='base.400'>
            Please pay the outstanding amount by the end of the following month.
          </Text>
        </Stack>
        <Box>
          {[
            {
              description: '1,200 sent to',
              value: 'SP123...98765',
            },
            {
              description: '420 sent to',
              value: 'SP987...41D98',
            },
            {
              description: '69,420 deposited to',
              value: 'SP987...41D98',
            },
          ].map((data) => (
            <Stack
              key={data.value}
              as={Box}
              role='group'
              justify='space-between'
              direction={{ base: 'column', md: 'row' }}
              spacing='5'
              p={{ base: '0', md: '3' }}
              _hover={{
                bg: mode('light.700', 'base.700'),
                borderRadius: 'lg',
              }}
            >
              <HStack spacing='3'>
                <Square
                  size='10'
                  bg={mode('light.800', 'base.800')}
                  borderRadius='lg'
                  _groupHover={{
                    bg: mode('light.900', 'base.900'),
                  }}
                >
                  <Icon as={FiSend} boxSize='5' />
                </Square>
                <Box fontSize='sm'>
                  <Text color='empahsized' fontWeight='medium'>
                    {data.description}
                  </Text>
                  <Text color='muted'>{data.value}</Text>
                </Box>
              </HStack>
              <IconButton
                icon={<FiExternalLink />}
                bg={mode('light.800', 'base.800')}
                _groupHover={{
                  bg: mode('light.900', 'base.900'),
                }}
                aria-label='Edit member'
              />
            </Stack>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

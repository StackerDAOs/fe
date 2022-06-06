import {
  Box,
  HStack,
  Stack,
  Square,
  Icon,
  IconButton,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Icons
import { FiSend } from 'react-icons/fi';
import { FiExternalLink } from 'react-icons/fi';

import { ActionModal } from '@components/Modal';

export const ActivityList = () => {
  const isActivated = true;

  return (
    <Box
      color={mode('base.900', 'light.900')}
      opacity={isActivated ? 1 : 0.25}
      pointerEvents={isActivated ? 'auto' : 'none'}
      style={isActivated ? { cursor: 'default' } : { cursor: 'not-allowed' }}
    >
      <Stack>
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

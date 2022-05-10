import * as React from 'react';
import {
  Button,
  Heading,
  VStack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

export const DashboardProfile = () => {
  return (
    <VStack maxW='xl' spacing='5' alignItems='baseline'>
      <Heading
        size='sm'
        fontWeight='regular'
        color={mode('base.900', 'light.900')}
      >
        You have {''}
        <Text
          as='span'
          maxW='xl'
          color={mode('base.900', 'light.900')}
          bgGradient={mode(
            'linear(to-br, secondaryGradient.900, secondary.900)',
            'linear(to-br, primaryGradient.900, primary.900)',
          )}
          bgClip='text'
        >
          3 mfers
        </Text>
      </Heading>
      <Text
        maxW='xl'
        color={mode('base.900', 'light.900')}
        style={{ margin: '5px 0 10px 0' }}
      >
        Representing{' '}
        <Text as='span' maxW='xl' mx='auto' fontSize='md' fontWeight='semibold'>
          3% of the total supply
        </Text>
      </Text>
      <Button
        color='white'
        isFullWidth
        bgGradient={mode(
          'linear(to-br, secondaryGradient.900, secondary.900)',
          'linear(to-br, primaryGradient.900, primary.900)',
        )}
        size='md'
        fontSize='md'
        fontWeight='regular'
        _active={{ opacity: 1 }}
      >
        Create a proposal
      </Button>
    </VStack>
  );
};

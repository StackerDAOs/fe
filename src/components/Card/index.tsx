import * as React from 'react';
import { Box, BoxProps, useColorModeValue as mode } from '@chakra-ui/react';

export const Card = (props: BoxProps) => (
  <Box
    minH='36'
    bg={mode('light.900', 'base.800')}
    borderRadius='lg'
    {...props}
  />
);

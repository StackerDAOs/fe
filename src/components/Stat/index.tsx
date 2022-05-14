import * as React from 'react';
import {
  Box,
  BoxProps,
  Flex,
  useColorModeValue as mode,
} from '@chakra-ui/react';

interface StatProps extends BoxProps {
  title: string;
  children: React.ReactNode;
}
export const Stat = (props: StatProps) => {
  const { title, children, ...rest } = props;
  return (
    <Box {...rest}>
      <Flex as='dl' direction='column-reverse'>
        <Box as='dt' color={mode('gray.900', 'gray.900')}>
          {title}
        </Box>
      </Flex>
      <Box color={mode('base.900', 'light.900')} fontWeight='medium'>
        {children}
      </Box>
    </Box>
  );
};

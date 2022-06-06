import { Box, BoxProps } from '@chakra-ui/react';

export const Card = (props: BoxProps) => (
  <Box
    minH='35'
    minW='100%'
    bg='base.700'
    borderRadius='lg'
    border='1px solid'
    borderColor='base.500'
    {...props}
  />
);

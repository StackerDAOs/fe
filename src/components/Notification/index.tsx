import {
  Box,
  Flex,
  FlexProps,
  useColorModeValue as mode,
} from '@chakra-ui/react';

export const Notification = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex direction='row-reverse'>
      <Box
        bg={mode('light.700', 'base.700')}
        boxShadow={mode('light.900', 'base.200')}
        borderRadius='lg'
        {...flexProps}
      >
        {children}
      </Box>
    </Flex>
  );
};

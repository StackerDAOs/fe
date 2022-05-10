import {
  useToast,
  UseToastOptions,
  Box,
  useColorModeValue as mode,
} from '@chakra-ui/react';

export const Toast = () => {
  const toast = useToast();

  const toastImplementation = (props: UseToastOptions) => {
    return toast({
      position: 'top-right',
      isClosable: true,
      render: () => (
        <Box
          bg={mode('base.800', 'light.800')}
          color={mode('light.900', 'base.900')}
          w='100%'
          p={4}
          borderRadius='8px'
        >
          {props.title}
        </Box>
      ),
    });
  };

  return toastImplementation;
};

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react';

export const ErrorAlertBanner = () => {
  return (
    <Alert status='error'>
      <AlertIcon />
      <Box>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription fontSize='sm'>
          This proposal was submitted outside of the UI and its code has not
          been verified by StackerDAOs. Executing this proposal may have
          unintended consequences.
        </AlertDescription>
      </Box>
    </Alert>
  );
};

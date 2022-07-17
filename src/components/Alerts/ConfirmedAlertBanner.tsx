import { Alert, AlertIcon, AlertDescription, Box } from '@chakra-ui/react';

export const ConfirmedAlertBanner = () => {
  return (
    <Alert colorScheme='white' status='success'>
      <AlertIcon />
      <Box>
        <AlertDescription fontSize='sm'>
          This proposal was created using StackerDAOs
        </AlertDescription>
      </Box>
    </Alert>
  );
};

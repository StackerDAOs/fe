import { Button, ButtonGroup, Stack, Text, useToast } from '@chakra-ui/react';

import { Notification } from '@components/Notification';
import { CloseButton } from '@components/CloseButton';

export const TransactionNotification = ({ title }: any) => {
  const toast = useToast();

  const onSuccess = () => {
    return toast({
      duration: null,
      isClosable: false,
      position: 'bottom-right',
      render: () => (
        <Notification>
          <Stack direction='row' p='4' spacing='3'>
            <Stack spacing='2.5'>
              <Stack spacing='1'>
                <Text fontSize='md' color='light.900' fontWeight='medium'>
                  Transaction Submitted
                </Text>
                <Text fontSize='sm' color='gray.900'>
                  Your transaction was submitted successfully.
                </Text>
              </Stack>
              <ButtonGroup variant='link' size='sm' spacing='2'>
                <Button color='secondary.900' target='_blank'>
                  View transaction
                </Button>
              </ButtonGroup>
            </Stack>
          </Stack>
        </Notification>
      ),
    });
  };

  return onSuccess();
};

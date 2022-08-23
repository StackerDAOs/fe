import React from 'react';
import type { ButtonProps } from '@chakra-ui/react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Input,
  Stack,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { TransferForm } from '@components/forms';

export const TransferProposal = (props: ButtonProps) => {
  const focusField = React.useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button {...props} onClick={onOpen}>
        Create proposal
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        size='lg'
        onClose={onClose}
        initialFocusRef={focusField}
      >
        <DrawerOverlay />
        <DrawerContent bg='base.900'>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>
          <DrawerBody>
            <Stack spacing='3'>
              <VStack spacing='2' align='flex-start'>
                <FormControl>
                  <FormLabel>Proposal contract</FormLabel>
                  <Input
                    id='bootstrapContract'
                    bg='base.800'
                    borderColor='base.500'
                    autoComplete='off'
                    placeholder='ST...'
                    ref={focusField}
                  />
                </FormControl>
              </VStack>
              <VStack spacing='2' align='flex-start'>
                <TransferForm />
              </VStack>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

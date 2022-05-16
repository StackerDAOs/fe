import { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  useColorModeValue as mode,
} from '@chakra-ui/react';

import { sendFunds } from '@utils/proposals';

export const ActionModal = ({ payload, children }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [state, setState] = useState({ amount: 0, recipientAddress: '' });

  return (
    <>
      {payload.button.type === 'primary' ? (
        <Button
          color='white'
          bgGradient={mode(
            'linear(to-br, secondaryGradient.900, secondary.900)',
            'linear(to-br, primaryGradient.900, primary.900)',
          )}
          px='8'
          size='md'
          fontSize='md'
          fontWeight='semibold'
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 1 }}
          onClick={onOpen}
        >
          {payload.button.title}
        </Button>
      ) : (
        <Button
          maxW='md'
          color='white'
          bg='base.800'
          border='1px solid'
          borderColor='base.500'
          size='md'
          fontSize='sm'
          fontWeight='regular'
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 1 }}
          onClick={onOpen}
        >
          {payload.button.title}
        </Button>
      )}

      <Modal
        blockScrollOnMount={true}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size='full'
      >
        <ModalOverlay />
        <ModalContent
          bg={mode('light.700', 'base.900')}
          color={mode('base.700', 'light.900')}
        >
          <ModalHeader>{payload.header}</ModalHeader>
          {children}
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={payload.action.event}>
              {payload.action.title}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

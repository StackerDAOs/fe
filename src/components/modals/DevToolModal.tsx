import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

type Props = {
  title: string;
  children?: React.ReactNode;
};

export const DevToolModal = ({ title, children }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant='link'
        cursor='pointer'
        color='light.900'
        fontWeight='medium'
        fontSize='xs'
        size='xs'
        onClick={onOpen}
      >
        {title}
      </Button>

      <Modal
        blockScrollOnMount={true}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size='md'
      >
        <ModalOverlay />
        <ModalContent bg='base.900' color='light.900'>
          <ModalHeader>Dev Tools</ModalHeader>
          {children}
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

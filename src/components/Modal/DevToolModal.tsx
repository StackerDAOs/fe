import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Text,
  useDisclosure,
  useColorModeValue as mode,
} from '@chakra-ui/react';

export const DevToolModal = ({ title, children }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        cursor='pointer'
        color='light.900'
        bg='secondary.900'
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
          <ModalHeader>Admin</ModalHeader>
          {children}
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

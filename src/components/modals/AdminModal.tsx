import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

export const AdminModal = ({ title, children }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text
        cursor='pointer'
        color='light.900'
        fontWeight='regular'
        fontSize='sm'
        onClick={onOpen}
      >
        {title}
      </Text>

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

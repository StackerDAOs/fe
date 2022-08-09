import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

import { FaPlus } from 'react-icons/fa';

export const DepositModal = ({ children }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <FaPlus cursor='pointer' onClick={onOpen} />
      <Modal
        blockScrollOnMount={true}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size='lg'
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

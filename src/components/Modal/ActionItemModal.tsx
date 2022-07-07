import {
  Badge,
  CloseButton,
  Heading,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  Stack,
  Spinner,
  VStack,
  Text,
} from '@chakra-ui/react';

import { map } from 'lodash';

// Components
import { ContractCardList } from '@components/ContractCardList';
import { EmptyState } from '@components/EmptyState';

// Queries
import { useContracts, useTransaction } from '@common/queries';

// Animations
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';
import { FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';

// Utils

export const ActionItemModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading: isLoadingContracts, data: contracts }: any =
    useContracts();
  const latestTransactionId = map(contracts, 'transactionId')[
    contracts?.length - 1
  ];
  const { isLoading: isLoadingTransaction, data: transaction } =
    useTransaction(latestTransactionId);

  if (isLoadingContracts) {
    return <EmptyState heading='Loading contracts...' />;
  }

  return (
    <>
      {contracts?.length > 0 ? (
        <HStack onClick={onOpen} cursor='pointer'>
          <Badge bg='base.800' color='secondary.900' size='xs' py='1' px='3'>
            <HStack spacing='2'>
              {!isLoadingTransaction && transaction?.tx_status === 'pending' ? (
                <Spinner size='xs' />
              ) : (
                <FaExclamationCircle />
              )}
              <Text fontSize='xs'>You have action items to complete</Text>
            </HStack>
          </Badge>
        </HStack>
      ) : (
        <HStack onClick={onOpen} cursor='pointer'>
          <Badge bg='base.800' color='secondary.900' size='xs' py='1' px='3'>
            <HStack spacing='2'>
              <FaInfoCircle />
              <Text fontSize='xs'>No action items</Text>
            </HStack>
          </Badge>
        </HStack>
      )}

      <Modal
        blockScrollOnMount={true}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size='xl'
      >
        <ModalOverlay />
        <ModalContent
          bg='base.900'
          borderColor='base.500'
          borderWidth='1px'
          color='light.900'
          py='5'
          px='8'
        >
          <CloseButton
            onClick={onClose}
            color='gray.900'
            position='absolute'
            right='2'
            top='2'
          />
          {/* <motion.div
            variants={FADE_IN_VARIANTS}
            initial={FADE_IN_VARIANTS.hidden}
            animate={FADE_IN_VARIANTS.enter}
            exit={FADE_IN_VARIANTS.exit}
            transition={{ duration: 0.75, type: 'linear' }}
          >
            <VStack spacing='4' align='flex-start'>
              <Stack
                spacing='2'
                direction={{ base: 'column', md: 'column' }}
                justify='flex-start'
                color='white'
              >
                <Text color='gray.900' fontSize='sm'>
                  Submit and review contracts you deploy before submitting them
                  as proposals.
                </Text>
              </Stack>
            </VStack>
            <motion.div
              variants={FADE_IN_VARIANTS}
              initial={FADE_IN_VARIANTS.hidden}
              animate={FADE_IN_VARIANTS.enter}
              exit={FADE_IN_VARIANTS.exit}
              transition={{ duration: 0.25, type: 'linear' }}
            >
              <Stack w='auto' spacing='5' my='3'>
                <ContractCardList />
              </Stack>
            </motion.div>
          </motion.div> */}
          <motion.div
            variants={FADE_IN_VARIANTS}
            initial={FADE_IN_VARIANTS.hidden}
            animate={FADE_IN_VARIANTS.enter}
            exit={FADE_IN_VARIANTS.exit}
            transition={{ duration: 0.75, type: 'linear' }}
          >
            <Stack
              spacing='2'
              mb='6'
              direction={{ base: 'column', md: 'row' }}
              justify='flex-start'
              color='white'
            >
              <VStack maxW='xl' spacing='2' align='flex-start'>
                <Heading size='sm' fontWeight='light' color='light.900'>
                  Action items
                </Heading>
                <HStack spacing='3'>
                  <Stack spacing='2' direction='row'>
                    <Text color='gray.900' fontSize='sm' fontWeight='regular'>
                      Once your proposals have deployed, you will need to submit
                      them for a vote. All proposals that you deploy from the
                      StackerDAO UI will show up below.
                    </Text>
                  </Stack>
                </HStack>
              </VStack>
            </Stack>
            <motion.div
              variants={FADE_IN_VARIANTS}
              initial={FADE_IN_VARIANTS.hidden}
              animate={FADE_IN_VARIANTS.enter}
              exit={FADE_IN_VARIANTS.exit}
              transition={{ duration: 0.25, type: 'linear' }}
            >
              <Stack w='auto' spacing='3'>
                <ContractCardList />
              </Stack>
            </motion.div>
          </motion.div>
        </ModalContent>
      </Modal>
    </>
  );
};

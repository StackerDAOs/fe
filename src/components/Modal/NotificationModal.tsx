import { useRouter } from 'next/router';
import {
  CloseButton,
  Heading,
  HStack,
  Stack,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

// Web3
import { useUser } from '@micro-stacks/react';

// Hooks
import { useSubmissions } from '@common/hooks';

// Components
import { EmptyState } from '@components/EmptyState';
import { ContractCardList } from '@components/ContractCardList';

//  Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';
import Avatar from 'boring-avatars';

// Utils
import { truncate } from '@common/helpers';

export const NotificationModal = ({ title }: any) => {
  const { currentStxAddress } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { dao } = router.query as any;
  const { proposals: submissions } = useSubmissions();

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
        size='4xl'
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
          <motion.div
            variants={FADE_IN_VARIANTS}
            initial={FADE_IN_VARIANTS.hidden}
            animate={FADE_IN_VARIANTS.enter}
            exit={FADE_IN_VARIANTS.exit}
            transition={{ duration: 0.75, type: 'linear' }}
          >
            <Stack
              spacing='2'
              mt='4'
              mb='6'
              direction={{ base: 'column', md: 'row' }}
              justify='flex-start'
              color='white'
            >
              <VStack maxW='xl' spacing='2' align='flex-start'>
                <Avatar
                  size={50}
                  name={currentStxAddress}
                  variant='beam'
                  colors={[
                    '#50DDC3',
                    '#624AF2',
                    '#EB00FF',
                    '#7301FA',
                    '#25C2A0',
                  ]}
                />
                <Heading size='sm' pb='2' fontWeight='light' color='light.900'>
                  {currentStxAddress && truncate(currentStxAddress, 4, 4)}
                </Heading>
                <HStack spacing='3'>
                  <Stack spacing='2' direction='row'>
                    <Text fontSize='sm' fontWeight='regular'>
                      Contracts deployed
                    </Text>
                    <Text color='gray.900' fontSize='sm' fontWeight='semibold'>
                      3
                    </Text>
                  </Stack>
                  <Stack spacing='2' direction='row'>
                    <Text fontSize='sm' fontWeight='regular'>
                      Proposals submitted
                    </Text>
                    <Text color='gray.900' fontSize='sm' fontWeight='semibold'>
                      1
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
              <Stack w='auto' spacing='5'>
                <Stack spacing='1' maxW='lg'>
                  <Text fontSize='lg' fontWeight='medium'>
                    Action items
                  </Text>
                  <Text color='gray.900' fontSize='sm'>
                    Manage contracts that you deploy by viewing the source code,
                    submitting as proposals, or removing them.
                  </Text>
                </Stack>
                <motion.div
                  variants={FADE_IN_VARIANTS}
                  initial={FADE_IN_VARIANTS.hidden}
                  animate={FADE_IN_VARIANTS.enter}
                  exit={FADE_IN_VARIANTS.exit}
                  transition={{ duration: 0.25, type: 'linear' }}
                >
                  <Stack w='auto' spacing='5'>
                    {submissions?.length > 0 ? (
                      <ContractCardList submissions={submissions} />
                    ) : (
                      <EmptyState
                        heading='No contracts found.'
                        linkTo={`/d/${dao}/proposals/c/survey`}
                        buttonTitle='Create proposal'
                        isDisabled={false}
                      />
                    )}
                  </Stack>
                </motion.div>
              </Stack>
            </motion.div>
          </motion.div>
        </ModalContent>
      </Modal>
    </>
  );
};
import {
  Button,
  ButtonProps,
  Heading,
  IconButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

// Animations
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from 'lib/animation';

// Icons
import { FaArrowRight } from 'react-icons/fa';
import { HiroIcon, XverseIcon } from '@components/icons';

export const ConnectWalletModal = (props: ButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button {...props} onClick={onOpen}>
        Connect
      </Button>

      <Modal
        blockScrollOnMount
        isCentered
        closeOnOverlayClick
        isOpen={isOpen}
        onClose={onClose}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent
          bg='base.900'
          borderColor='base.500'
          borderWidth='1px'
          color='light.900'
          py='8'
          px='8'
        >
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
                  Connect your wallet
                </Heading>
                <HStack spacing='3'>
                  <Stack spacing='2' direction='row'>
                    <Text color='gray.900' fontSize='sm' fontWeight='regular'>
                      You need a wallet to use StackerDAOs. A wallet gives you
                      the ability to interact with the StackerDAO protocol, like
                      submitting proposals and voting.
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
                <a
                  href='https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj'
                  target='_blank'
                  rel='noreferrer'
                >
                  <Stack
                    px='3'
                    py='3'
                    bg='base.900'
                    borderRadius='lg'
                    border='1px solid'
                    borderColor='base.500'
                    _hover={{ bg: 'base.800' }}
                  >
                    <HStack justify='space-between'>
                      <HStack spacing='6'>
                        <HiroIcon h='12' w='12' />
                        <Stack spacing='0'>
                          <Text color='light.900'>Hiro wallet</Text>
                          <Text color='gray.900' size='xs'>
                            Browser extension for Chrome
                          </Text>
                        </Stack>
                      </HStack>
                      <Stack>
                        <IconButton
                          icon={<FaArrowRight fontSize='0.75em' />}
                          bg='none'
                          color='light.900'
                          size='md'
                          aria-label='Transfer'
                        />
                      </Stack>
                    </HStack>
                  </Stack>
                </a>
                <a
                  href='https://www.xverse.app/'
                  target='_blank'
                  rel='noreferrer'
                >
                  <Stack
                    px='3'
                    py='3'
                    bg='base.900'
                    borderRadius='lg'
                    border='1px solid'
                    borderColor='base.500'
                    _hover={{ bg: 'base.800' }}
                  >
                    <HStack justify='space-between'>
                      <HStack spacing='6'>
                        <XverseIcon h='12' w='12' />
                        <Stack spacing='0'>
                          <Text color='light.900'>Xverse wallet</Text>
                          <Text color='gray.900' size='xs'>
                            Mobile browser for Stacks
                          </Text>
                        </Stack>
                      </HStack>
                      <Stack>
                        <IconButton
                          icon={<FaArrowRight fontSize='0.75em' />}
                          bg='none'
                          color='light.900'
                          size='md'
                          aria-label='Transfer'
                        />
                      </Stack>
                    </HStack>
                  </Stack>
                </a>
              </Stack>
            </motion.div>
          </motion.div>
        </ModalContent>
      </Modal>
    </>
  );
};

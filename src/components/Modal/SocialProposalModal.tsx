import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Badge,
  Button,
  ButtonGroup,
  CloseButton,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

// Web3
import { useUser, useNetwork } from '@micro-stacks/react';
import { fetchTransaction } from 'micro-stacks/api';

// Hooks
import { useOrganization } from '@common/hooks';
import { useForm } from 'react-hook-form';
import { usePolling } from '@common/hooks';

// Components
import { Card } from '@components/Card';
import { SocialProposalButton } from '@components/Actions';
import { ProposeButton } from '@components/Actions/ProposeButton';

// Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

// Utils
import { truncate, formatComments } from '@common/helpers';
import Avatar from 'boring-avatars';

// Store
import { useStore } from 'store/TransactionStore';

export const SocialProposalModal = ({ icon }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentStxAddress } = useUser();
  const { network } = useNetwork();
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization }: any = useOrganization({ name: dao });
  const { transaction, setTransaction } = useStore();
  const [state, setState] = useState<any>({
    name: '',
    symbol: '',
    decimals: '',
    tokenUri: '',
    isDeployed: false,
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm();
  const { description } = getValues();

  useEffect(() => {
    setTransaction({ txId: '', data: {} });
  }, [organization, isOpen]);

  const onSubmit = (data: any) => {
    console.log({ data });
    setState({ ...state, inReview: true });
  };

  usePolling(() => {
    fetchTransactionData(transaction?.txId);
  }, transaction.txId);

  async function fetchTransactionData(transactionId: string) {
    try {
      const transaction = await fetchTransaction({
        url: network.getCoreApiUrl(),
        txid: transactionId,
        event_offset: 0,
        event_limit: 0,
      });
      if (transaction?.tx_status === 'success') {
        setState({
          ...state,
          isDeployed: true,
          transactionId: transaction?.tx_id,
        });
        setTransaction({ txId: '', data: {} });
      }
      console.log({ transaction });
    } catch (e: any) {
      console.log({ e });
    }
  }

  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={icon}
        size='md'
        bg='base.800'
        border='1px solid'
        borderColor='base.500'
        aria-label='Transfer'
        _hover={{ bg: 'base.500' }}
      />
      <Modal
        blockScrollOnMount={true}
        isCentered
        closeOnOverlayClick={transaction?.txId ? false : true}
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
          {state.inReview ? (
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
                    name='Social'
                    variant='bauhaus'
                    colors={[
                      '#50DDC3',
                      '#624AF2',
                      '#EB00FF',
                      '#7301FA',
                      '#25C2A0',
                    ]}
                  />
                  <HStack spacing='3' align='center'>
                    <Heading
                      size='sm'
                      pb='2'
                      fontWeight='light'
                      color='light.900'
                    >
                      Social Proposal
                    </Heading>
                    {transaction?.txId && !state.isDeployed && (
                      <Stack spacing='2' direction='row'>
                        <Badge
                          variant='subtle'
                          bg='base.800'
                          color='secondary.900'
                          px='4'
                          py='1'
                        >
                          <HStack spacing='2'>
                            <Spinner
                              size='xs'
                              color='secondary.900'
                              speed='0.75s'
                            />
                            <Text>Deploying contract</Text>
                          </HStack>
                        </Badge>
                      </Stack>
                    )}
                  </HStack>
                  <HStack spacing='3'>
                    <Stack spacing='2' direction='row'>
                      <Text fontSize='sm' fontWeight='regular'>
                        Type
                      </Text>
                      <Text
                        color='gray.900'
                        fontSize='sm'
                        fontWeight='semibold'
                      >
                        Social
                      </Text>
                    </Stack>
                    <Stack spacing='2' direction='row'>
                      <Text fontSize='sm' fontWeight='regular'>
                        Author
                      </Text>
                      <Text
                        color='gray.900'
                        fontSize='sm'
                        fontWeight='semibold'
                      >
                        {currentStxAddress && truncate(currentStxAddress, 4, 4)}
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
                <Stack w='auto' spacing='2'>
                  <motion.div
                    variants={FADE_IN_VARIANTS}
                    initial={FADE_IN_VARIANTS.hidden}
                    animate={FADE_IN_VARIANTS.enter}
                    exit={FADE_IN_VARIANTS.exit}
                    transition={{ duration: 0.25, type: 'linear' }}
                  >
                    <Stack w='auto' spacing='5'>
                      <Card
                        bg='base.900'
                        border='1px solid'
                        borderColor='base.500'
                      >
                        <Stack
                          spacing='6'
                          my='0'
                          mx='3'
                          p='3'
                          direction={{ base: 'column', md: 'column' }}
                          justify='space-between'
                          color='white'
                        >
                          <Stack spacing='3'>
                            <Stack w='100%' spacing='1' py='2'>
                              <Text
                                color='gray.900'
                                fontSize='sm'
                                mb={{ base: '10px', md: '0px' }}
                              >
                                Details
                              </Text>
                              <Text
                                fontSize='md'
                                fontWeight='regular'
                                color='light.900'
                              >
                                {description && truncate(description, 75, 0)}
                              </Text>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Card>
                      <ButtonGroup
                        spacing='3'
                        alignItems='space-between'
                        justifyContent='space-between'
                      >
                        {state.isDeployed && (
                          <ProposeButton
                            organization={organization}
                            transactionId={state.transactionId}
                            _hover={{ opacity: 0.9 }}
                            _active={{ opacity: 1 }}
                          />
                        )}

                        {state.isDeployed || transaction?.txId ? null : (
                          <SocialProposalButton
                            organization={organization}
                            isSubmitting={isSubmitting}
                            description={formatComments(description)}
                          />
                        )}
                      </ButtonGroup>
                    </Stack>
                  </motion.div>
                </Stack>
              </motion.div>
            </motion.div>
          ) : (
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
                    name='Social'
                    variant='bauhaus'
                    colors={[
                      '#50DDC3',
                      '#624AF2',
                      '#EB00FF',
                      '#7301FA',
                      '#25C2A0',
                    ]}
                  />
                  <Heading
                    size='sm'
                    pb='2'
                    fontWeight='light'
                    color='light.900'
                  >
                    Social Proposal
                  </Heading>
                  <HStack spacing='3'>
                    <Stack spacing='2' direction='row'>
                      <Text fontSize='sm' fontWeight='regular'>
                        Type
                      </Text>
                      <Text
                        color='gray.900'
                        fontSize='sm'
                        fontWeight='semibold'
                      >
                        Social
                      </Text>
                    </Stack>
                    <Stack spacing='2' direction='row'>
                      <Text fontSize='sm' fontWeight='regular'>
                        Author
                      </Text>
                      <Text
                        color='gray.900'
                        fontSize='sm'
                        fontWeight='semibold'
                      >
                        {currentStxAddress && truncate(currentStxAddress, 4, 4)}
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
                <Stack w='auto' spacing='2'>
                  <Stack spacing='1' maxW='lg'>
                    <Text fontSize='lg' fontWeight='medium'>
                      Details
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
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack
                          spacing='6'
                          direction={{ base: 'column', md: 'column' }}
                          justify='space-between'
                          color='white'
                        >
                          <Stack spacing='5'>
                            <Stack
                              spacing='1'
                              borderBottom='1px solid'
                              borderBottomColor='base.500'
                            >
                              <FormControl>
                                <Textarea
                                  type='text'
                                  color='light.900'
                                  fontSize='md'
                                  py='1'
                                  px='2'
                                  pl='0'
                                  bg='base.900'
                                  border='none'
                                  rows={6}
                                  resize='none'
                                  autoComplete='off'
                                  placeholder='Provide some additional context for the proposal'
                                  {...register('description', {
                                    required: 'This is required',
                                  })}
                                  _focus={{
                                    border: 'none',
                                  }}
                                />
                              </FormControl>
                            </Stack>
                            <HStack width='full' justify='space-between'>
                              <Button
                                type='submit'
                                variant='outline'
                                borderColor='base.500'
                                isFullWidth
                                bg='base.900'
                                color='whiteAlpha'
                                _hover={{
                                  bg: 'base.800',
                                }}
                              >
                                Submit & Review
                              </Button>
                            </HStack>
                          </Stack>
                        </Stack>
                      </form>
                    </Stack>
                  </motion.div>
                </Stack>
              </motion.div>
            </motion.div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

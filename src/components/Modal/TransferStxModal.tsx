import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  ButtonGroup,
  CloseButton,
  FormControl,
  Heading,
  HStack,
  Image,
  Input,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
  Stack,
  Text,
  Textarea,
  Tooltip,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';

// Web3
import { useUser, useNetwork } from '@micro-stacks/react';
import { fetchTransaction } from 'micro-stacks/api';

// Hooks
import { useForm, Controller } from 'react-hook-form';
import { usePolling } from '@common/hooks';

// Queries
import { useAuth, useDAO, useToken } from '@common/queries';

// Components
import { Card } from '@components/Card';
import { TransferStxButton } from '@components/Actions';
import { ProposeButton } from '@components/Actions/ProposeButton';

// Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

// Utils
import {
  truncate,
  formatComments,
  validateStacksAddress,
  microToStacks,
} from '@common/helpers';
import Avatar from 'boring-avatars';

// Store
import { useStore } from 'store/TransactionStore';

import { FaArrowRight } from 'react-icons/fa';

export const TransferStxModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentStxAddress } = useUser();
  const { network } = useNetwork();
  const { dao } = useDAO();
  const { proposeData } = useAuth();
  const { token, balance } = useToken();
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
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  const { transferAmount, transferTo, description } = getValues();

  useEffect(() => {
    setTransaction({ txId: '', data: {} });
  }, [dao, isOpen, currentStxAddress, proposeData?.canPropose]);

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
    } catch (e: any) {
      console.error({ e });
    }
  }

  const onCloseModal = () => {
    setState({ ...state, inReview: false });
    onClose();
  };

  const tooltipProps = {
    isDisabled: proposeData?.canPropose,
  };

  return (
    <>
      <Tooltip
        bg='base.900'
        color='light.900'
        label={`${proposeData?.proposeThreshold} ${token?.symbol} required for proposals`}
        my='3'
        w='sm'
        {...tooltipProps}
      >
        <IconButton
          onClick={onOpen}
          disabled={!proposeData?.canPropose}
          icon={<FaArrowRight />}
          size='sm'
          bg='base.800'
          border='1px solid'
          borderColor='base.500'
          aria-label='Transfer'
          _hover={{ bg: 'base.500' }}
        />
      </Tooltip>
      <Modal
        blockScrollOnMount={true}
        isCentered
        closeOnOverlayClick={transaction?.txId ? false : true}
        isOpen={isOpen}
        onClose={onCloseModal}
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
            onClick={onCloseModal}
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
                    size={40}
                    name='Transfer STX'
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
                      Transfer STX Proposal
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
                        Required
                      </Text>
                      <Text
                        color='gray.900'
                        fontSize='sm'
                        fontWeight='semibold'
                      >
                        {Number(proposeData?.proposeThreshold)} {token?.symbol}
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
                            <Stack
                              w='100%'
                              spacing='1'
                              py='2'
                              borderBottom='1px solid'
                              borderBottomColor='base.500'
                            >
                              <Text
                                color='gray.900'
                                fontWeight='regular'
                                fontSize='sm'
                                mb={{ base: '10px', md: '0px' }}
                              >
                                Transferring
                              </Text>

                              <HStack>
                                <Image
                                  cursor='pointer'
                                  height='15px'
                                  src='https://cryptologos.cc/logos/stacks-stx-logo.png?v=022'
                                  alt='logo'
                                />

                                <Text
                                  fontSize='md'
                                  fontWeight='regular'
                                  color='light.900'
                                >
                                  {transferAmount} STX
                                </Text>
                              </HStack>
                            </Stack>
                            <Stack
                              w='100%'
                              spacing='1'
                              py='2'
                              borderBottom='1px solid'
                              borderBottomColor='base.500'
                            >
                              <Text
                                color='gray.900'
                                fontSize='sm'
                                mb={{ base: '10px', md: '0px' }}
                              >
                                Destination
                              </Text>
                              <HStack>
                                <Avatar
                                  size={15}
                                  name={transferTo}
                                  variant='beam'
                                  colors={[
                                    '#50DDC3',
                                    '#624AF2',
                                    '#EB00FF',
                                    '#7301FA',
                                    '#25C2A0',
                                  ]}
                                />

                                <Text
                                  fontSize='md'
                                  fontWeight='regular'
                                  color='light.900'
                                >
                                  {transferTo && truncate(transferTo, 4, 4)}
                                </Text>
                              </HStack>
                            </Stack>
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
                            organization={dao}
                            transactionId={state.transactionId}
                            _hover={{ opacity: 0.9 }}
                            _active={{ opacity: 1 }}
                          />
                        )}

                        {state.isDeployed || transaction?.txId ? null : (
                          <TransferStxButton
                            organization={dao}
                            isSubmitting={isSubmitting}
                            description={formatComments(description)}
                            transferAmount={transferAmount}
                            transferTo={transferTo}
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
                    size={40}
                    name='Transfer STX'
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
                    Transfer STX Proposal
                  </Heading>
                  <HStack spacing='3'>
                    <Stack spacing='2' direction='row'>
                      <Text fontSize='sm' fontWeight='regular'>
                        Required
                      </Text>
                      <Text
                        color='gray.900'
                        fontSize='sm'
                        fontWeight='semibold'
                      >
                        {Number(proposeData?.proposeThreshold)} {token?.symbol}
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
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack
                          spacing='6'
                          my='0'
                          direction={{ base: 'column', md: 'column' }}
                          justify='space-between'
                          color='white'
                        >
                          <Stack spacing='5'>
                            <Stack
                              spacing='2'
                              py='2'
                              borderBottom='1px solid'
                              borderColor='base.500'
                            >
                              <Stack spacing='1' maxW='lg'>
                                <Text fontSize='lg' fontWeight='medium'>
                                  Amount
                                </Text>
                              </Stack>
                              <FormControl>
                                <Input
                                  color='light.900'
                                  py='1'
                                  px='2'
                                  pl='0'
                                  type='tel'
                                  min='0'
                                  bg='base.900'
                                  border='none'
                                  fontSize='lg'
                                  autoComplete='off'
                                  placeholder='0'
                                  {...register('transferAmount', {
                                    required: 'This is required',
                                    validate: (value) =>
                                      Number(value) <=
                                      microToStacks(
                                        balance?.stx?.balance,
                                        false,
                                      ),
                                  })}
                                  _focus={{
                                    border: 'none',
                                  }}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name='transferTo'
                                  render={() => (
                                    <p>
                                      {errors?.transferAmount?.type
                                        ? 'This is required'
                                        : ''}
                                    </p>
                                  )}
                                />
                              </FormControl>
                              <HStack>
                                <Image
                                  cursor='pointer'
                                  height='15px'
                                  src='https://cryptologos.cc/logos/stacks-stx-logo.png?v=022'
                                  alt='logo'
                                />

                                <Text
                                  fontSize='md'
                                  fontWeight='regular'
                                  color='gray.900'
                                >
                                  STX
                                </Text>
                              </HStack>
                            </Stack>

                            <Stack
                              spacing='2'
                              py='2'
                              borderBottom='1px solid'
                              borderColor='base.500'
                            >
                              <Stack direction='column'>
                                <Stack spacing='1' maxW='lg'>
                                  <Text fontSize='lg' fontWeight='medium'>
                                    Destination address
                                  </Text>
                                </Stack>
                              </Stack>
                              <FormControl>
                                <Controller
                                  control={control}
                                  name='transferTo'
                                  rules={{
                                    required: {
                                      value: true,
                                      message:
                                        'Destination address is required.',
                                    },
                                    validate: (value) =>
                                      validateStacksAddress(value),
                                  }}
                                  render={({
                                    field: { onChange, onBlur, value },
                                  }) => (
                                    <>
                                      <Input
                                        color='light.900'
                                        py='0'
                                        px='2'
                                        pl='0'
                                        my='2'
                                        type='tel'
                                        bg='base.900'
                                        border='none'
                                        fontSize='lg'
                                        autoComplete='off'
                                        placeholder='SP1T...'
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        _focus={{
                                          border: 'none',
                                        }}
                                      />
                                      <HStack>
                                        <Avatar
                                          size={15}
                                          name={value}
                                          variant='beam'
                                          colors={[
                                            '#50DDC3',
                                            '#624AF2',
                                            '#EB00FF',
                                            '#7301FA',
                                            '#25C2A0',
                                          ]}
                                        />

                                        <Text
                                          fontSize='md'
                                          fontWeight='regular'
                                          color='gray.900'
                                        >
                                          {value && truncate(value, 4, 4)}
                                        </Text>
                                      </HStack>
                                    </>
                                  )}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name='transferTo'
                                  render={() => <p>Invalid Stacks Address</p>}
                                />
                              </FormControl>
                            </Stack>
                            <Stack
                              spacing='1'
                              borderBottom='1px solid'
                              borderBottomColor='base.500'
                            >
                              <Stack direction='column'>
                                <Stack spacing='1' maxW='lg'>
                                  <Text fontSize='lg' fontWeight='medium'>
                                    Details
                                  </Text>
                                </Stack>
                              </Stack>
                              <FormControl>
                                <Textarea
                                  type='text'
                                  color='light.900'
                                  fontSize='lg'
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
                                    required: {
                                      value: true,
                                      message: 'Proposal details are required.',
                                    },
                                    minLength: {
                                      value: 25,
                                      message:
                                        'Proposal details must be at least 25 characters.',
                                    },
                                  })}
                                  _focus={{
                                    border: 'none',
                                  }}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name='description'
                                  render={({ message }) => <p>{message}</p>}
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

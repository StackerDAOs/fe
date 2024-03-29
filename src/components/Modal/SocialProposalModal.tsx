import { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  CloseButton,
  FormControl,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  Stack,
  Text,
  Textarea,
  Tooltip,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

// Web3
import { useAccount } from '@micro-stacks/react';

// Hooks
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

// Queries
import { useAuth, useDAO, useToken } from '@common/queries';

// Components
import { Card } from '@components/Card';
import { SocialProposalButton } from '@components/Actions';

// Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

// Utils
import { truncate, formatComments, tokenToDecimals } from '@common/helpers';
import Avatar from 'boring-avatars';
import { FaPlusCircle } from 'react-icons/fa';

export const SocialProposalModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { stxAddress } = useAccount();
  const { dao } = useDAO();
  const { proposeData } = useAuth();
  const { token } = useToken();
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
    reset,
    formState: { errors },
  } = useForm();
  const { description } = getValues();

  useEffect(() => {
    reset({
      description: '',
    });
  }, [dao, isOpen, proposeData]);

  const onSubmit = (data: any) => {
    console.log({ data });
    setState({ ...state, inReview: true });
  };

  const onCloseModal = () => {
    reset({
      description: '',
    });
    setState({ ...state, isDeployed: false, inReview: false });
    onClose();
  };

  const tooltipProps = {
    isDisabled: proposeData?.canPropose,
    shouldWrapChildren: !proposeData?.canPropose,
  };

  return (
    <>
      <Stack align='center' minH='15px'>
        <Tooltip
          bg='base.900'
          color='light.900'
          label={`${tokenToDecimals(
            Number(proposeData?.proposeThreshold),
            2,
          )} ${token?.symbol} required for proposals`}
          w='sm'
          {...tooltipProps}
        >
          <Icon
            cursor='pointer'
            onClick={proposeData?.canPropose ? onOpen : () => console.log(null)}
            as={FaPlusCircle}
            color='whiteAlpha'
            fontSize='sm'
          />
        </Tooltip>
      </Stack>
      <Modal
        blockScrollOnMount={true}
        isCentered
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
                mb='6'
                direction={{ base: 'column', md: 'row' }}
                justify='flex-start'
                color='white'
              >
                <VStack maxW='xl' spacing='2' align='flex-start'>
                  <Avatar
                    size={40}
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
                  </HStack>
                  <HStack spacing='3'>
                    <Stack spacing='2' direction='row'>
                      <Text fontSize='sm' fontWeight='regular'>
                        Required
                      </Text>
                      <Text color='gray.900' fontSize='sm' fontWeight='regular'>
                        {tokenToDecimals(
                          Number(proposeData?.proposeThreshold),
                          2,
                        )}{' '}
                        {token?.symbol}
                      </Text>
                    </Stack>
                    <Stack spacing='2' direction='row'>
                      <Text fontSize='sm' fontWeight='regular'>
                        Author
                      </Text>
                      <Text color='gray.900' fontSize='sm' fontWeight='regular'>
                        {stxAddress && truncate(stxAddress, 4, 4)}
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
                        <SocialProposalButton
                          organization={dao}
                          closeOnDeploy={onCloseModal}
                          description={formatComments(description)}
                        />
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
                mb='6'
                direction={{ base: 'column', md: 'row' }}
                justify='flex-start'
                color='white'
              >
                <VStack maxW='xl' spacing='2' align='flex-start'>
                  <Avatar
                    size={40}
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
                        Required
                      </Text>
                      <Text color='gray.900' fontSize='sm' fontWeight='regular'>
                        {Number(proposeData?.proposeThreshold)} {token?.symbol}
                      </Text>
                    </Stack>
                    <Stack spacing='2' direction='row'>
                      <Text fontSize='sm' fontWeight='regular'>
                        Author
                      </Text>
                      <Text color='gray.900' fontSize='sm' fontWeight='regular'>
                        {stxAddress && truncate(stxAddress, 4, 4)}
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

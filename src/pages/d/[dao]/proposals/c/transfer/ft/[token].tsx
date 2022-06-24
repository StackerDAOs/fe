import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Icon,
  Image,
  FormControl,
  HStack,
  Input,
  Stack,
  Textarea,
  VStack,
  Spinner,
  Text,
} from '@chakra-ui/react';

// Web3
import { useNetwork } from '@micro-stacks/react';
import { fetchTransaction, fetchReadOnlyFunction } from 'micro-stacks/api';

// Hooks
import { useOrganization } from '@common/hooks';
import { useForm } from 'react-hook-form';
import { useStep } from '@common/hooks/use-step';
import { usePolling } from '@common/hooks';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { VerticalStep } from '@components/VerticalStep';
import { TransferTokenButton } from '@components/Actions';
import { ProposeButton } from '@components/Actions/ProposeButton';

//  Animation
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

// Utils
import { formatComments, truncate } from '@common/helpers';
import Avatar from 'boring-avatars';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

// Store
import { useStore } from 'store/TransactionStore';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const Token = () => {
  const { network } = useNetwork();
  const router = useRouter();
  const { dao, token } = router.query as any;
  const { organization }: any = useOrganization({ name: dao });
  const { transaction, setTransaction } = useStore();
  const [state, setState] = useState<any>({
    name: '',
    symbol: '',
    decimals: '',
    tokenUri: '',
    isDeployed: false,
  });
  const { isDeployed } = state;
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  const { transferAmount, transferTo, description } = getValues();
  const [currentStep, { setStep }] = useStep({
    maxStep: 4,
    initialStep: 0,
  });
  const handleGoBack = () => {
    setTransaction({ txId: '', data: {} });
    router.back();
  };
  const onSubmit = (data: any) => {
    console.log({ data });
    setStep(currentStep + 1);
  };

  useEffect(() => {
    const fetchAssetData = async ({ contractAddress, contractName }: any) => {
      const senderAddress = `${contractAddress}.${contractName}`;
      const name = await fetchReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        senderAddress,
        functionArgs: [],
        functionName: 'get-name',
      });
      const symbol = await fetchReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        senderAddress,
        functionArgs: [],
        functionName: 'get-symbol',
      });
      const decimals = await fetchReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        senderAddress,
        functionArgs: [],
        functionName: 'get-decimals',
      });
      const tokenUri = await fetchReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        senderAddress,
        functionArgs: [],
        functionName: 'get-token-uri',
      });
      setState({ ...state, name, symbol, decimals, tokenUri });
      return {
        name,
        symbol,
        decimals,
        tokenUri,
      };
    };
    try {
      if (token) {
        fetchAssetData({
          contractAddress: token?.split('.')[0],
          contractName: token?.split('.')[1],
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [organization, router.isReady]);

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

  const transferAssetsSteps = [
    {
      title: `How many ${state.symbol} are you transferring?`,
      description:
        currentStep <= 0 ? (
          <></>
        ) : (
          <HStack>
            <Avatar
              size={15}
              name={state.symbol}
              variant='marble'
              colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
            />
            <Text fontSize='md' fontWeight='medium' color='light.900'>
              {transferAmount}
            </Text>
            <Text fontSize='md' fontWeight='regular' color='gray.900'>
              {state.symbol}
            </Text>
          </HStack>
        ),
    },
    {
      title: `Where are the ${state.symbol} going?`,
      description:
        currentStep <= 1 ? (
          <></>
        ) : (
          <HStack>
            <FiSend fontSize='0.9rem' />
            <Text fontSize='md' fontWeight='medium' color='light.900'>
              {transferTo && truncate(transferTo, 4, 8)}
            </Text>
          </HStack>
        ),
    },
    {
      title: 'Provide some context for the proposal',
      description:
        currentStep <= 2 ? (
          <></>
        ) : (
          <Text fontSize='md' fontWeight='medium' color='light.900'>
            {description && truncate(description, 75, 0)}
          </Text>
        ),
    },

    {
      title: 'Review & Submit',
      description: null,
    },
  ];

  const TransferDetails = () => {
    return (
      <>
        <Stack
          spacing='0'
          mb='2'
          direction={{ base: 'column', md: 'column' }}
          justify='space-between'
          color='white'
        >
          <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
            Transfer amount
          </Text>
          <Stack direction='column'>
            <Text fontSize='sm' fontWeight='regular' color='gray.900'>
              Enter the amount of {state.symbol} that will be transferred.
            </Text>
          </Stack>
        </Stack>
        <Stack color='light.900' spacing='5' direction='column' maxW='xs'>
          <Stack color='light.900' direction='column' my='2'>
            <FormControl>
              <Input
                color='light.900'
                py='1'
                px='2'
                pl='0'
                maxW='8em'
                type='tel'
                bg='base.900'
                border='none'
                fontSize='3xl'
                autoComplete='off'
                placeholder='0'
                {...register('transferAmount', {
                  required: 'This is required',
                })}
                _focus={{
                  border: 'none',
                }}
              />
            </FormControl>
            <HStack>
              <Avatar
                size={15}
                name={state.symbol}
                variant='marble'
                colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
              />

              <Text fontSize='md' fontWeight='regular' color='gray.900'>
                {state.symbol}
              </Text>
            </HStack>
          </Stack>
          <HStack justify='flex-start'>
            <Button
              isFullWidth
              color='white'
              onClick={() => setStep(currentStep + 1)}
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
            >
              Next
            </Button>
          </HStack>
        </Stack>
      </>
    );
  };

  const RecipientDetails = () => {
    return (
      <>
        <Stack
          spacing='0'
          mb='5'
          direction={{ base: 'column', md: 'column' }}
          justify='space-between'
          color='white'
        >
          <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
            Destination
          </Text>
          <Stack direction='column'>
            <Text fontSize='sm' fontWeight='regular' color='gray.900'>
              Enter the {state.symbol} address where the funds will be sent.
            </Text>
          </Stack>
        </Stack>
        <Stack color='light.900' spacing='5' direction='column' maxW='xl'>
          <Stack color='light.900' direction='column' my='0'>
            <FormControl>
              <Input
                color='light.900'
                py='1'
                px='2'
                pl='0'
                type='tel'
                bg='base.900'
                border='none'
                fontSize='xl'
                autoComplete='off'
                placeholder='SP1T...'
                {...register('transferTo', {
                  required: 'This is required',
                })}
                _focus={{
                  border: 'none',
                }}
              />
            </FormControl>
          </Stack>
          <HStack justify='space-between' spacing='10'>
            <Button
              color='white'
              variant='link'
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
              onClick={() => setStep(currentStep - 1)}
            >
              Previous
            </Button>
            <Button
              minW='20%'
              color='white'
              onClick={() => setStep(currentStep + 1)}
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
            >
              Next
            </Button>
          </HStack>
        </Stack>
      </>
    );
  };

  const ProposalDetails = () => {
    return (
      <>
        <Stack
          spacing='0'
          mb='5'
          direction={{ base: 'column', md: 'column' }}
          justify='space-between'
          color='white'
        >
          <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
            Proposal details
          </Text>
          <Stack direction='column'>
            <Text fontSize='sm' fontWeight='regular' color='gray.900'>
              Provide some additional context for the proposal.
            </Text>
          </Stack>
        </Stack>
        <Stack color='light.900' spacing='6' direction='column' maxW='xl'>
          <FormControl>
            <Textarea
              type='text'
              color='light.900'
              fontSize='xl'
              py='1'
              px='2'
              pl='0'
              bg='base.900'
              border='none'
              rows={10}
              resize='none'
              autoComplete='off'
              placeholder='Transfers 100 STX to SP14...T78Y for...'
              {...register('description', {
                required: 'This is required',
              })}
              _focus={{
                border: 'none',
              }}
            />
          </FormControl>
          <HStack justify='space-between'>
            <Button
              color='white'
              variant='link'
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
              onClick={() => setStep(currentStep - 1)}
            >
              Previous
            </Button>
            <Button
              minW='20%'
              color='white'
              onClick={() => setStep(currentStep + 1)}
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
            >
              Next
            </Button>
          </HStack>
        </Stack>
      </>
    );
  };

  const ProposalReview = () => {
    return (
      <>
        <Stack
          maxW='md'
          spacing='8'
          mx='auto'
          direction={{ base: 'column', md: 'column' }}
          justify='space-between'
          align='center'
          color='white'
        >
          <Stack mb='5' align='center' spacing='3'>
            <Avatar
              size={50}
              name='MDP Transfer Tokens'
              variant='bauhaus'
              colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
            />
            <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
              MDP Transfer Tokens
            </Text>
          </Stack>
          <Stack
            display='contents'
            justify='space-between'
            align='center'
            spacing='5'
          >
            <Stack
              justifyContent='space-between'
              borderBottom='1px solid'
              borderBottomColor='base.500'
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems='center'
              w='100%'
            >
              <Text
                color='gray.900'
                fontWeight='medium'
                mb={{ base: '10px', md: '0px' }}
              >
                Transferring
              </Text>
              <Flex
                align='center'
                flexDirection={{ base: 'column', md: 'row' }}
                mb={{ base: '20px', md: '0px' }}
              >
                <HStack>
                  <Avatar
                    size={15}
                    name={state.symbol}
                    variant='marble'
                    colors={[
                      '#50DDC3',
                      '#624AF2',
                      '#EB00FF',
                      '#7301FA',
                      '#25C2A0',
                    ]}
                  />
                  <Text fontSize='md' fontWeight='medium' color='light.900'>
                    {transferAmount}
                  </Text>
                  <Text fontSize='md' fontWeight='regular' color='gray.900'>
                    {state.symbol}
                  </Text>
                </HStack>
                <Button
                  variant='setup'
                  px='24px'
                  onClick={() => console.log('edit')}
                  fontSize='md'
                  fontWeight='500'
                >
                  Edit
                </Button>
              </Flex>
            </Stack>
            <Stack
              justifyContent='space-between'
              borderBottom='1px solid'
              borderBottomColor='base.500'
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems='center'
              w='100%'
            >
              <Text
                color='gray.900'
                fontSize='md'
                mb={{ base: '10px', md: '0px' }}
              >
                To
              </Text>
              <Flex
                align='center'
                flexDirection={{ base: 'column', md: 'row' }}
                mb={{ base: '20px', md: '0px' }}
              >
                <HStack>
                  <FiSend fontSize='0.9rem' />
                  <Text fontSize='md' fontWeight='medium' color='light.900'>
                    {transferTo && truncate(transferTo, 4, 8)}
                  </Text>
                </HStack>
                <Button
                  variant='setup'
                  px='24px'
                  onClick={() => console.log('edit')}
                  fontSize='md'
                  fontWeight='500'
                >
                  Edit
                </Button>
              </Flex>
            </Stack>
            <Stack w='100%' spacing='1'>
              <Text
                color='gray.900'
                fontSize='md'
                mb={{ base: '10px', md: '0px' }}
              >
                Details
              </Text>
              <Text fontSize='md' fontWeight='regular' color='light.900'>
                {description && truncate(description, 75, 0)}
              </Text>
            </Stack>
          </Stack>
          <HStack width='full' justify='space-between'>
            <Button
              color='white'
              variant='link'
              fontSize='md'
              size='md'
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
              onClick={() => setStep(currentStep - 1)}
            >
              Previous
            </Button>
            <TransferTokenButton
              organization={organization}
              isSubmitting={isSubmitting}
              description={formatComments(description)}
              assetAddress={token}
              tokenDecimals={Number(state?.decimals)}
              transferAmount={transferAmount}
              transferTo={transferTo}
            />
          </HStack>
        </Stack>
      </>
    );
  };

  const ProposalDeploy = () => {
    return (
      <>
        <Stack
          maxW='md'
          spacing='8'
          mx='auto'
          direction={{ base: 'column', md: 'column' }}
          justify='space-between'
          align='center'
          color='white'
        >
          <Stack mb='5' align='center' spacing='3'>
            <Avatar
              size={50}
              name='MDP Transfer Tokens'
              variant='bauhaus'
              colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
            />
            <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
              MDP Transfer Tokens
            </Text>
          </Stack>
          <Stack
            display='contents'
            justify='space-between'
            align='center'
            spacing='5'
          >
            <Stack
              justifyContent='space-between'
              borderBottom='1px solid'
              borderBottomColor='base.500'
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems='center'
              w='100%'
            >
              <Text
                color='gray.900'
                fontWeight='medium'
                mb={{ base: '10px', md: '0px' }}
              >
                Transferring
              </Text>
              <Flex
                align='center'
                flexDirection={{ base: 'column', md: 'row' }}
                mb={{ base: '20px', md: '0px' }}
              >
                <HStack>
                  <Avatar
                    size={15}
                    name={state.symbol}
                    variant='marble'
                    colors={[
                      '#50DDC3',
                      '#624AF2',
                      '#EB00FF',
                      '#7301FA',
                      '#25C2A0',
                    ]}
                  />
                  <Text fontSize='md' fontWeight='medium' color='light.900'>
                    {transferAmount}
                  </Text>
                  <Text fontSize='md' fontWeight='regular' color='gray.900'>
                    {state.symbol}
                  </Text>
                </HStack>
                <Button
                  variant='setup'
                  px='24px'
                  onClick={() => console.log('edit')}
                  fontSize='md'
                  fontWeight='500'
                >
                  Edit
                </Button>
              </Flex>
            </Stack>
            <Stack
              justifyContent='space-between'
              borderBottom='1px solid'
              borderBottomColor='base.500'
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems='center'
              w='100%'
            >
              <Text
                color='gray.900'
                fontSize='md'
                mb={{ base: '10px', md: '0px' }}
              >
                To
              </Text>
              <Flex
                align='center'
                flexDirection={{ base: 'column', md: 'row' }}
                mb={{ base: '20px', md: '0px' }}
              >
                <HStack>
                  <FiSend fontSize='0.9rem' />
                  <Text fontSize='md' fontWeight='medium' color='light.900'>
                    {transferTo && truncate(transferTo, 4, 8)}
                  </Text>
                </HStack>
                <Button
                  variant='setup'
                  px='24px'
                  onClick={() => console.log('edit')}
                  fontSize='md'
                  fontWeight='500'
                >
                  Edit
                </Button>
              </Flex>
            </Stack>
            <Stack w='100%' spacing='1'>
              <Text
                color='gray.900'
                fontSize='md'
                mb={{ base: '10px', md: '0px' }}
              >
                Details
              </Text>
              <Text fontSize='md' fontWeight='regular' color='light.900'>
                {description && truncate(description, 75, 0)}
              </Text>
            </Stack>
          </Stack>
          <HStack width='full' justify='space-between'>
            <Button
              color='white'
              variant='link'
              fontSize='md'
              size='md'
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
              onClick={() => setStep(currentStep - 1)}
            >
              Previous
            </Button>
            <TransferTokenButton
              organization={organization}
              isSubmitting={isSubmitting}
              description={formatComments(description)}
              assetAddress={token}
              tokenDecimals={Number(state?.decimals)}
              transferAmount={transferAmount}
              transferTo={transferTo}
            />
          </HStack>
        </Stack>
      </>
    );
  };

  const ViewStep = () => {
    switch (currentStep) {
      case 0:
        return <TransferDetails />;
      case 1:
        return <RecipientDetails />;
      case 2:
        return <ProposalDetails />;
      case 3:
        return <ProposalReview />;
      case 4:
        return <ProposalDeploy />;
      default:
        return <></>;
    }
  };

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Grid
        h='95vh'
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(6, 1fr)'
      >
        <GridItem
          rowSpan={2}
          colSpan={2}
          bg='base.900'
          borderRight='1px solid'
          borderColor='base.800'
          px={{ base: '20', md: '20' }}
          py={{ base: '10', md: '10' }}
        >
          <Box as='section'>
            <VStack
              align='left'
              spacing='5'
              mb='3'
              direction={{ base: 'column', md: 'row' }}
              justify='space-between'
              color='white'
            >
              <Stack spacing='0' my='5'>
                <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
                  Transfer Proposal
                </Text>
                <Text fontSize='sm' fontWeight='regular' color='gray.900'>
                  Complete the following steps to deploy a smart contract for
                  transferring {state.symbol} from the DAO.
                </Text>
              </Stack>
              {transferAssetsSteps.map((step, id) => (
                <VerticalStep
                  key={id}
                  cursor='pointer'
                  title={step.title}
                  description={step.description}
                  isActive={currentStep === id}
                  isCompleted={currentStep > id}
                  isLastStep={transferAssetsSteps.length === id + 1}
                />
              ))}
            </VStack>
          </Box>
        </GridItem>

        <GridItem
          rowSpan={2}
          colSpan={4}
          bg='base.900'
          px={{ base: '15', md: '20' }}
          py={{ base: '15', md: '20' }}
        >
          <Container>
            {transaction.txId ||
              (!isDeployed && (
                <HStack
                  position='relative'
                  bottom='3'
                  cursor='pointer'
                  onClick={handleGoBack}
                  color='gray.900'
                  _hover={{
                    textDecoration: 'underline',
                    color: 'light.900',
                  }}
                >
                  <FaArrowLeft fontSize='0.9rem' />
                  <Text>Back</Text>
                </HStack>
              ))}
            {transaction.txId ? (
              <Stack
                maxW='md'
                spacing='8'
                mx='auto'
                direction={{ base: 'column', md: 'column' }}
                justify='space-between'
                align='center'
                color='white'
              >
                <Stack mb='5' align='center' spacing='3'>
                  <Avatar
                    size={50}
                    name='MDP Transfer STX'
                    variant='bauhaus'
                    colors={[
                      '#50DDC3',
                      '#624AF2',
                      '#EB00FF',
                      '#7301FA',
                      '#25C2A0',
                    ]}
                  />
                  <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
                    MDP Transfer Tokens
                  </Text>
                  <HStack justify='center' my='3'>
                    <Badge
                      variant='subtle'
                      bg='base.800'
                      color='secondary.900'
                      px='3'
                      py='2'
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
                  </HStack>
                </Stack>
                <Stack
                  display='contents'
                  justify='space-between'
                  align='center'
                  spacing='5'
                >
                  <Stack
                    justifyContent='space-between'
                    borderBottom='1px solid'
                    borderBottomColor='base.500'
                    flexDirection={{ base: 'column', md: 'row' }}
                    alignItems='center'
                    w='100%'
                  >
                    <Text
                      color='gray.900'
                      fontWeight='medium'
                      mb={{ base: '10px', md: '0px' }}
                    >
                      Transferring
                    </Text>
                    <Flex
                      align='center'
                      flexDirection={{ base: 'column', md: 'row' }}
                      mb={{ base: '20px', md: '0px' }}
                    >
                      <HStack>
                        <Avatar
                          size={15}
                          name={state.symbol}
                          variant='marble'
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
                          fontWeight='medium'
                          color='light.900'
                        >
                          {transferAmount}
                        </Text>
                        <Text
                          fontSize='md'
                          fontWeight='regular'
                          color='gray.900'
                        >
                          {state.symbol}
                        </Text>
                      </HStack>
                      <Button
                        variant='setup'
                        px='24px'
                        onClick={() => console.log('edit')}
                        fontSize='md'
                        fontWeight='500'
                      >
                        Edit
                      </Button>
                    </Flex>
                  </Stack>
                  <Stack
                    justifyContent='space-between'
                    borderBottom='1px solid'
                    borderBottomColor='base.500'
                    flexDirection={{ base: 'column', md: 'row' }}
                    alignItems='center'
                    w='100%'
                  >
                    <Text
                      color='gray.900'
                      fontSize='md'
                      mb={{ base: '10px', md: '0px' }}
                    >
                      To
                    </Text>
                    <Flex
                      align='center'
                      flexDirection={{ base: 'column', md: 'row' }}
                      mb={{ base: '20px', md: '0px' }}
                    >
                      <HStack>
                        <FiSend fontSize='0.9rem' />
                        <Text
                          fontSize='md'
                          fontWeight='medium'
                          color='light.900'
                        >
                          {transferTo && truncate(transferTo, 4, 8)}
                        </Text>
                      </HStack>
                      <Button
                        variant='setup'
                        px='24px'
                        onClick={() => console.log('edit')}
                        fontSize='md'
                        fontWeight='500'
                      >
                        Edit
                      </Button>
                    </Flex>
                  </Stack>
                  <Stack w='100%' spacing='1'>
                    <Text
                      color='gray.900'
                      fontSize='md'
                      mb={{ base: '10px', md: '0px' }}
                    >
                      Details
                    </Text>
                    <Text fontSize='md' fontWeight='regular' color='light.900'>
                      {description && truncate(description, 75, 0)}
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            ) : isDeployed ? (
              <Stack
                maxW='md'
                spacing='8'
                mx='auto'
                direction={{ base: 'column', md: 'column' }}
                justify='space-between'
                align='center'
                color='white'
              >
                <Confetti
                  height={1200}
                  width={1280}
                  recycle={false}
                  numberOfPieces={250}
                  gravity={0.15}
                  colors={[
                    '#50DDC3',
                    '#624AF2',
                    '#EB00FF',
                    '#7301FA',
                    '#25C2A0',
                  ]}
                />
                <Stack mb='5' align='center' spacing='3'>
                  <Avatar
                    size={50}
                    name='MDP Transfer Tokens'
                    variant='bauhaus'
                    colors={[
                      '#50DDC3',
                      '#624AF2',
                      '#EB00FF',
                      '#7301FA',
                      '#25C2A0',
                    ]}
                  />
                  <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
                    MDP Transfer Tokens
                  </Text>
                  <HStack justify='center' my='3'>
                    <Badge
                      variant='subtle'
                      bg='base.800'
                      color='secondary.900'
                      px='3'
                      py='2'
                    >
                      <HStack spacing='2'>
                        <Icon color='secondary.900' as={FaCheckCircle} />
                        <Text>Deployed</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                </Stack>
                <Stack
                  display='contents'
                  justify='space-between'
                  align='center'
                  spacing='5'
                >
                  <Stack
                    justifyContent='space-between'
                    borderBottom='1px solid'
                    borderBottomColor='base.500'
                    flexDirection={{ base: 'column', md: 'row' }}
                    alignItems='center'
                    w='100%'
                  >
                    <Text
                      color='gray.900'
                      fontWeight='medium'
                      mb={{ base: '10px', md: '0px' }}
                    >
                      Transferring
                    </Text>
                    <Flex
                      align='center'
                      flexDirection={{ base: 'column', md: 'row' }}
                      mb={{ base: '20px', md: '0px' }}
                    >
                      <HStack>
                        <Avatar
                          size={15}
                          name={state.symbol}
                          variant='marble'
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
                          fontWeight='medium'
                          color='light.900'
                        >
                          {transferAmount}
                        </Text>
                        <Text
                          fontSize='md'
                          fontWeight='regular'
                          color='gray.900'
                        >
                          {state.symbol}
                        </Text>
                      </HStack>
                      <Button
                        variant='setup'
                        px='24px'
                        onClick={() => console.log('edit')}
                        fontSize='md'
                        fontWeight='500'
                      >
                        Edit
                      </Button>
                    </Flex>
                  </Stack>
                  <Stack
                    justifyContent='space-between'
                    borderBottom='1px solid'
                    borderBottomColor='base.500'
                    flexDirection={{ base: 'column', md: 'row' }}
                    alignItems='center'
                    w='100%'
                  >
                    <Text
                      color='gray.900'
                      fontSize='md'
                      mb={{ base: '10px', md: '0px' }}
                    >
                      To
                    </Text>
                    <Flex
                      align='center'
                      flexDirection={{ base: 'column', md: 'row' }}
                      mb={{ base: '20px', md: '0px' }}
                    >
                      <HStack>
                        <FiSend fontSize='0.9rem' />
                        <Text
                          fontSize='md'
                          fontWeight='medium'
                          color='light.900'
                        >
                          {transferTo && truncate(transferTo, 4, 8)}
                        </Text>
                      </HStack>
                      <Button
                        variant='setup'
                        px='24px'
                        onClick={() => console.log('edit')}
                        fontSize='md'
                        fontWeight='500'
                      >
                        Edit
                      </Button>
                    </Flex>
                  </Stack>
                  <Stack w='100%' spacing='1'>
                    <Text
                      color='gray.900'
                      fontSize='md'
                      mb={{ base: '10px', md: '0px' }}
                    >
                      Details
                    </Text>
                    <Text fontSize='md' fontWeight='regular' color='light.900'>
                      {description && truncate(description, 75, 0)}
                    </Text>
                  </Stack>
                </Stack>
                <HStack width='full' justify='space-between'>
                  <ProposeButton
                    organization={organization}
                    transactionId={state.transactionId}
                    isFullWidth
                    bg='secondary.900'
                    fontSize='md'
                    size='md'
                    _hover={{ opacity: 0.9 }}
                    _active={{ opacity: 1 }}
                  />
                </HStack>
              </Stack>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                  <ViewStep />
                </FormControl>
              </form>
            )}
          </Container>
        </GridItem>
      </Grid>
    </motion.div>
  );
};

Token.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default Token;

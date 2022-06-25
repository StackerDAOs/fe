import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  FormControl,
  HStack,
  Stack,
  Textarea,
  VStack,
  Spinner,
  Text,
} from '@chakra-ui/react';

// Web3
import { useNetwork } from '@micro-stacks/react';
import { fetchTransaction } from 'micro-stacks/api';

// Hooks
import { useOrganization } from '@common/hooks';
import { useForm } from 'react-hook-form';
import { useStep } from '@common/hooks/use-step';
import { usePolling } from '@common/hooks';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { VerticalStep } from '@components/VerticalStep';
import { SurveyProposalButton } from '@components/Actions';

//  Animation
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

// Utils
import { formatComments, truncate } from '@common/helpers';
import Avatar from 'boring-avatars';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

// Store
import { useStore } from 'store/TransactionStore';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const Survey = () => {
  const { network } = useNetwork();
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization }: any = useOrganization({ name: dao });
  const { transaction, setTransaction } = useStore();
  const [state, setState] = useState({ isDeployed: false });
  const { isDeployed } = state;
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm();
  const { description } = getValues();
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
    if (transaction.txId) {
      console.log({ transaction });
    }
  }, [transaction]);

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
        setState({ ...state, isDeployed: true });
        setTransaction({ txId: '', data: {} });
        // onComplete(transaction);
      }
      console.log({ transaction });
    } catch (e: any) {
      console.log({ e });
    }
  }

  const surveySteps = [
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
          <HStack justify='flex-start'>
            <Button
              minW='20%'
              bg='base.800'
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
              name='MDP Survey Proposal'
              variant='bauhaus'
              colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
            />
            <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
              MDP Survey Proposal
            </Text>
          </Stack>
          <Stack
            display='contents'
            justify='space-between'
            align='center'
            spacing='5'
          >
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
            <SurveyProposalButton
              organization={organization}
              isSubmitting={isSubmitting}
              description={formatComments(description)}
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
              name='MDP Survey Proposal'
              variant='bauhaus'
              colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
            />
            <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
              MDP Survey Proposal
            </Text>
          </Stack>
          <Stack
            display='contents'
            justify='space-between'
            align='center'
            spacing='5'
          >
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
            <SurveyProposalButton
              organization={organization}
              isSubmitting={isSubmitting}
              description={formatComments(description)}
            />
          </HStack>
        </Stack>
      </>
    );
  };

  const ViewStep = () => {
    switch (currentStep) {
      case 0:
        return <ProposalDetails />;
      case 1:
        return <ProposalReview />;
      case 2:
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
                  Survey Proposal
                </Text>
                <Text fontSize='sm' fontWeight='regular' color='gray.900'>
                  Complete the following steps to deploy a proposal for any
                  off-chain activity.
                </Text>
              </Stack>
              {surveySteps.map((step, id) => (
                <VerticalStep
                  key={id}
                  cursor='pointer'
                  title={step.title}
                  description={step.description}
                  isActive={currentStep === id}
                  isCompleted={currentStep > id}
                  isLastStep={surveySteps.length === id + 1}
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
                  name='MDP Survey Proposal'
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
                  MDP Survey Proposal
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
                      <Spinner size='xs' color='secondary.900' speed='0.75s' />
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
                colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
              />
              <Stack mb='5' align='center' spacing='3'>
                <Avatar
                  size={50}
                  name='MDP Survey Proposal'
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
                  MDP Survey Proposal
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
                  isFullWidth
                  bg='secondary.900'
                  fontSize='md'
                  size='md'
                  _hover={{ opacity: 0.9 }}
                  _active={{ opacity: 1 }}
                >
                  Submit proposal
                </Button>
              </HStack>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <ViewStep />
              </FormControl>
            </form>
          )}
        </GridItem>
      </Grid>
    </motion.div>
  );
};

Survey.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default Survey;

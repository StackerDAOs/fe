import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  FormErrorMessage,
  FormControl,
  HStack,
  Input,
  Stack,
  Textarea,
  VStack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

// Form
import { useForm } from 'react-hook-form';

// Hooks
import { useStep } from '@common/hooks/use-step';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { VerticalStep } from '@components/VerticalStep';
import { TransferStxButton } from '@components/Actions';

//  Animation
import { motion } from 'framer-motion';

// Utils
import { truncate } from '@common/helpers';
import Avatar from 'boring-avatars';
import { FaArrowLeft } from 'react-icons/fa';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const Stx = () => {
  const router = useRouter();
  const [state, setState] = useState({ isDeploying: false });
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
  const onSubmit = (data: any) => {
    setStep(currentStep + 1);
    console.log({ data });
    setState({ ...state, isDeploying: true });
  };

  const transferAssetsSteps = [
    {
      title: 'How many STX are you transferring?',
      description:
        currentStep <= 0 ? (
          <></>
        ) : (
          <HStack>
            <Image
              cursor='pointer'
              height='15px'
              src='https://cryptologos.cc/logos/stacks-stx-logo.png?v=022'
              alt='logo'
            />
            <Text fontSize='md' fontWeight='medium' color='light.900'>
              {transferAmount}
            </Text>
            <Text fontSize='md' fontWeight='regular' color='gray.900'>
              STX
            </Text>
          </HStack>
        ),
    },
    {
      title: 'Where are the STX going?',
      description:
        currentStep <= 1 ? (
          <></>
        ) : (
          <Text fontSize='md' fontWeight='medium' color='light.900'>
            {transferTo && truncate(transferTo, 4, 4)}
          </Text>
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
          mb='5'
          direction={{ base: 'column', md: 'column' }}
          justify='space-between'
          color='white'
        >
          <Text fontSize='2xl' fontWeight='semibold' color='light.900'>
            Transfer amount
          </Text>
          <Stack direction='column'>
            <Text fontSize='md' fontWeight='regular' color='gray.900'>
              Enter the amount of STX that will be transferred.
            </Text>
          </Stack>
        </Stack>
        <Stack color='light.900' spacing='5' direction='column' maxW='xs'>
          <SimpleGrid columns={1} spacing='5'>
            <FormControl isInvalid={errors.transferAmount}>
              <Input
                id='transferAmount'
                size='lg'
                type='number'
                bg='base.800'
                borderColor='base.500'
                autocomplete='off'
                placeholder='100 STX'
                {...register('transferAmount', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.transferAmount && errors.transferAmount.message}
              </FormErrorMessage>
            </FormControl>
            <HStack justify='flex-start'>
              <Button
                color='white'
                onClick={() => setStep(currentStep + 1)}
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
              >
                Next
              </Button>
            </HStack>
          </SimpleGrid>
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
            <Text fontSize='md' fontWeight='regular' color='gray.900'>
              Enter the STX address where the funds will be sent.
            </Text>
          </Stack>
        </Stack>
        <Stack color='light.900' spacing='5' direction='column' maxW='lg'>
          <SimpleGrid columns={1} spacing='5'>
            <FormControl isInvalid={errors.transferTo}>
              <Input
                id='transferTo'
                size='lg'
                type='text'
                bg='base.800'
                borderColor='base.500'
                autocomplete='off'
                placeholder='SP1T...'
                {...register('transferTo', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.transferTo && errors.transferTo.message}
              </FormErrorMessage>
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
                color='white'
                onClick={() => setStep(currentStep + 1)}
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
              >
                Next
              </Button>
            </HStack>
          </SimpleGrid>
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
            <Text fontSize='md' fontWeight='regular' color='gray.900'>
              Provide some additional context for the proposal.
            </Text>
          </Stack>
        </Stack>
        <Stack color='light.900' spacing='6' direction='column'>
          <FormControl isInvalid={errors.description}>
            <Textarea
              id='description'
              type='text'
              size='lg'
              bg='base.800'
              borderColor='base.500'
              rows={6}
              resize='none'
              autocomplete='off'
              placeholder='Transfers 100 STX to SP14...T78Y for...'
              {...register('description', {
                required: 'This is required',
              })}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
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
          spacing='0'
          mx='auto'
          direction={{ base: 'column', md: 'column' }}
          justify='space-between'
          align='center'
          color='white'
        >
          <VStack
            maxW='md'
            spacing='4'
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            color='white'
          >
            <Stack align='center' spacing='3'>
              <Avatar
                size={100}
                name='SDP Transfer STX'
                variant='bauhaus'
                colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
              />
              <Text fontSize='3xl' fontWeight='semibold' color='light.900'>
                MDP Transfer STX
              </Text>
            </Stack>
            <Stack align='center' spacing='3'>
              <Text fontSize='md' fontWeight='semibold' color='light.900'>
                {description}
              </Text>
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
              <TransferStxButton
                isSubmitting={isSubmitting}
                description={description}
                transferAmount={transferAmount}
                transferTo={transferTo}
              />
            </HStack>
          </VStack>
        </Stack>
      </>
    );
  };

  const ProposalDeploy = () => {
    return (
      <>
        <Stack
          spacing='0'
          mx='auto'
          direction={{ base: 'column', md: 'column' }}
          justify='space-between'
          align='center'
          color='white'
        >
          <VStack
            maxW='md'
            spacing='4'
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            color='white'
          >
            <Stack mb='5' align='center' spacing='3'>
              <Avatar
                size={100}
                name='SDP Transfer STX'
                variant='bauhaus'
                colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
              />
              <Text fontSize='3xl' fontWeight='semibold' color='light.900'>
                MDP Transfer STX
              </Text>
            </Stack>
            <HStack width='full' justify='space-between'>
              <Button
                color='white'
                variant='link'
                fontSize='md'
                size='md'
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
                onClick={() => setStep(currentStep - 2)}
              >
                Previous
              </Button>
              <TransferStxButton
                isSubmitting={isSubmitting}
                description={description}
                transferAmount={transferAmount}
                transferTo={transferTo}
              />
            </HStack>
          </VStack>
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
        templateColumns='repeat(5, 1fr)'
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
                <Text fontSize='md' fontWeight='regular' color='gray.900'>
                  Complete the following steps to deploy a proposal for
                  transferring STX.
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
          colSpan={3}
          bg='base.900'
          px={{ base: '15', md: '20' }}
          py={{ base: '15', md: '20' }}
        >
          <HStack
            position='relative'
            bottom='3'
            cursor='pointer'
            onClick={() => router.back()}
            color='gray.900'
            _hover={{
              textDecoration: 'underline',
              color: 'light.900',
            }}
          >
            <FaArrowLeft fontSize='0.9rem' />
            <Text>Back</Text>
          </HStack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <ViewStep />
            </FormControl>
          </form>
        </GridItem>
      </Grid>
    </motion.div>
  );
};

Stx.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default Stx;

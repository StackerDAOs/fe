import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Divider,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  HStack,
  Stack,
  Textarea,
  VStack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

// Form
import { useForm, Controller } from 'react-hook-form';

// Widgets
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Hooks
import { useStep } from '@common/hooks/use-step';

// Data
import { transferAssetsSteps } from '@utils/data';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { Card } from '@components/Card';
import { VerticalStep } from '@components/VerticalStep';
import { Step } from '@components/Step';
import { RadioCard, RadioCardGroup } from '@components/RadioCardGroup';
import { TransferStxButton } from '@components/Actions';

//  Animation
import { motion } from 'framer-motion';

// Stacks
import { useCurrentStxAddress } from '@micro-stacks/react';

// Utils
import { truncate } from '@common/helpers';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const StxV1 = () => {
  const router = useRouter();

  const currentStxAddress = useCurrentStxAddress();
  const [currentStep, { setStep, canGoToNextStep }] = useStep({
    maxStep: transferAssetsSteps.length - 1,
    initialStep: 0,
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  const { asset, assetType, transferAmount, transferTo, description } =
    getValues();
  const onSubmit = (data: any) => {
    console.log({ data });
    return null;
  };

  const SelectAssetType = () => {
    return (
      <>
        <Stack
          spacing='4'
          mb='3'
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          color='white'
        >
          <Box>
            <Text color='gray.900' fontSize='md'>
              1. Select which type of asset you want to transfer.
            </Text>
            {/* <Button onClick={onClickInsert}>Test</Button> */}
          </Box>
        </Stack>
        <Controller
          control={control}
          name='assetType'
          defaultValue='Token'
          render={({ field: { onChange, value } }) => (
            <RadioCardGroup
              defaultValue='Token'
              spacing='3'
              direction='row'
              value={value}
              onChange={onChange}
            >
              {[
                {
                  type: 'Token',
                  description: 'i.e., STX, $ALEX, or any SIP-10 token',
                },
                {
                  type: 'NFT',
                  description: 'i.e., Megapont, Crash Punks, or any SIP-09 NFT',
                },
              ].map((option) => (
                <RadioCard key={option.type} value={option.type} color='white'>
                  <Text color='emphasized' fontWeight='medium' fontSize='sm'>
                    {option.type}
                  </Text>
                  <Text color='gray.900' fontSize='sm'>
                    {option.description}
                  </Text>
                </RadioCard>
              ))}
            </RadioCardGroup>
          )}
        />
      </>
    );
  };

  const SelectAsset = () => {
    return (
      <>
        <Stack
          spacing='4'
          mb='3'
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          color='white'
        >
          <Box>
            <Text color='gray.900' fontSize='md'>
              2. Select which asset you want to transfer.
            </Text>
          </Box>
        </Stack>
        <Controller
          control={control}
          name='asset'
          defaultValue='STX'
          render={({ field: { onChange, value } }) => (
            <RadioCardGroup
              defaultValue='STX'
              spacing='3'
              direction='column'
              value={value}
              onChange={onChange}
            >
              {[
                {
                  type: 'STX',
                  description: 'Stacks',
                },
                {
                  type: 'GVT',
                  description: 'Governance Token',
                },
                {
                  type: 'MIA',
                  description: 'MiamiCoin',
                },
              ].map((option) => (
                <RadioCard key={option.type} value={option.type} color='white'>
                  <Text color='emphasized' fontWeight='medium' fontSize='sm'>
                    {option.type}
                  </Text>
                  <Text color='gray.900' fontSize='sm'>
                    {option.description}
                  </Text>
                </RadioCard>
              ))}
            </RadioCardGroup>
          )}
        />
      </>
    );
  };

  const ProposalDetails = () => {
    return (
      <>
        <Stack
          spacing='4'
          mb='3'
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          color='white'
        >
          <Box>
            <Text color='gray.900' fontSize='md'>
              3. Provide some details about your proposal.
            </Text>
          </Box>
        </Stack>
        <Stack color='light.900' spacing='6' direction='column'>
          <SimpleGrid columns={2} spacing='5'>
            <FormControl isInvalid={errors.transferAmount}>
              <FormLabel>Amount</FormLabel>
              <Input
                id='transferAmount'
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
            <FormControl isInvalid={errors.transferTo}>
              <FormLabel>Recipient</FormLabel>
              <Input
                id='transferTo'
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
          </SimpleGrid>
          <FormControl isInvalid={errors.description}>
            <FormLabel>Details</FormLabel>
            <Textarea
              id='description'
              type='text'
              bg='base.800'
              borderColor='base.500'
              rows={6}
              resize='none'
              autocomplete='off'
              placeholder='Transfers 100 STX to SP14...'
              {...register('description', {
                required: 'This is required',
              })}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
      </>
    );
  };

  const ProposalReview = () => {
    return (
      <>
        <Box as='section'>
          <VStack
            align='left'
            spacing='4'
            mb='3'
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            color='white'
          >
            <Box py={{ base: '3', md: '3' }} px={{ base: '6', md: '6' }}>
              <Text fontSize='3xl' fontWeight='medium' color='light.900' mb='1'>
                SDP Transfer {assetType}
              </Text>
              <Text color='gray.900' fontSize='sm'>
                Review & deploy smart contract.
              </Text>
              <Divider my='3' borderColor='base.500' />
              <Stack spacing='3' my='3'>
                <HStack justify='space-between'>
                  <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                    Amount
                  </Text>
                  <Text fontSize='sm' fontWeight='medium' color='light.900'>
                    {transferAmount} {asset}
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                    Recipient
                  </Text>
                  <Text fontSize='sm' fontWeight='medium' color='light.900'>
                    {transferTo && truncate(transferTo, 4, 4)}
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                    Proposer
                  </Text>
                  <Text fontSize='sm' fontWeight='medium' color='light.900'>
                    {currentStxAddress && truncate(currentStxAddress, 4, 4)}
                  </Text>
                </HStack>
              </Stack>
              <Stack my='3'>
                <Stack
                  spacing='4'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  color='white'
                >
                  <Box>
                    <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                      Description
                    </Text>
                  </Box>
                </Stack>
                <Text
                  fontSize='sm'
                  _selection={{
                    bg: 'base.800',
                    color: 'secondary.900',
                  }}
                >
                  {description}
                </Text>
              </Stack>
            </Box>
          </VStack>
        </Box>
      </>
    );
  };

  const ViewStep = () => {
    switch (currentStep) {
      case 0:
        return <SelectAssetType />;
      case 1:
        return <SelectAsset />;
      case 2:
        return <ProposalDetails />;
      case 3:
        return <ProposalReview />;
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
      <Container maxW='2xl'>
        <Stack spacing='5'>
          <Text
            color='light.900'
            textAlign='center'
            fontSize='2xl'
            fontWeight='medium'
          >
            Transfer Assets
          </Text>
          <Box as='section'>
            <Stack
              spacing='0'
              color='light.900'
              mb='5'
              pb='5'
              direction={{ base: 'column', md: 'row' }}
            >
              {transferAssetsSteps.map((step, id) => (
                <Step
                  key={id}
                  cursor='pointer'
                  onClick={() => setStep(id)}
                  title={step.title}
                  isActive={currentStep === id}
                  isCompleted={currentStep > id}
                  isFirstStep={id === 0}
                  isLastStep={transferAssetsSteps.length === id + 1}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <ViewStep />
          </FormControl>
          {canGoToNextStep ? (
            <HStack
              mt='5'
              justifyContent={
                currentStep !== 0 ? 'space-between' : 'flex-start'
              }
            >
              {currentStep !== 0 ? (
                <Button
                  mt='4'
                  color='white'
                  _hover={{ opacity: 0.9 }}
                  _active={{ opacity: 1 }}
                  onClick={() => setStep(currentStep - 1)}
                >
                  Back
                </Button>
              ) : null}
              <Button
                mt='4'
                color='white'
                onClick={() => setStep(currentStep + 1)}
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
              >
                Next
              </Button>
            </HStack>
          ) : (
            <HStack
              width='full'
              mt='5'
              justifyContent={
                currentStep !== 0 ? 'space-between' : 'flex-start'
              }
            >
              <Button
                color='white'
                fontSize='md'
                size='md'
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
                onClick={() => setStep(currentStep - 1)}
              >
                Back
              </Button>
              <TransferStxButton
                isSubmitting={isSubmitting}
                description={description}
                transferAmount={transferAmount}
                transferTo={transferTo}
              />
            </HStack>
          )}
        </form>
      </Container>
    </motion.div>
  );
};

StxV1.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default StxV1;

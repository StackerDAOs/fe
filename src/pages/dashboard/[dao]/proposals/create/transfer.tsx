import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  VStack,
  SimpleGrid,
  Text,
  Textarea,
} from '@chakra-ui/react';

// Utils
import { truncate } from '@common/helpers';
import { sendFunds } from '@utils/proposals';

// Widgets
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Hooks
import { useStep } from '@common/hooks/use-step';
import { useRandomName } from '@common/hooks';

// Data
import { transferAssetsSteps } from '@utils/data';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { RadioCard, RadioCardGroup } from '@components/RadioCardGroup';
import { VerticalStep } from '@components/VerticalStep';
import { Card } from '@components/Card';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaArrowLeft } from 'react-icons/fa';

// Stacks
import { useAuth, useNetwork, useCurrentStxAddress } from '@micro-stacks/react';

interface State {
  selectedAssetType: string;
  selectedAsset: string;
  transferAmount: string;
  transferTo: string;
  description: string;
}

const initialState: State = {
  selectedAssetType: 'Token',
  selectedAsset: '',
  transferAmount: '',
  transferTo: '',
  description: '',
};

const CreateProposal = () => {
  const [state, setState] = useState<State>(initialState);
  const currentStxAddress = useCurrentStxAddress();
  const router = useRouter();

  // Store
  const [currentStep, { setStep, canGoToNextStep }] = useStep({
    maxStep: transferAssetsSteps.length - 1,
    initialStep: 0,
  });

  const generateContractName = useRandomName();

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  };

  const SLIDE_UP_BUTTON_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 15 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -15 },
  };

  const ViewStep = () => {
    switch (currentStep) {
      case 0:
        return <SelectAssetTypeList />;
      case 1:
        return <SelectAssetList />;
      case 2:
        return <ProposalDetails />;
      case 3:
        return <ProposalReview />;
      default:
        return <></>;
    }
  };

  const SelectAssetTypeList = () => {
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
            <Text fontSize='2xl' fontWeight='medium'>
              Choose an asset type
            </Text>
            <Text color='gray.900' fontSize='sm'>
              Select which type of asset you want to transfer.
            </Text>
          </Box>
        </Stack>
        <RadioCardGroup
          defaultValue='Token'
          spacing='3'
          direction='row'
          value={state.selectedAssetType}
          onChange={(value: string) =>
            setState({ ...state, selectedAssetType: value })
          }
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
      </>
    );
  };

  const SelectAssetList = () => {
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
            <Text fontSize='2xl' fontWeight='medium'>
              Select an asset
            </Text>
            <Text color='gray.900' fontSize='sm'>
              Select which asset you want to transfer.
            </Text>
          </Box>
        </Stack>
        <RadioCardGroup
          defaultValue='Token'
          spacing='3'
          direction='column'
          value={state.selectedAsset}
          onChange={(value: string) =>
            setState({ ...state, selectedAsset: value })
          }
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
            <Text fontSize='2xl' fontWeight='medium'>
              Proposal Details
            </Text>
            <Text color='gray.900' fontSize='sm'>
              Provide some details about your proposal.
            </Text>
          </Box>
        </Stack>
        <Stack spacing='6' direction='column'>
          <SimpleGrid columns={2} spacing='5'>
            <FormControl color='light.900'>
              <FormLabel>Transfer amount</FormLabel>
              <Input
                placeholder='100'
                value={state.transferAmount}
                onChange={(
                  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                ) => setState({ ...state, transferAmount: e.target.value })}
              />
            </FormControl>
            <FormControl color='light.900'>
              <FormLabel>Transfer to</FormLabel>
              <Input
                placeholder='SP14...'
                value={state.transferTo}
                onChange={(
                  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                ) => setState({ ...state, transferTo: e.target.value })}
              />
            </FormControl>
          </SimpleGrid>
          <FormControl color='light.900'>
            <FormLabel>Description</FormLabel>
            <Textarea
              rows={4}
              resize='none'
              placeholder='Transfers 100 STX to SP14...'
              value={state.description}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
              ) => setState({ ...state, description: e.target.value })}
            />
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
            <Card border='1px solid rgb(134, 143, 152)'>
              <Box py={{ base: '3', md: '3' }} px={{ base: '6', md: '6' }}>
                <Text
                  fontSize='3xl'
                  fontWeight='medium'
                  bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                  bgClip='text'
                  mb='1'
                >
                  SDP Transfer STX
                </Text>
                <Text color='light.900' fontSize='sm'>
                  Review & deploy smart contract.
                </Text>
                <Divider my='3' borderColor='base.500' />
                <Stack spacing='3' my='3'>
                  <HStack justify='space-between'>
                    <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                      Amount
                    </Text>
                    <Text fontSize='sm' fontWeight='medium' color='light.900'>
                      {state.transferAmount} STX
                    </Text>
                  </HStack>
                  <HStack justify='space-between'>
                    <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                      Recipient
                    </Text>
                    <Text fontSize='sm' fontWeight='medium' color='light.900'>
                      {state?.transferTo && truncate(state.transferTo, 4, 4)}
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
                    {state.description}
                  </Text>
                </Stack>
              </Box>
            </Card>
          </VStack>
        </Box>
      </>
    );
  };

  const contract = sendFunds(
    state.description,
    state.transferAmount,
    state.transferTo,
    currentStxAddress,
  );

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Box as='section' my='5' display='flex' alignItems='center'>
        <Container maxW='5xl'>
          <Stack spacing='5'>
            <Stack
              spacing='4'
              direction={{ base: 'column', md: 'row' }}
              justify='space-between'
              color='white'
            >
              <HStack
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
            </Stack>
          </Stack>
          <Stack
            spacing='4'
            my='3'
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            color='white'
          >
            <Box>
              <Text fontSize='4xl' fontWeight='medium'>
                Transfer Assets
              </Text>
              <Text
                fontSize='md'
                maxW='md'
                bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                bgClip='text'
              >
                Create a proposal to transfer assets from the DAO treasury
                vault.
              </Text>
            </Box>
          </Stack>
          <Box py='5'>
            <SimpleGrid
              columns={{ base: 1, md: 1, lg: 2 }}
              alignItems='flex-start'
            >
              <Box as='section'>
                <VStack
                  align='left'
                  spacing='4'
                  mb='3'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  color='white'
                >
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
              <Box as='section'>
                <ViewStep />
                <motion.div
                  variants={SLIDE_UP_BUTTON_VARIANTS}
                  initial={SLIDE_UP_BUTTON_VARIANTS.hidden}
                  animate={SLIDE_UP_BUTTON_VARIANTS.enter}
                  exit={SLIDE_UP_BUTTON_VARIANTS.exit}
                  transition={{ duration: 0.75, type: 'linear' }}
                >
                  {canGoToNextStep ? (
                    <HStack
                      mt='5'
                      justifyContent={
                        currentStep !== 0 ? 'space-between' : 'flex-start'
                      }
                    >
                      {currentStep !== 0 ? (
                        <Button
                          type='submit'
                          color='white'
                          _hover={{ opacity: 0.9 }}
                          _active={{ opacity: 1 }}
                          onClick={() => setStep(currentStep - 1)}
                        >
                          Back
                        </Button>
                      ) : null}
                      <Button
                        type='submit'
                        color='white'
                        _hover={{ opacity: 0.9 }}
                        _active={{ opacity: 1 }}
                        onClick={() => setStep(currentStep + 1)}
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
                        type='submit'
                        color='white'
                        _hover={{ opacity: 0.9 }}
                        _active={{ opacity: 1 }}
                        onClick={() => setStep(currentStep - 1)}
                      >
                        Back
                      </Button>

                      <ContractDeployButton
                        color='light.900'
                        bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                        title='Deploy contract'
                        contractName={generateContractName()}
                        codeBody={contract}
                      />
                    </HStack>
                  )}
                </motion.div>
              </Box>
            </SimpleGrid>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
};

CreateProposal.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default CreateProposal;

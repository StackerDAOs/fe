import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  HStack,
  Stack,
  VStack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

// Utils
import { sendFunds } from '@utils/proposals';

// Widgets
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Hooks
import { useStep } from '@common/hooks/use-step';
import { useRandomName } from '@common/hooks';

// Data
import { transferAssetsSteps } from '@utils/data';

// Store
import { proposalStore } from 'store/proposals/CreateTransfer';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { VerticalStep } from '@components/VerticalStep';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaArrowLeft } from 'react-icons/fa';

// Stacks
import { useCurrentStxAddress } from '@micro-stacks/react';

// Wizard
import { SelectAssetType } from 'wizard/create-proposals/SelectAssetType';
import { SelectAsset } from 'wizard/create-proposals/SelectAsset';
import { ProposalDetails } from 'wizard/create-proposals/ProposalDetails';
import { ProposalReview } from 'wizard/create-proposals/ProposalReview';

const CreateProposal = () => {
  const currentStxAddress = useCurrentStxAddress();
  const router = useRouter();
  const [currentStep, { setStep, canGoToNextStep }] = useStep({
    maxStep: transferAssetsSteps.length - 1,
    initialStep: 0,
  });
  const { transferAmount, transferTo, description } = proposalStore();

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

  const contract = sendFunds(
    description,
    transferAmount,
    transferTo,
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

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Store
import { useStore } from 'store/DeployStepStore';
import { useStore as useDaoStore } from 'store/CreateDaoStore';

// Data
import { proposals } from '@utils/data';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { RadioCard, RadioCardGroup } from '@components/RadioCardGroup';
import { VaultActionPopover } from '@components/VaultActionPopover';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaArrowLeft } from 'react-icons/fa';

// Stacks
import {
  useAuth,
  useNetwork,
  useUser,
  useCurrentStxAddress,
  useContractCall,
} from '@micro-stacks/react';
import type { FinishedTxData } from 'micro-stacks/connect';
import { fetchTransaction, fetchReadOnlyFunction } from 'micro-stacks/api';
import { uintCV, principalCV } from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  PostConditionMode,
  makeStandardSTXPostCondition,
  makeStandardFungiblePostCondition,
  createAssetInfo,
} from 'micro-stacks/transactions';

import { usePolling } from '@common/hooks/use-polling';

// import { Notification } from '@components/Notification';
// import { CloseButton } from '@components/CloseButton';
// import { useCallFunction } from '@common/hooks/use-call-function';
// import { useTransaction } from '@common/hooks/use-transaction';
// import ContractCallButton from 'widgets/ContractCallButton';

// interface State {
//   txId: string | null;
//   delay: number | null;
// }

const CreateProposal = () => {
  const { isSignedIn } = useAuth();
  const currentStxAddress = useCurrentStxAddress();
  const { network } = useNetwork();
  const router = useRouter();
  const { dao } = router.query;
  console.log('dao', router);

  // Store
  const [_, setTabIndex] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const { currentStep, maxSteps } = useStore();
  const { name } = useDaoStore();
  const isDisabled = currentStep !== maxSteps;

  const toast = useToast();

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

  // usePolling(() => {
  //   console.log('make api call');
  // }, 7500);

  const contractAddress = 'ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A';
  const contractName = 'citycoin-token';
  const functionName = 'burn';

  const functionArgs = [
    uintCV(10),
    principalCV('ST143YHR805B8S834BWJTMZVFR1WP5FFC00V8QTV4'),
  ];
  const postConditionAddress =
    currentStxAddress || 'ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A';
  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = 10;
  const fungibleAssetInfo = createAssetInfo(
    contractAddress,
    contractName,
    'citycoins',
  );
  const postConditions = [
    makeStandardFungiblePostCondition(
      postConditionAddress,
      postConditionCode,
      postConditionAmount,
      fungibleAssetInfo,
    ),
  ];

  const { handleContractCall, isLoading } = useContractCall({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  });

  const handleClick = () => {
    handleContractCall();
  };

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Box as='section'>
        <Container maxW='5xl'>
          <Stack spacing={{ base: '8', lg: '6' }}>
            <Stack w='auto'>
              <Box as='section'>
                <Container maxW='xl' m='0'>
                  <Stack spacing='5'>
                    <Stack
                      spacing='4'
                      mb='3'
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
                        <FaArrowLeft />
                        <Text>Back</Text>
                      </HStack>
                    </Stack>
                  </Stack>
                  <Stack
                    spacing='4'
                    mb='3'
                    direction={{ base: 'column', md: 'row' }}
                    justify='space-between'
                    color='white'
                  >
                    <Box>
                      <Text fontSize='2xl' fontWeight='medium'>
                        Transfer assets
                      </Text>
                      <Text color='gray.900' fontSize='sm'>
                        Select which type of asset you want to transfer.
                      </Text>
                    </Box>
                  </Stack>

                  <RadioCardGroup defaultValue='one' spacing='3'>
                    {[
                      {
                        type: 'Token',
                        description: 'i.e., STX, $ALEX, or any SIP-10 token',
                      },
                      {
                        type: 'NFT',
                        description:
                          'i.e., Megapont, Crash Punks, or any SIP-09 NFT',
                      },
                    ].map((option) => (
                      <RadioCard
                        key={option.type}
                        value={option.type}
                        color='white'
                      >
                        <Text
                          color='emphasized'
                          fontWeight='medium'
                          fontSize='sm'
                        >
                          {option.type}
                        </Text>
                        <Text color='gray.900' fontSize='sm'>
                          {option.description}
                        </Text>
                      </RadioCard>
                    ))}
                  </RadioCardGroup>
                  <motion.div
                    variants={SLIDE_UP_BUTTON_VARIANTS}
                    initial={SLIDE_UP_BUTTON_VARIANTS.hidden}
                    animate={SLIDE_UP_BUTTON_VARIANTS.enter}
                    exit={SLIDE_UP_BUTTON_VARIANTS.exit}
                    transition={{ duration: 0.75, type: 'linear' }}
                  >
                    <HStack width='full' mt='5' justifyContent='flex-start'>
                      <Button
                        type='submit'
                        color='white'
                        bgGradient={mode(
                          'linear(to-br, secondaryGradient.900, secondary.900)',
                          'linear(to-br, primaryGradient.900, primary.900)',
                        )}
                        _hover={{ opacity: 0.9 }}
                        _active={{ opacity: 1 }}
                        onClick={() => console.log('next')}
                      >
                        Next
                      </Button>
                    </HStack>
                  </motion.div>
                </Container>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

CreateProposal.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default CreateProposal;

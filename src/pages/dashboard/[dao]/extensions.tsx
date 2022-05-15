import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  Stack,
  HStack,
  VStack,
  SimpleGrid,
  Text,
  Tabs,
  TabList,
  Tab,
  useToast,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Store
import { useStore } from 'store/DeployStepStore';
import { useStore as useDaoStore } from 'store/CreateDaoStore';

// Data
import { proposals } from '@utils/data';

// Components
import { Card } from '@components/Card';
import { AppLayout } from '@components/Layout/AppLayout';
import { Stat } from '@components/Stat';
import { VerticalStep } from '@components/VerticalStep';
import { ActivityList } from '@components/ActivityList';
import { VaultTransactionList } from '@components/VaultTransactionList';
import { ProposalList } from '@components/ProposalList';
import { MemberList } from '@components/MemberList';
import { RadioButton, RadioButtonGroup } from '@components/RadioButtonGroup';

// Widgets
import { CreateProposalButton } from '@widgets/CreateProposalButton';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaCheck, FaTimes } from 'react-icons/fa';

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

const Extensions = () => {
  const { isSignedIn } = useAuth();
  const currentStxAddress = useCurrentStxAddress();
  const { network } = useNetwork();
  const router = useRouter();

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
        <Container maxW='5xl' mt='6' pt='6'>
          <Stack spacing={{ base: '8', lg: '6' }} mt='4'>
            <Box maxW='900px' m={{ base: '3', lg: '6' }}>
              <Heading
                as='h1'
                size='xl'
                fontWeight='extrabold'
                maxW='48rem'
                lineHeight='1.2'
                letterSpacing='tight'
                bgGradient={mode(
                  'linear(to-br, secondaryGradient.900, secondary.900)',
                  'linear(to-br, primaryGradient.900, primary.900)',
                )}
                bgClip='text'
              >
                Extensions
              </Heading>

              <Text pb='4' maxW='xl' fontSize='md' color='gray.900'>
                Unleashing the ownership economy. No-code platform, dev tools, &
                legal tech to build & manage #Bitcoin DAOs via @Stacks.
              </Text>
            </Box>
            <Stack w='auto'>
              <Box as='section'>
                <Container>
                  <Stack spacing='5'>
                    <Stack
                      spacing='4'
                      mb='6'
                      direction={{ base: 'column', md: 'row' }}
                      justify='space-between'
                      color='white'
                    >
                      <Box>
                        <Text fontSize='2xl' fontWeight='medium'>
                          Proposals
                        </Text>
                        <Text color='gray.900' fontSize='sm'>
                          All registered users in the overview
                        </Text>
                      </Box>
                      <RadioButtonGroup defaultValue='all'>
                        <RadioButton value='all' bg='base.900'>
                          All
                        </RadioButton>
                        <RadioButton value='active' bg='base.900'>
                          Active
                        </RadioButton>
                        <RadioButton value='submitted' bg='base.900'>
                          Submitted
                        </RadioButton>
                        <RadioButton value='completed' bg='base.900'>
                          Completed
                        </RadioButton>
                      </RadioButtonGroup>
                    </Stack>
                  </Stack>
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 2 }}
                    spacing='4'
                    py='4'
                    color='white'
                  >
                    {proposals.map(({ type, description, status, result }) => {
                      return (
                        <Card
                          position='relative'
                          minH='250px'
                          mx='auto'
                          px={{ base: '6', md: '6' }}
                          py={{ base: '6', md: '6' }}
                          border='1px solid rgb(134, 143, 152)'
                        >
                          <Stack
                            spacing={{ base: '5', md: '6' }}
                            justify='space-between'
                          >
                            <HStack>
                              <Badge
                                size='sm'
                                maxW='fit-content'
                                variant='subtle'
                                colorScheme={
                                  status === 'COMPLETE'
                                    ? 'white'
                                    : status === 'ACTIVE'
                                    ? 'green'
                                    : 'yellow'
                                }
                                px='3'
                                py='2'
                              >
                                <HStack spacing='2'>
                                  <Text>{status}</Text>
                                </HStack>
                              </Badge>
                              {status === 'COMPLETE' && (
                                <Badge
                                  size='sm'
                                  maxW='fit-content'
                                  variant='subtle'
                                  colorScheme={result ? 'green' : 'red'}
                                  px='3'
                                  py='2'
                                >
                                  <HStack spacing='1'>
                                    {result ? (
                                      <>
                                        <FaCheck />
                                        <Text>Approved</Text>
                                      </>
                                    ) : (
                                      <>
                                        <FaTimes />
                                        <Text>Failed</Text>
                                      </>
                                    )}
                                  </HStack>
                                </Badge>
                              )}
                            </HStack>
                            <Stack spacing='1'>
                              <Text fontSize='lg' fontWeight='medium'>
                                {type}
                              </Text>
                              <Text fontSize='sm' color='gray.900'>
                                {description}
                              </Text>
                            </Stack>
                          </Stack>
                          <Box p='5' position='absolute' bottom='0' left='0'>
                            <Button bg='base.600' _hover={{ bg: 'base.500' }}>
                              View details
                            </Button>
                          </Box>
                        </Card>
                      );
                    })}
                  </SimpleGrid>
                </Container>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

Extensions.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default Extensions;

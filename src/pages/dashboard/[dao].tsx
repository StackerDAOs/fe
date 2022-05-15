import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  HStack,
  VStack,
  SimpleGrid,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
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
import { RadioButton, RadioButtonGroup } from '@components/RadioButtonGroup';
import { DashboardProfile } from '@components/DashboardProfile';
import { DataTable } from '@components/DataTable';
import { Stat } from '@components/Stat';

// Widgets
import { CreateProposalButton } from '@widgets/CreateProposalButton';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';

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

const DAODashboard = () => {
  const { isSignedIn } = useAuth();
  const currentStxAddress = useCurrentStxAddress();
  const { network } = useNetwork();
  const router = useRouter();
  const { dao } = router.query;

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
            <Container>
              <Stack
                spacing='4'
                mb='2'
                direction={{ base: 'column', md: 'row' }}
                justify='space-between'
                align='center'
                color='white'
              >
                <VStack maxW='xl' spacing='3' alignItems='baseline'>
                  <HStack>
                    <Box
                      w='50px'
                      h='50px'
                      borderRadius='50%'
                      bgGradient='linear(to-l, primaryGradient.900, primary.900)'
                    />
                    <Heading
                      size='lg'
                      pb='2'
                      fontWeight='regular'
                      color={mode('base.900', 'light.900')}
                    >
                      {name || 'StackerDAO'}
                    </Heading>
                  </HStack>
                </VStack>
              </Stack>
              <Stack
                spacing='4'
                mb='6'
                direction={{ base: 'column', md: 'row' }}
                justify='space-between'
                align='center'
                color='white'
              >
                <SimpleGrid columns={{ base: 1, md: 3 }} maxW='lg'>
                  <Stat fontSize='sm' title='Members'>
                    4269
                  </Stat>
                  <Stat fontSize='sm' title='Total assets'>
                    4
                  </Stat>

                  <Stat fontSize='sm' title='Open Proposals'>
                    2
                  </Stat>
                </SimpleGrid>
              </Stack>
            </Container>
            <Container>
              <Stack spacing='5'>
                <Stack
                  spacing='4'
                  my='3'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  color='white'
                >
                  <Box>
                    <Text fontSize='2xl' fontWeight='medium'>
                      Create a proposal
                    </Text>
                    <Text color='gray.900' fontSize='sm'>
                      Select from a variety of proposals to get started.
                    </Text>
                  </Box>
                  <Link href={`/dashboard/${dao}/proposals`}>
                    <Box
                      display='flex'
                      alignItems='center'
                      cursor='pointer'
                      _hover={{ textDecoration: 'underline' }}
                    >
                      <Text fontSize='md' px='1'>
                        Go to proposals
                      </Text>
                      <FaArrowRight fontSize='13' />
                    </Box>
                  </Link>
                </Stack>
              </Stack>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing='12'
                pb='4'
                color='white'
              >
                {proposals.map(({ type, description, status, result }) => {
                  return (
                    <Card
                      bg='base.900'
                      position='relative'
                      px={{ base: '6', md: '6' }}
                      py={{ base: '6', md: '6' }}
                      border='1px solid rgb(134, 143, 152)'
                      _hover={{ cursor: 'pointer', bg: 'base.800' }}
                    >
                      <Stack
                        spacing={{ base: '0', md: '2' }}
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
                    </Card>
                  );
                })}
              </SimpleGrid>
            </Container>
            <Container>
              <Stack spacing='5'>
                <Stack
                  spacing='4'
                  my='3'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  color='white'
                >
                  <Box>
                    <Text fontSize='2xl' fontWeight='medium'>
                      Assets
                    </Text>
                    <Text color='gray.900' fontSize='sm'>
                      List of shared assets owned by the DAO.
                    </Text>
                  </Box>
                  <Link href={`/dashboard/${dao}/vault`}>
                    <Box
                      display='flex'
                      alignItems='center'
                      cursor='pointer'
                      _hover={{ textDecoration: 'underline' }}
                    >
                      <Text fontSize='md' px='1'>
                        Go to vault
                      </Text>
                      <FaArrowRight fontSize='13' />
                    </Box>
                  </Link>
                </Stack>
              </Stack>
              <Tabs color='white' variant='unstyled'>
                <TabList>
                  {['Tokens', 'NFTs'].map((item) => (
                    <Tab
                      key={item}
                      fontSize='sm'
                      color='gray.900'
                      _first={{ paddingLeft: '0' }}
                      _selected={{ color: 'light.900' }}
                    >
                      {item}
                    </Tab>
                  ))}
                </TabList>
                <TabPanels>
                  <TabPanel px='0'>
                    <DataTable />
                  </TabPanel>
                  <TabPanel px='0'>
                    <DataTable />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Container>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

DAODashboard.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default DAODashboard;

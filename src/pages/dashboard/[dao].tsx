import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  useToast,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Store
import { useStore } from 'store/DeployStepStore';
import { useStore as useDaoStore } from 'store/CreateDaoStore';

// Components
import { Card } from '@components/Card';
import { DashboardProfile } from '@components/DashboardProfile';
import { Stat } from '@components/Stat';
import { VerticalStep } from '@components/VerticalStep';
import { ActivityList } from '@components/ActivityList';
import { VaultTransactionList } from '@components/VaultTransactionList';
import { ProposalList } from '@components/ProposalList';
import { MemberList } from '@components/MemberList';

//  Animation
import { motion } from 'framer-motion';

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

  // Store
  const [_, setTabIndex] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const { currentStep, maxSteps } = useStore();
  const { name } = useDaoStore();
  const isDisabled = currentStep !== maxSteps;

  useEffect(() => {
    if (!isSignedIn) router.push('/');
  }, []);
  const toast = useToast();

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
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

  const steps = [
    {
      title: 'Members',
      extensionName: 'membershipExtension',
      payload: {
        header: 'Membership Contract',
        action: { title: 'Deploy', event: handleClick },
        button: { title: 'Membership', type: 'primary' },
      },
    },
    {
      title: 'Vault',
      extensionName: 'vaultExtension',
      payload: {
        header: 'Vault Contract',
        action: { title: 'Deploy', event: handleClick },
        button: { title: 'Vault', type: 'primary' },
      },
    },
    {
      title: 'Submitting Proposals',
      extensionName: 'proposalExtension',
      payload: {
        header: 'Proposal Contract',
        action: { title: 'Deploy', event: handleClick },
        button: { title: 'Submitting Proposals', type: 'primary' },
      },
    },
    {
      title: 'Voting on Proposals',
      extensionName: 'votingExtension',
      payload: {
        header: 'Voting Contract',
        action: { title: 'Deploy', event: handleClick },
        button: { title: 'Voting on Proposals', type: 'primary' },
      },
    },
    {
      title: 'Emergency Proposals',
      extensionName: 'emergencyExtension',
      payload: {
        header: 'Emergency Proposal Contract',
        action: { title: 'Deploy', event: handleClick },
        button: { title: 'Emergency Proposals', type: 'primary' },
      },
    },
    {
      title: 'Emergency Team',
      extensionName: 'emergencyExtension',
      payload: {
        header: 'Emergency Team Contract',
        action: { title: 'Deploy', event: handleClick },
        button: { title: 'Emergency Team', type: 'primary' },
      },
    },
  ];

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Box as='section' overflowY='auto' pt='10' mt='10'>
        <Container maxW='7xl'>
          <Stack spacing={{ base: '8', lg: '6' }}>
            <Grid templateColumns='repeat(6, 1fr)' gap={50}>
              <GridItem colSpan={4}>
                <Card
                  bg='transparent'
                  px={{ base: '6', md: '6' }}
                  py={{ base: '6', md: '6' }}
                >
                  <HStack maxW='xl' spacing='3' alignItems='baseline'>
                    <Box
                      w='45px'
                      h='45px'
                      borderRadius='50%'
                      bgGradient='linear(to-l, secondaryGradient.900, secondary.900)'
                    />
                    <Heading
                      size='lg'
                      pb='6'
                      fontWeight='regular'
                      color={mode('base.900', 'light.900')}
                    >
                      {name || 'StackerDAO'}
                    </Heading>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 3 }} maxW='lg'>
                    <Stat fontSize='sm' title='Created'>
                      Mar 21, 2022
                    </Stat>
                    <Stat fontSize='sm' title='Members'>
                      4269
                    </Stat>
                    <Stat fontSize='sm' title='Open Proposals'>
                      2
                    </Stat>
                  </SimpleGrid>
                </Card>
                <Stack pt={{ base: '4', md: '6' }} w='auto'>
                  <Tabs
                    defaultIndex={0}
                    onChange={(index) => setTabIndex(index)}
                  >
                    <TabList border='none' color={mode('base.700', 'base.400')}>
                      {['Activity', 'Vault', 'Proposals', 'Members'].map(
                        (title, index) => (
                          <Tab
                            key={index}
                            _selected={{
                              color: mode('base.900', 'light.900'),
                              fontWeight: 'semibold',
                            }}
                            fontSize='md'
                          >
                            <HStack spacing='2'>
                              <Text>{title}</Text>
                            </HStack>
                          </Tab>
                        ),
                      )}
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <ActivityList />
                      </TabPanel>
                      <TabPanel>
                        <VaultTransactionList />
                      </TabPanel>
                      <TabPanel>
                        <ProposalList />
                      </TabPanel>
                      <TabPanel>
                        <MemberList />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Stack>
              </GridItem>
              <GridItem rowSpan={2} colSpan={2}>
                {deployed ? (
                  <VStack spacing='5'>
                    <Card
                      minH='auto'
                      mx='auto'
                      px={{ base: '6', md: '6' }}
                      py={{ base: '6', md: '6' }}
                    >
                      <DashboardProfile />
                    </Card>
                    <Card
                      minH='auto'
                      mx='auto'
                      px={{ base: '6', md: '6' }}
                      py={{ base: '6', md: '6' }}
                    >
                      <DashboardProfile />
                    </Card>
                  </VStack>
                ) : (
                  <Card
                    minH='auto'
                    mx='auto'
                    px={{ base: '6', md: '6' }}
                    py={{ base: '6', md: '6' }}
                  >
                    <VStack maxW='xl' spacing='6' alignItems='baseline'>
                      <Heading
                        size='sm'
                        fontWeight='regular'
                        color={mode('base.900', 'light.900')}
                      >
                        Almost ready to launch {''}
                        <Text
                          as='span'
                          maxW='xl'
                          color={mode('base.900', 'light.900')}
                          bgGradient={mode(
                            'linear(to-br, secondaryGradient.900, secondary.900)',
                            'linear(to-br, primaryGradient.900, primary.900)',
                          )}
                          bgClip='text'
                        >
                          {name || 'StackerDAO'}
                        </Text>
                      </Heading>
                      <Text
                        maxW='xl'
                        color={mode('base.900', 'light.900')}
                        style={{ margin: '7.5px 0 10px 0' }}
                      >
                        <Text
                          as='span'
                          maxW='xl'
                          mx='auto'
                          fontSize='md'
                          fontWeight='semibold'
                        >
                          Review & deploy
                        </Text>
                        {''} your extensions first!
                      </Text>
                      <Stack spacing='1'>
                        {steps.map((step, id) => (
                          <VerticalStep
                            key={id}
                            payload={step.payload}
                            cursor='pointer'
                            title={step.title}
                            isActive={currentStep === id}
                            isCompleted={currentStep > id}
                            isLastStep={steps.length === id + 1}
                          />
                        ))}
                      </Stack>
                      <Button
                        color='white'
                        isFullWidth
                        bgGradient={mode(
                          'linear(to-br, secondaryGradient.900, secondary.900)',
                          'linear(to-br, primaryGradient.900, primary.900)',
                        )}
                        px='8'
                        my='8'
                        mx='auto'
                        size='lg'
                        fontSize='lg'
                        fontWeight='regular'
                        onClick={() => {
                          setDeployed(true);
                        }}
                        disabled={isDisabled}
                        _hover={
                          isDisabled ? { opacity: 0.9 } : { opacity: 0.8 }
                        }
                        _active={{ opacity: 1 }}
                      >
                        Launch {name || 'StackerDAO'}
                      </Button>
                    </VStack>
                  </Card>
                )}
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

export default DAODashboard;

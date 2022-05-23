import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  Stack,
  StackDivider,
  HStack,
  VStack,
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
import { AppLayout } from '@components/Layout/AppLayout';
import { DataTable } from '@components/DataTable';
import { VaultActionPopover } from '@components/VaultActionPopover';
import { Stat } from '@components/Stat';

const stats = [
  {
    label: 'Total Assets',
    value: '$71,887',
    delta: { value: '$3,218 vs last week', isUpwardsTrend: true },
    path: 'vault',
  },
  {
    label: 'Proposals',
    value: '3',
    delta: { value: '2 active, 1 pending', isUpwardsTrend: true },
    path: 'proposals',
  },
  {
    label: 'Voting Weight',
    value: '2.87%',
    delta: { value: '> 0.5% required', isUpwardsTrend: true },
    path: 'delegate',
  },
];

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaPlus, FaArrowDown } from 'react-icons/fa';

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

const Vault = () => {
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
        <Container maxW='5xl'>
          <Stack spacing={{ base: '8', lg: '6' }}>
            <Stack w='auto'>
              <Box as='section'>
                <Container>
                  <Stack spacing='5'>
                    <Stack
                      spacing='4'
                      mb='3'
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
                      <VaultActionPopover />
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
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

Vault.getLayout = (page: any) => {
  return (
    <AppLayout
      header={
        <Stack spacing={{ base: '8', lg: '6' }} my='3'>
          <Container>
            <Stack
              spacing='4'
              mb='2'
              direction={{ base: 'column', md: 'row' }}
              justify='flex-start'
              align='center'
              color='white'
            >
              <VStack maxW='xl' spacing='3' alignItems='baseline'>
                <HStack>
                  <Box
                    w='50px'
                    h='50px'
                    borderRadius='50%'
                    bgGradient='linear(to-l, secondaryGradient.900, secondary.900)'
                  />
                  <Heading
                    size='xl'
                    pb='2'
                    fontWeight='regular'
                    color='light.900'
                  >
                    StackerDAO
                  </Heading>
                </HStack>
              </VStack>
            </Stack>
            <Stack
              spacing='4'
              mb='6'
              direction={{ base: 'column', md: 'row' }}
              justify='center'
              align='center'
              color='white'
            >
              <Stack
                w='100%'
                direction={{ base: 'column', md: 'row' }}
                divider={<StackDivider borderColor='base.500' />}
              >
                {stats.map((stat, id) => (
                  <Stat
                    key={id}
                    id={id}
                    flex='1'
                    _first={{ pl: '0' }}
                    {...stat}
                  />
                ))}
              </Stack>
            </Stack>
          </Container>
        </Stack>
      }
    >
      {page}
    </AppLayout>
  );
};

export default Vault;

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Container,
  Stack,
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

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { Banner } from '@components/Banner';
import { DataTable } from '@components/DataTable';
import { Header } from '@components/Header';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaArrowRight } from 'react-icons/fa';

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

const DAODashboard = () => {
  const { isSignedIn } = useAuth();
  const currentStxAddress = useCurrentStxAddress();
  const { network } = useNetwork();
  const router = useRouter();
  const { dao } = router.query;

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
      {/* {true && <Banner />} */}
    </motion.div>
  );
};

DAODashboard.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default DAODashboard;

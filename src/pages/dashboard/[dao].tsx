import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Badge,
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

// Data
import { inbox } from '@utils/data';

// Utils
import { truncate } from '@common/helpers';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { Banner } from '@components/Banner';
import { AssetTable } from '@components/AssetTable';
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
                    <AssetTable type='fungible' />
                  </TabPanel>
                  <TabPanel px='0'>
                    <AssetTable type='non_fungible' />
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

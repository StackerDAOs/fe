import { useRouter } from 'next/router';
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
} from '@chakra-ui/react';

// Store
import { useStore as VaultStore } from 'store/VaultStore';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { AssetTable } from '@components/AssetTable';
import { Header } from '@components/Header';
import { VaultActionPopover } from '@components/VaultActionPopover';

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

const Vault = () => {
  const { balance } = VaultStore();
  const { non_fungible_tokens, fungible_tokens } = balance;
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

  // usePolling(() => {
  //   console.log('make api call');
  // }, 7500);

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
                        <AssetTable type='fungible' />
                      </TabPanel>
                      <TabPanel px='0'>
                        <AssetTable type='non_fungible' />
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
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Vault;

import { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  useToast,
} from '@chakra-ui/react';

// Data
import { transactions } from '@utils/data';

// Store
import { useStore as useDaoStore } from 'store/CreateDaoStore';

// Hooks
import { useStep } from '@common/hooks/use-step';

// Data
import { transferAssetsSteps } from '@utils/data';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { RadioCard, RadioCardGroup } from '@components/RadioCardGroup';
import { VerticalStep } from '@components/VerticalStep';
import { VaultActionPopover } from '@components/VaultActionPopover';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaArrowLeft, FaTag, FaVoteYea, FaRocket } from 'react-icons/fa';

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
import { AssetTable } from '@components/AssetTable';

// import { Notification } from '@components/Notification';
// import { CloseButton } from '@components/CloseButton';
// import { useCallFunction } from '@common/hooks/use-call-function';
// import { useTransaction } from '@common/hooks/use-transaction';
// import ContractCallButton from 'widgets/ContractCallButton';

// interface State {
//   txId: string | null;
//   delay: number | null;
// }

const TransferProposal = () => {
  const { isSignedIn } = useAuth();
  const currentStxAddress = useCurrentStxAddress();
  const { network } = useNetwork();
  const router = useRouter();
  const { dao } = router.query;

  // Store
  const [currentStep, { setStep }] = useStep({
    maxStep: transferAssetsSteps.length,
    initialStep: 0,
  });

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

  const RadioCardSelectGroup = () => (
    <RadioCardGroup defaultValue='Token' spacing='3' direction='row'>
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
              alignItems='baseline'
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
                      onClick={() => setStep(id)}
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
                    <TabPanel p='0'>
                      <Box cursor='pointer'>
                        {transactions.map(
                          ({ title, createdBy, createdAt, type }, index) => (
                            <Stack
                              key={index}
                              color='white'
                              py='2'
                              px='3'
                              my='2'
                              borderRadius='lg'
                              _hover={{ bg: 'base.800' }}
                            >
                              <Stack
                                direction='row'
                                spacing='5'
                                display='flex'
                                justifyContent='space-between'
                              >
                                <HStack spacing='3'>
                                  {type === 'submission' ? (
                                    <FaTag fontSize='0.85rem' />
                                  ) : type === 'deploy' ? (
                                    <FaRocket fontSize='0.85rem' />
                                  ) : (
                                    <FaVoteYea fontSize='0.85rem' />
                                  )}
                                  <Text
                                    fontSize='sm'
                                    fontWeight='medium'
                                    color='light.900'
                                  >
                                    {title}
                                  </Text>
                                </HStack>
                                <HStack spacing='3'>
                                  <Text
                                    fontSize='xs'
                                    fontWeight='regular'
                                    color='gray.900'
                                  >
                                    {createdBy}
                                  </Text>
                                  <Text
                                    fontSize='xs'
                                    fontWeight='regular'
                                    color='gray.900'
                                  >
                                    {createdAt}
                                  </Text>
                                </HStack>
                              </Stack>
                            </Stack>
                          ),
                        )}
                      </Box>
                    </TabPanel>
                    <TabPanel px='0'>
                      <AssetTable type='non_fungible' />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
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
                      _hover={{ opacity: 0.9 }}
                      _active={{ opacity: 1 }}
                      onClick={() => console.log('next')}
                    >
                      Next
                    </Button>
                  </HStack>
                </motion.div>
              </Box>
            </SimpleGrid>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
};

TransferProposal.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default TransferProposal;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  Box,
  Button,
  Container,
  Divider,
  HStack,
  Progress,
  Stack,
  VStack,
  SimpleGrid,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react';

// Hooks
import { useStep } from '@common/hooks/use-step';

// Data
import { transactions } from '@utils/data';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { Card } from '@components/Card';

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

const ProposalView = () => {
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

  usePolling(() => {
    console.log('make api call');
  }, true);

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
          <Box py='5'>
            <SimpleGrid
              columns={{ base: 1, md: 1, lg: 2 }}
              alignItems='baseline'
            >
              <Box as='section'>
                <VStack
                  align='left'
                  maxW='md'
                  spacing='4'
                  mb='3'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  color='white'
                >
                  <Box>
                    <Text
                      fontSize='4xl'
                      fontWeight='medium'
                      bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                      bgClip='text'
                    >
                      SDP Disable Emergency Powers
                    </Text>
                    <HStack mt='1' mb='5'>
                      <SimpleGrid
                        display='flex'
                        justify='center'
                        columns={3}
                        spacing='3'
                      >
                        <Tag
                          size='sm'
                          bg='transparent'
                          border='1px solid'
                          borderColor='base.500'
                          p='2'
                        >
                          Transfer Assets
                        </Tag>
                        <Tag
                          size='sm'
                          bg='transparent'
                          border='1px solid'
                          borderColor='base.500'
                          p='2'
                        >
                          Expires ~ 3 days
                        </Tag>
                        <Tag
                          size='sm'
                          bg='transparent'
                          border='1px solid'
                          borderColor='base.500'
                          p='2'
                        >
                          2,500 MEGA required
                        </Tag>
                      </SimpleGrid>
                    </HStack>
                    <Stack my='3'>
                      <Stack
                        spacing='4'
                        direction={{ base: 'column', md: 'row' }}
                        justify='space-between'
                        color='white'
                      >
                        <Box>
                          <Text
                            fontSize='md'
                            fontWeight='regular'
                            color='gray.900'
                          >
                            Description
                          </Text>
                        </Box>
                      </Stack>
                      <Text
                        fontSize='md'
                        maxW='sm'
                        _selection={{
                          bg: 'base.800',
                          color: 'secondary.900',
                        }}
                      >
                        Disables both emergency extensions and removes the
                        ability to propose and execute any emergency proposals
                        on behalf of the DAO.
                      </Text>
                    </Stack>
                    <Stack my='5'>
                      <Stack
                        spacing='4'
                        direction={{ base: 'column', md: 'row' }}
                        justify='space-between'
                        color='white'
                      >
                        <Box>
                          <Text
                            fontSize='md'
                            fontWeight='regular'
                            color='gray.900'
                          >
                            Results
                          </Text>
                        </Box>
                      </Stack>
                      <HStack justify='space-between'>
                        <Text
                          bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                          bgClip='text'
                          fontSize='sm'
                          fontWeight='semibold'
                        >
                          Yes (60%)
                        </Text>
                        <Text
                          color='gray.900'
                          fontSize='sm'
                          fontWeight='semibold'
                        >
                          No (40%)
                        </Text>
                      </HStack>
                      <Progress
                        colorScheme='secondary'
                        size='md'
                        value={60}
                        bg='base.500'
                      />
                    </Stack>
                  </Box>
                </VStack>
              </Box>
              <Box as='section' display='flex' justifyContent='center'>
                <Container>
                  <Card
                    border='1px solid rgb(134, 143, 152)'
                    onClick={() => router.push(`/dashboard/${dao}/proposals/1`)}
                    _hover={{ cursor: 'pointer', bg: 'base.800' }}
                  >
                    <Box
                      py={{ base: '3', md: '3' }}
                      px={{ base: '6', md: '6' }}
                    >
                      <Text
                        fontSize='xl'
                        fontWeight='medium'
                        color='light.900'
                        mb='1'
                      >
                        Proposal Status
                      </Text>
                      <HStack justify='space-between'>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          color='gray.900'
                        >
                          Submitted by
                        </Text>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          color='light.900'
                        >
                          SPG1..98TY
                        </Text>
                      </HStack>
                    </Box>
                    <Divider borderColor='base.500' />
                    <Stack
                      spacing={{ base: '0', md: '1' }}
                      justify='center'
                      py={{ base: '3', md: '3' }}
                      px={{ base: '6', md: '6' }}
                    >
                      <Stack spacing='3'>
                        <HStack justify='space-between'>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='gray.900'
                          >
                            Start Block
                          </Text>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            547231
                          </Text>
                        </HStack>
                        <HStack justify='space-between'>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='gray.900'
                          >
                            End Block
                          </Text>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            557672
                          </Text>
                        </HStack>
                        <HStack justify='space-between'>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='gray.900'
                          >
                            Quorum
                          </Text>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            85%
                          </Text>
                        </HStack>
                        <HStack justify='space-between'>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='gray.900'
                          >
                            Expires in
                          </Text>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            ~ 3 days
                          </Text>
                        </HStack>
                      </Stack>
                    </Stack>
                  </Card>
                  <motion.div
                    variants={SLIDE_UP_BUTTON_VARIANTS}
                    initial={SLIDE_UP_BUTTON_VARIANTS.hidden}
                    animate={SLIDE_UP_BUTTON_VARIANTS.enter}
                    exit={SLIDE_UP_BUTTON_VARIANTS.exit}
                    transition={{ duration: 0.75, type: 'linear' }}
                  >
                    <HStack
                      width='full'
                      mt='5'
                      justifyContent='flex-start'
                      spacing='6'
                    >
                      <Button
                        type='submit'
                        isFullWidth
                        color='white'
                        bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                        _hover={{ opacity: 0.9 }}
                        _active={{ opacity: 1 }}
                        onClick={() => console.log('next')}
                      >
                        Approve
                      </Button>
                      <Button
                        type='submit'
                        color='white'
                        isFullWidth
                        _hover={{ opacity: 0.9 }}
                        _active={{ opacity: 1 }}
                        onClick={() => console.log('next')}
                      >
                        Reject
                      </Button>
                    </HStack>
                  </motion.div>
                </Container>
              </Box>
            </SimpleGrid>
          </Box>
          <motion.div
            variants={FADE_IN_VARIANTS}
            initial={FADE_IN_VARIANTS.hidden}
            animate={FADE_IN_VARIANTS.enter}
            exit={FADE_IN_VARIANTS.exit}
            transition={{ duration: 0.75, type: 'linear' }}
          >
            <Box as='section'>
              <Stack spacing={{ base: '8', lg: '6' }}>
                <Stack w='auto'>
                  <Box as='section'>
                    <Stack spacing='5'>
                      <Stack
                        spacing='4'
                        mb='3'
                        direction={{ base: 'column', md: 'row' }}
                        justify='space-between'
                        color='white'
                      >
                        <Box>
                          <Text fontSize='lg' fontWeight='medium'>
                            Activity
                          </Text>
                          <Text color='gray.900' fontSize='sm'>
                            View the latest transactions for the DAO.
                          </Text>
                        </Box>
                      </Stack>
                    </Stack>
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
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </motion.div>
  );
};

ProposalView.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default ProposalView;
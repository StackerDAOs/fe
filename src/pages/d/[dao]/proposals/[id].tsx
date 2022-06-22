import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Badge,
  ButtonGroup,
  Container,
  Divider,
  HStack,
  Progress,
  Stack,
  VStack,
  SimpleGrid,
  Tab,
  Tabs,
  TabPanel,
  TabList,
  TabPanels,
  Tag,
  Text,
} from '@chakra-ui/react';

import { supabase } from '@utils/supabase';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { AssetTable } from '@components/AssetTable';
import { Card } from '@components/Card';

// Widgets
import { ContractCallButton } from '@widgets/ContractCallButton';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaArrowLeft } from 'react-icons/fa';

// Stacks
import { useCurrentStxAddress } from '@micro-stacks/react';
import {
  trueCV,
  falseCV,
  contractPrincipalCV,
  listCV,
  standardPrincipalCV,
  tupleCV,
  someCV,
  noneCV,
} from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeContractSTXPostCondition,
  makeContractFungiblePostCondition,
  createAssetInfo,
} from 'micro-stacks/transactions';

// Utils
import {
  estimateDays,
  convertToken,
  getPercentage,
  tokenToNumber,
  tokenToDecimals,
  truncate,
  stxToUstx,
} from '@common/helpers';

// Hooks
import {
  useOrganization,
  useBlocks,
  useContractEvents,
  useGovernanceToken,
  useProposal,
  useVotingExtension,
} from '@common/hooks';

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

type TProposal = {
  postConditions?: any;
};

const ProposalView = () => {
  const [state, setState] = useState<TProposal>({ postConditions: [] });
  const currentStxAddress = useCurrentStxAddress();
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { id: proposalPrincipal } = router.query as any;
  const { currentBlockHeight } = useBlocks();
  const { balance } = useGovernanceToken({ organization });
  const {
    contractAddress: votingExtensionAddress,
    contractName: votingExtensionName,
  } = useVotingExtension({ organization });
  const {
    title,
    description,
    type,
    contractAddress: proposalContractAddress,
    contractName: proposalContractName,
    proposer,
    concluded,
    startBlockHeight,
    endBlockHeight,
    votesFor,
    votesAgainst,
    quorumThreshold,
    executionDelay,
    events,
  } = useProposal({ organization, filterByProposal: proposalPrincipal });

  const { events: delegatorEvents } = useContractEvents({
    organization,
    extensionName: 'Voting',
    filter: 'delegate',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('Proposals')
          .select('postConditions')
          .eq(
            'contractAddress',
            `${proposalContractAddress}.${proposalContractName}`,
          );
        console.log({ proposalContractAddress });
        console.log({ proposalContractName });
        if (error) throw error;
        if (data) {
          setState({ ...state, postConditions: data[0].postConditions });
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        console.log('finally');
      }
    };
    fetchData();
  }, [proposalContractAddress]);

  const isEligible = tokenToNumber(Number(balance), 2) > 0;
  const totalVotes = Number(votesFor) + Number(votesAgainst);
  const currentVoterEvent = (event: any) =>
    event?.voter?.value === currentStxAddress;
  const hasVoted = events?.some(currentVoterEvent);
  const isInactive = currentBlockHeight < startBlockHeight;
  const isClosed = currentBlockHeight > Number(endBlockHeight);

  const canExecute =
    currentBlockHeight >= Number(endBlockHeight) + Number(executionDelay);
  const isOpen =
    currentBlockHeight <= endBlockHeight &&
    currentBlockHeight >= startBlockHeight;
  const convertedVotesFor = tokenToNumber(Number(votesFor), 2);
  const convertedVotesAgainst = tokenToNumber(Number(votesAgainst), 2);
  const convertedTotalVotes = tokenToNumber(Number(totalVotes), 2);
  const isPassing =
    convertedVotesFor > convertedVotesAgainst &&
    convertedTotalVotes >= Number(quorumThreshold);

  const currentVoterDelegators = delegatorEvents?.filter(
    (item: any) => item?.who?.value === currentStxAddress,
  );
  const delegateVoteFor =
    proposalContractAddress &&
    proposalContractName &&
    listCV([
      tupleCV({
        for: trueCV(),
        proposal: contractPrincipalCV(
          proposalContractAddress,
          proposalContractName,
        ),
        delegator: noneCV(),
      }),
    ]);
  const delegateVoteAgainst =
    proposalContractAddress &&
    proposalContractName &&
    listCV([
      tupleCV({
        for: falseCV(),
        proposal: contractPrincipalCV(
          proposalContractAddress,
          proposalContractName,
        ),
        delegator: noneCV(),
      }),
    ]);
  const delegatorsFor = currentVoterDelegators?.map((item: any) => {
    const delegatorVotes =
      proposalContractAddress &&
      proposalContractName &&
      tupleCV({
        for: trueCV(),
        proposal: contractPrincipalCV(
          proposalContractAddress,
          proposalContractName,
        ),
        delegator: someCV(standardPrincipalCV(item?.delegator?.value)),
      });
    return delegatorVotes;
  });
  const n = proposalContractAddress &&
    proposalContractName && [
      tupleCV({
        for: trueCV(),
        proposal: contractPrincipalCV(
          proposalContractAddress,
          proposalContractName,
        ),
        delegator: noneCV(),
      }),
      ...delegatorsFor,
    ];
  const t = listCV(n);
  const delegatorsAgainst = currentVoterDelegators?.map((item: any) => {
    const delegatorVotes =
      proposalContractAddress &&
      proposalContractName &&
      listCV([
        tupleCV({
          for: falseCV(),
          proposal: contractPrincipalCV(
            proposalContractAddress,
            proposalContractName,
          ),
          delegator: noneCV(),
        }),
        tupleCV({
          for: falseCV(),
          proposal: contractPrincipalCV(
            proposalContractAddress,
            proposalContractName,
          ),
          delegator: someCV(standardPrincipalCV(item?.delegator?.value)),
        }),
      ]);
    return delegatorVotes;
  });

  const functionName = 'vote-many';
  const postConditions: any = [];

  const functionArgsFor =
    proposalContractAddress &&
    proposalContractName &&
    delegatorsFor &&
    delegatorsFor.length > 0
      ? [t]
      : [delegateVoteFor];
  const functionArgsAgainst =
    proposalContractAddress &&
    proposalContractName &&
    delegatorsAgainst &&
    delegatorsAgainst.length > 0
      ? delegatorsAgainst
      : [delegateVoteAgainst];

  const concludeFunctionName = 'conclude';
  const concludeFunctionArgs =
    proposalContractAddress && proposalContractName
      ? [contractPrincipalCV(proposalContractAddress, proposalContractName)]
      : [];

  const proposalPostConditions: any = state.postConditions;
  const fungibleAsset = proposalPostConditions?.assetAddress;

  const isFungibleAsset = proposalPostConditions?.assetAddress !== undefined;

  const contractAddress = proposalPostConditions?.from?.split('.')[0];
  const contractName = proposalPostConditions?.from?.split('.')[1];
  const assetAddress = fungibleAsset?.split('.')[0];
  const assetName = fungibleAsset?.split('.')[1];
  const fungibleAssetInfo =
    assetAddress &&
    assetName &&
    createAssetInfo(assetAddress, assetName, 'Mega');

  const concludeContractFungiblePostCondition =
    contractAddress && contractName && fungibleAssetInfo
      ? [
          makeContractFungiblePostCondition(
            contractAddress,
            contractName,
            FungibleConditionCode.Equal,
            tokenToDecimals(Number(proposalPostConditions?.amount), 2),
            fungibleAssetInfo,
          ),
        ]
      : [];

  const postConditionAddress = proposalPostConditions?.from?.split('.')[0];
  const postConditionName = proposalPostConditions?.from?.split('.')[1];
  const postConditionCode = FungibleConditionCode.Equal;
  const postConditionAmount = stxToUstx(proposalPostConditions?.amount);
  const concludePostConditions =
    postConditionAddress && postConditionName && currentStxAddress && isPassing
      ? [
          makeContractSTXPostCondition(
            postConditionAddress,
            postConditionName,
            postConditionCode,
            postConditionAmount,
          ),
        ]
      : [];

  const voteFor = {
    contractAddress: votingExtensionAddress,
    contractName: votingExtensionName,
    functionName,
    functionArgs: functionArgsFor,
    postConditions,
  };
  const voteAgainst = {
    contractAddress: votingExtensionAddress,
    contractName: votingExtensionName,
    functionName,
    functionArgs: functionArgsAgainst,
    postConditions,
  };

  const concludeProposal = {
    contractAddress: votingExtensionAddress,
    contractName: votingExtensionName,
    functionName: concludeFunctionName,
    functionArgs: concludeFunctionArgs,
    postConditions: isFungibleAsset
      ? concludeContractFungiblePostCondition
      : concludePostConditions,
  };

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Box as='section' display='flex' alignItems='center'>
        <Container maxW='5xl'>
          <Box py='5' my='5'>
            <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} alignItems='center'>
              <Box as='section'>
                <VStack
                  align='left'
                  maxW='md'
                  spacing='4'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  color='white'
                >
                  <Box>
                    <HStack
                      mb='1'
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
                    <HStack>
                      <Text
                        fontSize='4xl'
                        fontWeight='medium'
                        color='light.600'
                      >
                        {title}
                      </Text>
                    </HStack>
                    <Stack mt='2'>
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
                      <Stack>
                        <Text
                          color='gray.900'
                          fontSize='sm'
                          fontWeight='semibold'
                        >
                          Yes ({convertedVotesFor})
                        </Text>
                        <Progress
                          colorScheme='secondary'
                          size='md'
                          value={getPercentage(totalVotes, Number(votesFor))}
                          bg='base.500'
                        />
                      </Stack>
                      <Stack>
                        <Text
                          color='gray.900'
                          fontSize='sm'
                          fontWeight='semibold'
                        >
                          No ({convertedVotesAgainst})
                        </Text>
                        <Progress
                          colorScheme='whiteAlpha'
                          size='md'
                          value={getPercentage(
                            totalVotes,
                            Number(votesAgainst),
                          )}
                          bg='base.500'
                        />
                      </Stack>
                      <Stack>
                        <Text
                          color='gray.900'
                          fontSize='sm'
                          fontWeight='semibold'
                        >
                          Quorum ({convertedVotesFor + convertedVotesAgainst})
                        </Text>
                        <Progress
                          colorScheme='gray'
                          size='md'
                          value={getPercentage(
                            Number(quorumThreshold),
                            convertedVotesFor + convertedVotesAgainst,
                          )}
                          bg='base.500'
                        />
                      </Stack>
                    </Stack>
                  </Box>
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
                      {!isEligible ? (
                        <></>
                      ) : isClosed && !canExecute ? (
                        <ContractCallButton
                          title={isPassing ? 'Execute' : 'Conclude'}
                          color='white'
                          bg='secondary.900'
                          isFullWidth
                          disabled={true}
                          _disabled={{
                            bg: 'secondary.900',
                            opacity: 0.5,
                            cursor: 'not-allowed',
                            _hover: {
                              bg: 'secondary.900',
                              opacity: 0.5,
                              cursor: 'not-allowed',
                            },
                          }}
                          {...concludeProposal}
                        />
                      ) : canExecute && !concluded ? (
                        <ContractCallButton
                          title={isPassing ? 'Execute' : 'Conclude'}
                          color='white'
                          bg='secondary.900'
                          isFullWidth
                          disabled={concluded}
                          _disabled={{
                            bg: 'secondary.900',
                            opacity: 0.5,
                            cursor: 'not-allowed',
                            _hover: {
                              bg: 'secondary.900',
                              opacity: 0.5,
                              cursor: 'not-allowed',
                            },
                          }}
                          {...concludeProposal}
                        />
                      ) : isInactive || hasVoted || concluded ? (
                        <></>
                      ) : (
                        <>
                          <ContractCallButton
                            title='Approve'
                            bg='secondary.900'
                            color='light.900'
                            isFullWidth
                            disabled={hasVoted}
                            _disabled={{
                              bg: 'base.800',
                              opacity: 0.5,
                              cursor: 'not-allowed',
                              _hover: {
                                bg: 'base.800',
                                opacity: 0.5,
                                cursor: 'not-allowed',
                              },
                            }}
                            {...voteFor}
                          />
                          <ContractCallButton
                            title='Reject'
                            variant='outline'
                            bg='base.900'
                            color='light.900'
                            isFullWidth
                            disabled={hasVoted}
                            _disabled={{
                              bg: 'base.600',
                              opacity: 0.5,
                              cursor: 'not-allowed',
                              _hover: {
                                bg: 'base.600',
                                opacity: 0.5,
                                cursor: 'not-allowed',
                              },
                            }}
                            {...voteAgainst}
                          />
                        </>
                      )}
                    </HStack>
                  </motion.div>
                </VStack>
              </Box>
              <Box as='section' display='flex' justifyContent='center'>
                <Container>
                  <Card bg='base.900' border='1px solid' borderColor='base.500'>
                    <Box
                      py={{ base: '3', md: '3' }}
                      px={{ base: '6', md: '6' }}
                      bg='base.800'
                      borderRdaius='lg'
                      align='center'
                    >
                      <HStack justify='space-between'>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          color='gray.900'
                        >
                          Voting power
                        </Text>
                        <Text color='light.900' fontWeight='regular'>
                          {convertToken(balance.toString(), 2)}{' '}
                          <Text as='span' color='gray.900' fontWeight='medium'>
                            MEGA
                          </Text>
                        </Text>
                      </HStack>
                    </Box>
                    <Box
                      py={{ base: '3', md: '3' }}
                      px={{ base: '6', md: '6' }}
                    >
                      <HStack pb='3' justify='space-between'>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          color='gray.900'
                        >
                          Status
                        </Text>
                        {concluded ? (
                          <Badge
                            colorScheme='secondary'
                            size='sm'
                            px='3'
                            py='2'
                          >
                            Executed
                          </Badge>
                        ) : isClosed && !canExecute ? (
                          <Badge colorScheme='blue' size='sm' px='3' py='2'>
                            Voting completed
                          </Badge>
                        ) : canExecute ? (
                          <Badge colorScheme='green' size='sm' px='3' py='2'>
                            Ready to execute
                          </Badge>
                        ) : isOpen ? (
                          <Badge colorScheme='green' size='sm' px='3' py='2'>
                            Live
                          </Badge>
                        ) : (
                          <Badge colorScheme='yellow' size='sm' px='3' py='2'>
                            Pending
                          </Badge>
                        )}
                      </HStack>
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
                          {proposer && truncate(proposer, 4, 4)}
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
                            {Number(startBlockHeight)}
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
                            {/* TODO: get executionDelay from voting
                            contracts and add to endBlockHeight */}
                            {Number(endBlockHeight)}
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
                            {parseInt(quorumThreshold)?.toLocaleString('en-US')}{' '}
                            MEGA
                          </Text>
                        </HStack>
                        <HStack justify='space-between'>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='gray.900'
                          >
                            Voting Begins
                          </Text>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            {Number(currentBlockHeight) <
                            Number(startBlockHeight)
                              ? `~ ${estimateDays(
                                  Number(startBlockHeight) -
                                    Number(currentBlockHeight),
                                )} days`
                              : `Now`}
                          </Text>
                        </HStack>
                        <HStack justify='space-between'>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='gray.900'
                          >
                            Vote Deadline
                          </Text>
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            {Number(currentBlockHeight) > Number(endBlockHeight)
                              ? `Closed`
                              : `~ ${estimateDays(
                                  Number(endBlockHeight) -
                                    Number(currentBlockHeight),
                                )} days`}
                          </Text>
                        </HStack>
                      </Stack>
                    </Stack>
                  </Card>
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
            {/* <Box as='section'>
              <Stack spacing={{ base: '8', lg: '6' }}>
                <Stack w='auto'>
                  <Box as='section' mb='10'>
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
                            View the latest activity for the current proposal.
                          </Text>
                        </Box>
                      </Stack>
                    </Stack>
                    <Box cursor='pointer'>
                      {events?.map(
                        ({ amount, for: vote, voter }: any, index: number) => (
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
                                {vote?.value ? (
                                  <FaVoteYea fontSize='0.85rem' />
                                ) : (
                                  <HiX fontSize='0.85rem' />
                                )}
                                <Text
                                  fontSize='sm'
                                  fontWeight='medium'
                                  color='light.900'
                                >
                                  {`${vote?.value ? 'Approved' : 'Rejected'}`}
                                </Text>
                              </HStack>
                              <HStack spacing='3'>
                                <Text
                                  fontSize='sm'
                                  fontWeight='regular'
                                  color='light.900'
                                >
                                  {convertToken(amount?.value, 2)}
                                </Text>
                                <Text
                                  fontSize='sm'
                                  fontWeight='medium'
                                  color='gray.900'
                                >
                                  MEGA
                                </Text>
                              </HStack>
                              <HStack spacing='3'>
                                <Text
                                  fontSize='xs'
                                  fontWeight='regular'
                                  color='gray.900'
                                >
                                  submitted by
                                </Text>
                                <Text
                                  fontSize='xs'
                                  fontWeight='regular'
                                  color='gray.900'
                                >
                                  {voter && truncate(voter?.value, 4, 4)}
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
            </Box> */}
            <Box as='section'>
              <Stack spacing={{ base: '8', lg: '6' }}>
                <Stack w='auto'>
                  <Box as='section'>
                    <Tabs color='white' variant='unstyled'>
                      <TabList>
                        <ButtonGroup bg='base.800' borderRadius='lg' p='1'>
                          {['Details', 'Activity'].map((item) => (
                            <Tab
                              key={item}
                              fontSize='sm'
                              borderRadius='lg'
                              color='gray.900'
                              px='5'
                              isFullWidth
                              w='50%'
                              _selected={{
                                bg: 'base.500',
                                color: 'light.900',
                              }}
                            >
                              {item}
                            </Tab>
                          ))}
                        </ButtonGroup>
                      </TabList>
                      <TabPanels>
                        <TabPanel px='0'>
                          <motion.div
                            variants={FADE_IN_VARIANTS}
                            initial={FADE_IN_VARIANTS.hidden}
                            animate={FADE_IN_VARIANTS.enter}
                            exit={FADE_IN_VARIANTS.exit}
                            transition={{ duration: 0.25, type: 'linear' }}
                          >
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
                                _selection={{
                                  bg: 'base.800',
                                  color: 'secondary.900',
                                }}
                              >
                                {description}
                              </Text>
                            </Stack>
                          </motion.div>
                        </TabPanel>
                        <TabPanel px='0'>
                          <motion.div
                            variants={FADE_IN_VARIANTS}
                            initial={FADE_IN_VARIANTS.hidden}
                            animate={FADE_IN_VARIANTS.enter}
                            exit={FADE_IN_VARIANTS.exit}
                            transition={{ duration: 0.25, type: 'linear' }}
                          >
                            <AssetTable
                              color='light.900'
                              size='lg'
                              type='fungible'
                            />
                          </motion.div>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
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

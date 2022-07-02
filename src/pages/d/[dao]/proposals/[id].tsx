import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Badge,
  Button,
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
  Text,
} from '@chakra-ui/react';

import { supabase } from '@utils/supabase';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { AssetTable } from '@components/AssetTable';
import { Card } from '@components/Card';
import { ExecuteProposalButton } from '@components/Actions';
import { VoteManyForButton } from '@components/Actions';
import { VoteManyAgainstButton } from '@components/Actions';

//  Animation
import { motion } from 'framer-motion';

// Icons
import {
  FaExclamationCircle,
  FaClock,
  FaCheckCircle,
  FaInfoCircle,
  FaArrowLeft,
} from 'react-icons/fa';

// Stacks
import { useCurrentStxAddress } from '@micro-stacks/react';

// Utils
import {
  estimateDays,
  convertToken,
  getPercentage,
  tokenToNumber,
  truncate,
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
  const { dao, id: proposalPrincipal } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { currentBlockHeight } = useBlocks();
  const { balance, decimals, symbol } = useGovernanceToken({ organization });
  const {
    contractAddress: votingExtensionAddress,
    contractName: votingExtensionName,
  } = useVotingExtension({ organization });
  const {
    title,
    type,
    description,
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
        if (error) throw error;
        if (data) {
          setState({ ...state, postConditions: data[0].postConditions });
        }
      } catch (e: any) {
        console.error({ e });
      }
    };
    fetchData();
  }, [proposalContractAddress]);

  const isEligible = tokenToNumber(Number(balance), Number(decimals)) > 0;
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
  const convertedVotesFor = tokenToNumber(Number(votesFor), Number(decimals));
  const convertedVotesAgainst = tokenToNumber(
    Number(votesAgainst),
    Number(decimals),
  );
  const convertedTotalVotes = tokenToNumber(
    Number(totalVotes),
    Number(decimals),
  );
  const isPassing =
    convertedVotesFor > convertedVotesAgainst &&
    convertedTotalVotes >= Number(quorumThreshold);

  const voteData = {
    contractAddress: votingExtensionAddress,
    contractName: votingExtensionName,
    proposalContractAddress,
    proposalContractName,
    delegatorEvents,
  };

  const concludeData = {
    contractAddress: votingExtensionAddress,
    contractName: votingExtensionName,
    votingData: { votesFor, votesAgainst, totalVotes, quorumThreshold },
    proposalContractAddress,
    proposalContractName,
  };

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Container maxW='5xl'>
        <Container>
          <Box py='6' my='6'>
            <SimpleGrid
              columns={{ base: 1, md: 1, lg: 2 }}
              alignItems='flex-start'
            >
              <Box as='section'>
                <VStack
                  align='left'
                  maxW='lg'
                  spacing='6'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  color='white'
                >
                  <Stack spacing='1'>
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
                        {title} {type}
                      </Text>
                    </HStack>
                    <HStack>
                      {concluded ? (
                        <Badge
                          bg='base.800'
                          color='secondary.900'
                          size='sm'
                          px='3'
                          py='1'
                        >
                          <HStack>
                            <FaInfoCircle fontSize='0.9rem' />
                            <Text fontSize='sm' fontWeight='medium'>
                              Proposal is concluded
                            </Text>
                          </HStack>
                        </Badge>
                      ) : isClosed && !canExecute ? (
                        <Badge
                          bg='base.800'
                          color='secondary.900'
                          size='sm'
                          px='3'
                          py='1'
                        >
                          <HStack>
                            <FaClock fontSize='0.9rem' />
                            <Text fontSize='sm' fontWeight='medium'>
                              Open for execution in ~{' '}
                              {Number(endBlockHeight) +
                                Number(executionDelay) -
                                Number(currentBlockHeight)}{' '}
                              blocks
                            </Text>
                          </HStack>
                        </Badge>
                      ) : canExecute && !concluded ? (
                        <Badge
                          bg='base.800'
                          color='secondary.900'
                          size='sm'
                          px='3'
                          py='1'
                        >
                          <HStack>
                            <FaClock fontSize='0.9rem' />
                            <Text fontSize='sm' fontWeight='medium'>
                              Ready to {isPassing ? `execute` : `conclude`}
                            </Text>
                          </HStack>
                        </Badge>
                      ) : hasVoted ? (
                        <Badge
                          bg='base.800'
                          color='secondary.900'
                          size='sm'
                          px='3'
                          py='1'
                        >
                          <HStack>
                            <FaCheckCircle fontSize='0.9rem' />
                            <Text fontSize='sm' fontWeight='medium'>
                              Voted
                            </Text>
                          </HStack>
                        </Badge>
                      ) : isInactive ? (
                        <Badge
                          bg='base.800'
                          color='secondary.900'
                          size='sm'
                          px='3'
                          py='1'
                        >
                          <HStack>
                            <FaClock fontSize='0.9rem' />
                            <Text fontSize='sm' fontWeight='medium'>
                              Voting begins in ~{' '}
                              {Number(startBlockHeight) -
                                Number(currentBlockHeight)}{' '}
                              blocks{' '}
                            </Text>
                          </HStack>
                        </Badge>
                      ) : !isEligible ? (
                        <Badge
                          bg='base.800'
                          color='secondary.900'
                          size='sm'
                          px='3'
                          py='1'
                        >
                          <HStack>
                            <FaExclamationCircle fontSize='0.9rem' />
                            <Text fontSize='sm' fontWeight='medium'>
                              Not enough tokens to vote
                            </Text>
                          </HStack>
                        </Badge>
                      ) : null}
                    </HStack>
                    <motion.div
                      variants={FADE_IN_VARIANTS}
                      initial={FADE_IN_VARIANTS.hidden}
                      animate={FADE_IN_VARIANTS.enter}
                      exit={FADE_IN_VARIANTS.exit}
                      transition={{ duration: 0.25, type: 'linear' }}
                    >
                      <Stack mt='2' spacing='3'>
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
                    </motion.div>
                  </Stack>
                  {isEligible && isOpen && !hasVoted ? (
                    <motion.div
                      variants={SLIDE_UP_BUTTON_VARIANTS}
                      initial={SLIDE_UP_BUTTON_VARIANTS.hidden}
                      animate={SLIDE_UP_BUTTON_VARIANTS.enter}
                      exit={SLIDE_UP_BUTTON_VARIANTS.exit}
                      transition={{ duration: 0.85, type: 'linear' }}
                    >
                      <HStack
                        width='full'
                        mt='5'
                        justifyContent='flex-start'
                        spacing='6'
                      >
                        <VoteManyForButton {...voteData} />
                        <VoteManyAgainstButton {...voteData} />
                      </HStack>
                    </motion.div>
                  ) : canExecute && !concluded ? (
                    <ExecuteProposalButton {...concludeData} />
                  ) : null}
                </VStack>
              </Box>
              <Box as='section' display='flex' justifyContent='center'>
                <Container>
                  <Card bg='base.900' border='1px solid' borderColor='base.500'>
                    <Box
                      py={{ base: '3', md: '3' }}
                      px={{ base: '6', md: '6' }}
                      bg='base.800'
                      borderTopLeftRadius='lg'
                      borderTopRightRadius='lg'
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
                          {convertToken(balance.toString(), Number(decimals))}{' '}
                          <Text as='span' color='gray.900' fontWeight='medium'>
                            {symbol}
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
                            bg='base.800'
                            color='secondary.900'
                            size='sm'
                            px='3'
                            py='1'
                          >
                            Executed
                          </Badge>
                        ) : isClosed && !canExecute ? (
                          <Badge
                            bg='base.800'
                            color='secondary.900'
                            size='sm'
                            px='3'
                            py='1'
                          >
                            Voting completed
                          </Badge>
                        ) : canExecute ? (
                          <Badge
                            bg='base.800'
                            color='secondary.900'
                            size='sm'
                            px='3'
                            py='1'
                          >
                            Ready to {isPassing ? `execute` : `conclude`}
                          </Badge>
                        ) : isOpen ? (
                          <Badge
                            bg='base.800'
                            color='secondary.900'
                            size='sm'
                            py='1'
                            px='3'
                          >
                            Live
                          </Badge>
                        ) : (
                          <Badge
                            bg='base.800'
                            color='secondary.900'
                            size='sm'
                            px='3'
                            py='1'
                          >
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
                      <Stack spacing='5'>
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
                            {symbol}
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
                            <Stack>
                              <Stack
                                spacing='4'
                                direction={{ base: 'column', md: 'column' }}
                                color='white'
                              >
                                <Stack>
                                  <Box>
                                    <Text
                                      fontSize='md'
                                      fontWeight='regular'
                                      color='gray.900'
                                    >
                                      Description
                                    </Text>
                                  </Box>
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
                                <Stack align='flex-start'>
                                  <Box>
                                    <Text
                                      fontSize='md'
                                      fontWeight='regular'
                                      color='gray.900'
                                    >
                                      Code
                                    </Text>
                                  </Box>
                                  <Button
                                    as='a'
                                    variant='link'
                                    target='_blank'
                                    href={
                                      process.env.NODE_ENV !== 'production'
                                        ? `http://localhost:8000/txid/${proposalContractAddress}.${proposalContractName}?chain=testnet`
                                        : `https://explorer.stacks.co/txid/${proposalContractAddress}.${proposalContractName}?chain=mainnet`
                                    }
                                  >
                                    <Text
                                      cursor='pointer'
                                      textDecoration='underline'
                                      fontSize='md'
                                      _selection={{
                                        bg: 'base.800',
                                        color: 'secondary.900',
                                      }}
                                    >
                                      View source code
                                    </Text>
                                  </Button>
                                </Stack>
                              </Stack>
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
      </Container>
    </motion.div>
  );
};

ProposalView.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default ProposalView;

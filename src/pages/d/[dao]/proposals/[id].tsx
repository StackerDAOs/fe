import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Badge,
  Container,
  Divider,
  HStack,
  Icon,
  Progress,
  Stack,
  VStack,
  SimpleGrid,
  Tag,
  Text,
} from '@chakra-ui/react';

import { supabase } from '@utils/supabase';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { Card } from '@components/Card';

// Widgets
import { ContractCallButton } from '@widgets/ContractCallButton';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaArrowLeft, FaCheckCircle, FaInfoCircle, FaVoteYea } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';

// Stacks
import { useCurrentStxAddress } from '@micro-stacks/react';
import { boolCV, trueCV, falseCV, contractPrincipalCV, listCV, standardPrincipalCV, tupleCV, someCV, noneCV } from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
} from 'micro-stacks/transactions';

// Utils
import {
  estimateDays,
  convertToken,
  getPercentage,
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

const ProposalView = () => {
  const [state, setState] = useState({postConditions: []});
  const currentStxAddress = useCurrentStxAddress();
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { id: proposalPrincipal } = router.query as any;
  const { currentBlockHeight } = useBlocks();
  const {
    contractAddress: governanceTokenAddress,
    contractName: governanceTokenName,
    balance,
  } = useGovernanceToken({ organization });
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
        .select(
          'postConditions'
        )
        .eq('contractAddress', `${proposalContractAddress}.${proposalContractName}`)
        if (data) {
          setState({...state, postConditions: data[0].postConditions});
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        console.log('finally');
      }
    };
    fetchData();
  }, [proposalContractAddress, proposalContractName])

  const currentVoterDelegators = delegatorEvents?.filter((item: any) => item?.who?.value === currentStxAddress);
  const delegateVoteFor = proposalContractAddress && proposalContractName && listCV([tupleCV({
    for: trueCV(),
    proposal: contractPrincipalCV(proposalContractAddress, proposalContractName),
    delegator: noneCV(),
  })]);
  const delegateVoteAgainst = proposalContractAddress && proposalContractName && listCV([tupleCV({
    for: falseCV(),
    proposal: contractPrincipalCV(proposalContractAddress, proposalContractName),
    delegator: noneCV(),
  })]);
  const delegatorsFor = currentVoterDelegators?.map((item: any, index: number) => {
    const delegatorVotes = proposalContractAddress && proposalContractName && listCV([
      tupleCV({
        for: trueCV(),
        proposal: contractPrincipalCV(proposalContractAddress, proposalContractName),
        delegator: noneCV(),
      }),
      tupleCV({
        for: trueCV(),
        proposal: contractPrincipalCV(proposalContractAddress, proposalContractName),
        delegator: someCV(standardPrincipalCV(item?.delegator?.value)),
      })
    ]);
    return delegatorVotes;
  });
  const delegatorsAgainst = currentVoterDelegators?.map((item: any, index: number) => {
    const delegatorVotes = proposalContractAddress && proposalContractName && listCV([
      tupleCV({
        for: falseCV(),
        proposal: contractPrincipalCV(proposalContractAddress, proposalContractName),
        delegator: noneCV(),
      }),
      tupleCV({
        for: falseCV(),
        proposal: contractPrincipalCV(proposalContractAddress, proposalContractName),
        delegator: someCV(standardPrincipalCV(item?.delegator?.value)),
      })
    ]);
    return delegatorVotes;
  });

  const functionName = 'vote-many';
  const postConditions: any = [];

  const functionArgsFor =
    proposalContractAddress &&
    proposalContractName && delegatorsFor && delegatorsFor.length > 0
      ? delegatorsFor
      : [delegateVoteFor];
  const functionArgsAgainst =
    proposalContractAddress &&
    proposalContractName && delegatorsAgainst && delegatorsAgainst.length > 0
      ? delegatorsAgainst : [delegateVoteAgainst];

  const concludeFunctionName = 'conclude';
  const concludeFunctionArgs =
    proposalContractAddress && proposalContractName
      ? [contractPrincipalCV(proposalContractAddress, proposalContractName)]
      : [];

  // TODO: 
  // Will need to have a more advanced way to map over multiple post conditions
  // orbe able to do the complex mapping of possible post conditions when creating a proposal
  // in the beginning, ie if a user decided to make multiple transfers of 100, 200, and 300 STX
  // we should just capture the post condition amount for 600 immediately rather than storing
  // three separate post conditions for 100, 200, and 300.

  const postConditionsFor = state.postConditions
  const [proposalPostConditions] = postConditionsFor;
  const postConditionAddress = proposalPostConditions?.from?.split('.')[0];
  const postConditionName = proposalPostConditions?.from?.split('.')[1];
  const postConditionCode = FungibleConditionCode.Equal;
  const postConditionAmount = stxToUstx(proposalPostConditions?.amount);
  const concludePostConditions = postConditionAddress && postConditionName && currentStxAddress
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
    postConditions: concludePostConditions,
  };

  const totalVotes = Number(votesFor) + Number(votesAgainst);
  const currentVoterEvent = (event: any) =>
    event?.voter?.value === currentStxAddress;
  const hasVoted = events?.some(currentVoterEvent);
  const isEligible = true;
  const isInactive = currentBlockHeight < startBlockHeight;
  const isClosed = currentBlockHeight > endBlockHeight;
  const isOpen =
    currentBlockHeight <= endBlockHeight &&
    currentBlockHeight >= startBlockHeight;
  const isPassing = Number(votesFor) > Number(votesAgainst);

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
              alignItems='flex-start'
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
                    <HStack>
                      <Text
                        fontSize='4xl'
                        fontWeight='medium'
                        color='light.600'
                      >
                        {title}
                      </Text>
                    </HStack>

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
                          {type}
                        </Tag>
                        <Tag
                          size='sm'
                          bg='transparent'
                          border='1px solid'
                          borderColor='base.500'
                          p='2'
                        >
                          {Number(currentBlockHeight) > Number(endBlockHeight)
                            ? `Closed`
                            : `Closes in ~ ${estimateDays(
                                Number(endBlockHeight) -
                                  Number(currentBlockHeight),
                              )} days`}
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
                        {description}
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
                      {isPassing ? (<HStack justify='space-between'>
                        <Text
                          color='secondary.900'
                          fontSize='sm'
                          fontWeight='semibold'
                        >
                          Yes ({getPercentage(totalVotes, Number(votesFor))}%)
                        </Text>
                        <Text
                          color='gray.900'
                          fontSize='sm'
                          fontWeight='semibold'
                        >
                          No ({getPercentage(totalVotes, Number(votesAgainst))}
                          %)
                        </Text>
                      </HStack>) : (<HStack justify='space-between'>
                        <Text
                          color='gray.900'
                          fontSize='sm'
                          fontWeight='semibold'
                        >
                          Yes ({getPercentage(totalVotes, Number(votesFor))}%)
                        </Text>
                        <Text
                          color='secondary.900'
                          fontSize='sm'
                          fontWeight='semibold'
                        >
                          No ({getPercentage(totalVotes, Number(votesAgainst))}
                          %)
                        </Text>
                      </HStack>)}
                      <Progress
                        colorScheme='secondary'
                        size='md'
                        value={getPercentage(totalVotes, Number(votesFor))}
                        bg='base.500'
                      />
                    </Stack>
                  </Box>
                </VStack>
              </Box>
              <Box as='section' display='flex' justifyContent='center'>
                <Container>
                  <HStack justify='center' mb='5'>
                    <Badge
                      variant='subtle'
                      bg='base.800'
                      color='gray.900'
                      px='3'
                      py='2'
                    >
                      {hasVoted ? (
                        <HStack spacing='2'>
                          <Icon color='secondary.900' as={FaCheckCircle} />
                          <Text color='light.900' fontWeight='regular'>
                            You already voted!
                          </Text>
                          <Text color='light.900' fontWeight='regular'>
                            {convertToken(balance.toString(), 2)}{' '}
                            <Text
                              as='span'
                              color='gray.900'
                              fontWeight='medium'
                            >
                              MEGA
                            </Text>
                          </Text>
                        </HStack>
                      ) : isEligible ? (
                        <HStack spacing='2'>
                          <Icon color='secondary.900' as={FaCheckCircle} />
                          <Text color='light.900' fontWeight='regular'>
                            Voting power:
                          </Text>
                          <Text color='light.900' fontWeight='regular'>
                            {convertToken(balance.toString(), 2)}{' '}
                            <Text
                              as='span'
                              color='gray.900'
                              fontWeight='medium'
                            >
                              MEGA
                            </Text>
                          </Text>
                        </HStack>
                      ) : (
                        <HStack spacing='2'>
                          <Icon color='secondary.900' as={FaInfoCircle} />
                          <Text color='light.900' fontWeight='regular'>
                            Not enough voting power:
                          </Text>
                          <Text color='light.900' fontWeight='regular'>
                            {convertToken(balance.toString(), 2)}{' '}
                            <Text
                              as='span'
                              color='gray.900'
                              fontWeight='medium'
                            >
                              MEGA
                            </Text>
                          </Text>
                        </HStack>
                      )}
                    </Badge>
                  </HStack>
                  <Card bg='base.900' border='1px solid' borderColor='base.500'>
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
                        ) : isClosed ? (
                          <Badge colorScheme='red' size='sm' px='3' py='2'>
                            Ready for execution
                          </Badge>
                        ) : isOpen ? (
                          <Badge colorScheme='green' size='sm' px='3' py='2'>
                            Active
                          </Badge>
                        ) : (
                          <Badge colorScheme='yellow' size='sm' px='3' py='2'>
                            Inactive
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
                            {quorumThreshold} MEGA
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
                            {Number(currentBlockHeight) < Number(startBlockHeight)
                              ? `~ ${estimateDays(
                                Number(startBlockHeight) -
                                  Number(currentBlockHeight),
                              )} days`
                              : `Started`}
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
                      {isClosed ? (
                        <ContractCallButton
                          title='Execute'
                          color='white'
                          bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                          isFullWidth
                          disabled={concluded}
                          _disabled={{
                            bgGradient:
                              'linear(to-br, secondaryGradient.900, secondary.900)',
                            opacity: 0.5,
                            cursor: 'not-allowed',
                            _hover: {
                              bgGradient:
                                'linear(to-br, secondaryGradient.900, secondary.900)',
                              opacity: 0.5,
                              cursor: 'not-allowed',
                            },
                          }}
                          {...concludeProposal}
                        />
                      ) : isInactive ? (
                        <>
                          
                        </>
                      ) : (
                        <>
                          <ContractCallButton
                            title='Approve'
                            color='white'
                            bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                            isFullWidth
                            disabled={hasVoted}
                            _disabled={{
                              bgGradient:
                                'linear(to-br, secondaryGradient.900, secondary.900)',
                              opacity: 0.5,
                              cursor: 'not-allowed',
                              _hover: {
                                bgGradient:
                                  'linear(to-br, secondaryGradient.900, secondary.900)',
                                opacity: 0.5,
                                cursor: 'not-allowed',
                              },
                            }}
                            {...voteFor}
                          />
                          <ContractCallButton
                            title='Reject'
                            color='white'
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
                            View the latest activity for the current proposal.
                          </Text>
                        </Box>
                      </Stack>
                    </Stack>
                    <Box cursor='pointer'>
                      {events?.map(
                        (
                          { amount, event, for: vote, proposal, voter }: any,
                          index: number,
                        ) => (
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
                                  {`${
                                    vote?.value
                                      ? 'Approved'
                                      : 'Rejected'
                                  }`}
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
            </Box>
          </motion.div>}
        </Container>
      </Box>
    </motion.div>
  );
};

ProposalView.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

export default ProposalView;

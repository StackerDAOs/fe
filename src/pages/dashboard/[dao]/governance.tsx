import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  Button,
  Container,
  Stack,
  HStack,
  Progress,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';

// Stacks
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';

// Hooks
import { useBlocks, useProposals, useSubmissions } from '@common/hooks';

// Components
import { Card } from '@components/Card';
import { AppLayout } from '@components/Layout/AppLayout';
import { Header } from '@components/Header';
import { VaultActionPopover } from '@components/VaultActionPopover';

// Widgets
import { ContractCallButton } from '@widgets/ContractCallButton';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaCheck, FaTimes } from 'react-icons/fa';

// Utils
import { getPercentage, estimateDays, truncate } from '@common/helpers';

const Governance = () => {
  const router = useRouter();
  const { dao } = router.query;
  const { currentBlockHeight } = useBlocks();
  const { isLoading, proposals } = useProposals();
  const { proposals: submissions } = useSubmissions();

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  };

  const submissionsByProposal = () => {
    // TODO: get contract address from use extension hook

    return submissions?.map(
      (
        { type, contractAddress: proposalContractAddress, submittedBy }: any,
        index: number,
      ) => {
        const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
        const contractName = 'sde-proposal-submission-with-delegation';
        const functionName = 'propose';
        const functionArgs = [
          contractPrincipalCV(
            proposalContractAddress.split('.')[0],
            proposalContractAddress.split('.')[1],
          ),
          uintCV(2230),
          contractPrincipalCV(
            'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
            'sde-governance-token-with-delegation',
          ),
        ];
        const postConditions: any = [];
        const contractData = {
          contractAddress,
          contractName,
          functionName,
          functionArgs,
          postConditions,
        };
        return (
          <Stack
            key={index}
            color='white'
            bg='base.800'
            py='2'
            px='3'
            my='2'
            borderRadius='lg'
            _even={{
              bg: 'base.900',
              border: '1px solid',
              borderColor: 'base.500',
            }}
          >
            <Stack
              direction='row'
              spacing='5'
              display='flex'
              justifyContent='space-between'
            >
              <HStack spacing='3'>
                <Text fontSize='sm' fontWeight='medium' color='light.900'>
                  SDP Transfer STX
                </Text>
              </HStack>
              <HStack spacing='3'>
                <Text fontSize='sm' fontWeight='regular' color='light.900'>
                  {truncate(submittedBy, 4, 4)}
                </Text>
              </HStack>
              <HStack spacing='3'>
                <ContractCallButton
                  title='Submit'
                  color='white'
                  bg='secondary.900'
                  size='sm'
                  {...contractData}
                />
                <Button
                  color='white'
                  size='sm'
                  _hover={{ opacity: 0.9 }}
                  _active={{ opacity: 1 }}
                >
                  View
                </Button>
              </HStack>
            </Stack>
          </Stack>
        );
      },
    );
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
                                    Action Items
                                  </Text>
                                  <Text color='gray.900' fontSize='sm'>
                                    View the latest proposal contracts ready for
                                    submission.
                                  </Text>
                                </Box>
                              </Stack>
                            </Stack>
                            <SimpleGrid columns={2} spacing='5'>
                              <Box cursor='pointer'>
                                {submissionsByProposal()}
                              </Box>
                              <Card
                                bg='base.900'
                                border='1px solid rgb(134, 143, 152)'
                              >
                                <Stack
                                  direction='row'
                                  spacing='5'
                                  display='flex'
                                  justifyContent='space-between'
                                >
                                  <HStack pb='3' justify='space-between'>
                                    <Text
                                      fontSize='sm'
                                      fontWeight='medium'
                                      color='gray.900'
                                    >
                                      Status
                                    </Text>
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
                                      asdasd
                                    </Text>
                                  </HStack>
                                </Stack>
                              </Card>
                            </SimpleGrid>
                          </Box>
                        </Stack>
                      </Stack>
                    </Box>
                  </motion.div>
                </Container>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Box as='section'>
        <Container maxW='5xl'>
          <Stack spacing={{ base: '8', lg: '6' }}>
            <Stack w='auto'>
              <Box as='section'>
                <Container>
                  {isLoading ? (
                    <Stack>
                      <Skeleton height='20px' />
                      <Skeleton height='20px' />
                      <Skeleton height='20px' />
                    </Stack>
                  ) : proposals?.length === 0 ? (
                    <Stack spacing='3' m='6' alignItems='center' color='white'>
                      <Text fontSize='lg' fontWeight='medium'>
                        No proposals found.
                      </Text>
                      <Link
                        href={`/dashboard/${dao}/proposals/create/transfer`}
                      >
                        <Button
                          my='10'
                          py='4'
                          color='white'
                          bg='secondary.900'
                          size='sm'
                          _hover={{ opacity: 0.9 }}
                          _active={{ opacity: 1 }}
                        >
                          Create proposal
                        </Button>
                      </Link>
                    </Stack>
                  ) : (
                    <>
                      <Stack spacing='5'>
                        <Stack
                          spacing='4'
                          my='6'
                          direction={{ base: 'column', md: 'row' }}
                          justify='space-between'
                          alignItems='center'
                          color='white'
                        >
                          <Box>
                            <Text fontSize='lg' fontWeight='medium'>
                              Proposals
                            </Text>
                            <Text color='gray.900' fontSize='sm'>
                              View all pending, active, and completed proposals.
                            </Text>
                          </Box>
                          <HStack spacing='8'>
                            <VaultActionPopover />
                            {/* <FilterPopover /> */}
                          </HStack>
                        </Stack>
                      </Stack>
                      <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 2 }}
                        spacing='6'
                        py='4'
                        color='white'
                      >
                        {proposals?.map(
                          ({
                            contractAddress,
                            title,
                            description,
                            type,
                            proposer,
                            concluded,
                            startBlockHeight,
                            endBlockHeight,
                            votesFor,
                            votesAgainst,
                          }: any) => {
                            const totalVotes =
                              Number(votesFor) + Number(votesAgainst);
                            const isClosed =
                              currentBlockHeight > endBlockHeight;
                            const isOpen =
                              currentBlockHeight <= endBlockHeight &&
                              currentBlockHeight >= startBlockHeight;
                            return (
                              <motion.div
                                variants={FADE_IN_VARIANTS}
                                initial={FADE_IN_VARIANTS.hidden}
                                animate={FADE_IN_VARIANTS.enter}
                                exit={FADE_IN_VARIANTS.exit}
                                transition={{ duration: 0.25, type: 'linear' }}
                              >
                                <Link
                                  key={Math.random()}
                                  href={`/dashboard/${dao}/proposals/${contractAddress}`}
                                >
                                  <a>
                                    <Card
                                      bg='base.800'
                                      position='relative'
                                      px={{ base: '6', md: '6' }}
                                      py={{ base: '6', md: '6' }}
                                      border='1px solid rgb(134, 143, 152)'
                                      _hover={{
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <Box as='section'>
                                        <VStack
                                          align='left'
                                          maxW='md'
                                          spacing='4'
                                          direction={{
                                            base: 'column',
                                            md: 'row',
                                          }}
                                          justify='space-between'
                                          color='white'
                                        >
                                          <Box>
                                            <HStack justify='space-between'>
                                              <Text
                                                fontSize='xl'
                                                fontWeight='medium'
                                              >
                                                {title}
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
                                                <Badge
                                                  colorScheme='red'
                                                  size='sm'
                                                  px='3'
                                                  py='2'
                                                >
                                                  Ready for execution
                                                </Badge>
                                              ) : isOpen ? (
                                                <Badge
                                                  colorScheme='green'
                                                  size='sm'
                                                  px='3'
                                                  py='2'
                                                >
                                                  Active
                                                </Badge>
                                              ) : (
                                                <Badge
                                                  colorScheme='yellow'
                                                  size='sm'
                                                  px='3'
                                                  py='2'
                                                >
                                                  Pending
                                                </Badge>
                                              )}
                                            </HStack>
                                            <Stack my='3'>
                                              <Stack
                                                spacing='4'
                                                direction={{
                                                  base: 'column',
                                                  md: 'row',
                                                }}
                                                justify='space-between'
                                                color='white'
                                              >
                                                <Box>
                                                  <Text
                                                    fontSize='sm'
                                                    fontWeight='regular'
                                                    color='gray.900'
                                                  >
                                                    Description
                                                  </Text>
                                                </Box>
                                              </Stack>
                                              <Text
                                                fontSize='sm'
                                                maxW='sm'
                                                _selection={{
                                                  bg: 'base.800',
                                                  color: 'secondary.900',
                                                }}
                                              >
                                                {description}
                                              </Text>
                                            </Stack>
                                            <Stack mt='5' mb='3'>
                                              <Stack
                                                spacing='4'
                                                direction={{
                                                  base: 'column',
                                                  md: 'row',
                                                }}
                                                justify='space-between'
                                                color='white'
                                              >
                                                <Box>
                                                  <Text
                                                    fontSize='sm'
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
                                                  Yes (
                                                  {getPercentage(
                                                    totalVotes,
                                                    Number(votesFor),
                                                  )}
                                                  %)
                                                </Text>
                                                <Text
                                                  color='gray.900'
                                                  fontSize='sm'
                                                  fontWeight='semibold'
                                                >
                                                  No (
                                                  {getPercentage(
                                                    totalVotes,
                                                    Number(votesAgainst),
                                                  )}
                                                  %)
                                                </Text>
                                              </HStack>
                                              <Progress
                                                colorScheme='secondary'
                                                size='md'
                                                value={getPercentage(
                                                  totalVotes,
                                                  Number(votesFor),
                                                )}
                                                bg='base.500'
                                              />
                                            </Stack>
                                          </Box>
                                        </VStack>
                                      </Box>
                                    </Card>
                                  </a>
                                </Link>
                              </motion.div>
                            );
                          },
                        )}
                      </SimpleGrid>
                    </>
                  )}
                </Container>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

Governance.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Governance;

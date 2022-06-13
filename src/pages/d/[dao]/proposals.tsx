import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  InputRightAddon,
  Progress,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';

// Stacks
import {
  standardPrincipalCV,
  contractPrincipalCV,
  uintCV,
} from 'micro-stacks/clarity';

// Hooks
import {
  useBlocks,
  useGovernanceTokenExtension,
  useSubmissionExtension,
  useProposals,
  useSubmissions,
} from '@common/hooks';

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

const Proposals = () => {
  const router = useRouter();
  const { dao } = router.query;
  const { currentBlockHeight } = useBlocks();
  const { isLoading, proposals } = useProposals();
  const { proposals: submissions } = useSubmissions();
  const {
    contractName: governanceContractName,
    contractAddress: governanceContractAddress,
  } = useGovernanceTokenExtension();
  const { contractName, contractAddress } = useSubmissionExtension();

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  };

  const submissionsByProposal = () => {
    const startHeight = currentBlockHeight + 150;
    return submissions?.map(
      (
        { type, contractAddress: proposalContractAddress, submittedBy }: any,
        index: number,
      ) => {
        const contractData = {
          contractAddress,
          contractName,
          functionName: 'propose',
          functionArgs: [
            contractPrincipalCV(
              proposalContractAddress.split('.')[0],
              proposalContractAddress.split('.')[1],
            ),
            uintCV(startHeight),
            contractPrincipalCV(
              governanceContractAddress,
              governanceContractName,
            ),
          ],
          postConditions: [],
        };
        return (
          <Stack
            key={index}
            color='white'
            bg='base.900'
            border='1px solid'
            borderColor='base.500'
            py='2'
            px='3'
            mb='2'
            borderRadius='lg'
            _even={{
              bg: 'base.800',
              border: '1px solid',
              borderColor: 'base.500',
            }}
            _last={{ mb: '0' }}
          >
            <Stack
              direction='row'
              spacing='5'
              display='flex'
              justifyContent='space-between'
            >
              <HStack spacing='3'>
                <Text fontSize='sm' fontWeight='medium' color='light.900'>
                  {type}
                </Text>
              </HStack>
              <HStack spacing='3'>
                <Text color='gray.900' fontSize='sm'>
                  {truncate(`${proposalContractAddress}`, 4, 24)}
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
                  View details
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
      {submissions?.length > 0 && (
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
                                      Submissions
                                    </Text>
                                    <Text color='gray.900' fontSize='sm'>
                                      Community deployed contracts ready to
                                      submitted as proposals.
                                    </Text>
                                  </Box>
                                </Stack>
                              </Stack>
                              {submissionsByProposal()}
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
      )}
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
                        </Stack>
                      </Stack>
                      <Stack
                        spacing='3'
                        m='6'
                        alignItems='center'
                        color='white'
                      >
                        <Text fontSize='lg' fontWeight='medium'>
                          No proposals found.
                        </Text>
                        <Link href={`/d/${dao}/proposals/create/transfer`}>
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
                    </>
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
                        mb='10'
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
                                  href={`/d/${dao}/proposals/${contractAddress}`}
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
                                                w='75%'
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
                                                  Inactive
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
                                                  color='gray.900'
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

Proposals.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Proposals;
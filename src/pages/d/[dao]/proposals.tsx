import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Stack,
  HStack,
  SimpleGrid,
  Skeleton,
  Text,
} from '@chakra-ui/react';

// Stacks
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';

// Hooks
import {
  useOrganization,
  useBlocks,
  useGovernanceTokenExtension,
  useSubmissionExtension,
  useProposals,
  useSubmissions,
} from '@common/hooks';
import { useUpdate } from 'react-supabase';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { ProposalCard } from '@components/cards';
import { EmptyState } from '@components/EmptyState';
import { Header } from '@components/Header';

// Widgets
import { ContractCallButton } from '@widgets/ContractCallButton';

//  Animation
import { motion } from 'framer-motion';

// Utils
import { truncate } from '@common/helpers';

const Proposals = () => {
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { currentBlockHeight } = useBlocks();
  const { isLoading, proposals } = useProposals({ organization });
  const { proposals: submissions } = useSubmissions();
  const {
    contractName: governanceContractName,
    contractAddress: governanceContractAddress,
  } = useGovernanceTokenExtension({ organization: organization });
  const { contractName, contractAddress } = useSubmissionExtension({
    organization: organization,
  });

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  };

  const [_, execute] = useUpdate('Proposals');
  const onFinishUpdate = async (contractAddress: string) => {
    try {
      const { error } = await execute({ submitted: true }, (q) =>
        q.eq('contractAddress', contractAddress),
      );
      if (error) throw error;
    } catch (error) {
      console.log({ error });
    }
  };

  const submissionsByProposal = () => {
    const startHeight = currentBlockHeight + 15; // TODO: 15 needs to be dynamic startBlockHeight min
    return submissions?.map(
      (
        { type, contractAddress: proposalContractAddress }: any,
        index: number,
      ) => {
        const isLoading =
          proposalContractAddress &&
          governanceContractAddress &&
          governanceContractName;
        const contractData = isLoading && {
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
                  {proposalContractAddress &&
                    truncate(`${proposalContractAddress}`, 4, 24)}
                </Text>
              </HStack>
              <HStack spacing='3'>
                <ContractCallButton
                  title='Propose'
                  color='white'
                  bg='secondary.900'
                  size='sm'
                  onContractCall={() => onFinishUpdate(proposalContractAddress)}
                  {...contractData}
                />
                <Button
                  as='a'
                  target='_blank'
                  href={
                    process.env.NODE_ENV !== 'production'
                      ? `http://localhost:8000/txid/${proposalContractAddress}?chain=testnet`
                      : `https://explorer.stacks.co/txid/${proposalContractAddress}?chain=mainnet`
                  }
                  bg='base.800'
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
                    <EmptyState
                      heading='No proposals found.'
                      linkTo={`/d/${dao}/proposals/c/survey`}
                      buttonTitle='Create proposal'
                      isDisabled={false}
                    />
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
                      </Stack>
                    </Stack>
                    <SimpleGrid
                      columns={{ base: 1, md: 3 }}
                      spacing='6'
                      mb='10'
                      color='white'
                    >
                      {proposals?.map((data: any, index: number) => (
                        <ProposalCard key={index} {...data} />
                      ))}
                    </SimpleGrid>
                  </>
                )}
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
                                  Inactive proposals
                                </Text>
                                <Text color='gray.900' fontSize='sm'>
                                  List of smart contracts that are ready to be
                                  proposed.
                                </Text>
                              </Box>
                            </Stack>
                          </Stack>
                          {submissions?.length > 0 ? (
                            submissionsByProposal()
                          ) : (
                            <EmptyState
                              heading='No proposals found.'
                              linkTo={`/d/${dao}/proposals/c/survey`}
                              buttonTitle='Create proposal'
                              isDisabled={false}
                            />
                          )}
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
    </motion.div>
  );
};

Proposals.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Proposals;

import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  Container,
  Stack,
  HStack,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

// Store
import { useStore as ProposalStore } from 'store/ProposalStore';

// Components
import { Card } from '@components/Card';
import { AppLayout } from '@components/Layout/AppLayout';
import { Header } from '@components/Header';
import { VaultActionPopover } from '@components/VaultActionPopover';
import { FilterPopover } from '@components/FilterPopover';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaCheck, FaTimes } from 'react-icons/fa';

const Governance = () => {
  const router = useRouter();
  const { dao } = router.query;
  const { proposals } = ProposalStore();

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
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
                        <Text fontSize='2xl' fontWeight='medium'>
                          Proposals
                        </Text>
                        <Text color='gray.900' fontSize='sm'>
                          All registered users in the overview
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
                    {proposals.map(
                      ({
                        contractAddress,
                        title,
                        description,
                        type,
                        proposer,
                        concluded,
                        votesFor,
                        votesAgainst,
                      }: any) => {
                        return (
                          <Link
                            key={Math.random()}
                            href={`/dashboard/${dao}/proposals/${contractAddress}`}
                          >
                            <a>
                              <Card
                                bg='base.900'
                                position='relative'
                                px={{ base: '6', md: '6' }}
                                py={{ base: '6', md: '6' }}
                                border='1px solid rgb(134, 143, 152)'
                                _hover={{ cursor: 'pointer', bg: 'base.800' }}
                              >
                                <Stack
                                  spacing={{ base: '0', md: '2' }}
                                  justify='space-between'
                                >
                                  <HStack>
                                    <Badge
                                      size='sm'
                                      maxW='fit-content'
                                      variant='subtle'
                                      colorScheme={concluded ? 'white' : 'red'}
                                      px='3'
                                      py='2'
                                    >
                                      <HStack spacing='2'>
                                        <Text>{type}</Text>
                                      </HStack>
                                    </Badge>
                                    {concluded && (
                                      <Badge
                                        size='sm'
                                        maxW='fit-content'
                                        variant='subtle'
                                        colorScheme={
                                          votesFor.toString() >
                                          votesAgainst.toString()
                                            ? 'green'
                                            : 'red'
                                        }
                                        px='3'
                                        py='2'
                                      >
                                        <HStack spacing='1'>
                                          {concluded &&
                                          votesFor.toString() >
                                            votesAgainst.toString() ? (
                                            <>
                                              <FaCheck />
                                              <Text>Approved</Text>
                                            </>
                                          ) : (
                                            <>
                                              <FaTimes />
                                              <Text>Failed</Text>
                                            </>
                                          )}
                                        </HStack>
                                      </Badge>
                                    )}
                                  </HStack>
                                  <Stack spacing='1'>
                                    <Text fontSize='lg' fontWeight='medium'>
                                      {title}
                                    </Text>
                                    <Text fontSize='sm' color='gray.900'>
                                      {description}
                                    </Text>
                                  </Stack>
                                </Stack>
                              </Card>
                            </a>
                          </Link>
                        );
                      },
                    )}
                  </SimpleGrid>
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

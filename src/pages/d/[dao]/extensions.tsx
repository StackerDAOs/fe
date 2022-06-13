import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Badge,
  Box,
  Container,
  Stack,
  HStack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

// Data
import { extensions } from '@utils/data';

// Components
import { Header } from '@components/Header';
import { Card } from '@components/Card';
import { AppLayout } from '@components/Layout/AppLayout';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaCheck, FaTimes } from 'react-icons/fa';

const Extensions = () => {
  const router = useRouter();
  const { dao } = router.query;

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
                      mb='3'
                      direction={{ base: 'column', md: 'row' }}
                      justify='space-between'
                      color='white'
                    >
                      <Box>
                        <Text fontSize='2xl' fontWeight='medium'>
                          Available extensions
                        </Text>
                        <Text color='gray.900' fontSize='sm'>
                          Add new features to your DAO.
                        </Text>
                      </Box>
                      <Link href={`/dashboard/${dao}/vault`}>
                        <Box
                          display='flex'
                          alignItems='center'
                          cursor='pointer'
                          _hover={{ textDecoration: 'underline' }}
                        >
                          <Text fontSize='md' px='1'>
                            View more
                          </Text>
                        </Box>
                      </Link>
                    </Stack>
                  </Stack>
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    spacing='6'
                    pb='4'
                    color='white'
                  >
                    {extensions.map(({ type, description, status, result }) => {
                      return (
                        <Card
                          key={type}
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
                                colorScheme={
                                  status === 'COMPLETE'
                                    ? 'white'
                                    : status === 'ACTIVE'
                                    ? 'green'
                                    : 'yellow'
                                }
                                px='3'
                                py='2'
                              >
                                <HStack spacing='2'>
                                  <Text>{status}</Text>
                                </HStack>
                              </Badge>
                              {status === 'COMPLETE' && (
                                <Badge
                                  size='sm'
                                  maxW='fit-content'
                                  variant='subtle'
                                  colorScheme={result ? 'green' : 'red'}
                                  px='3'
                                  py='2'
                                >
                                  <HStack spacing='1'>
                                    {result ? (
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
                                {type}
                              </Text>
                              <Text fontSize='sm' color='gray.900'>
                                {description}
                              </Text>
                            </Stack>
                          </Stack>
                        </Card>
                      );
                    })}
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

Extensions.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Extensions;

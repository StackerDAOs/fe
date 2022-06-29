import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { supabase } from '@utils/supabase';

// Web3
import { useAuth, useUser } from '@micro-stacks/react';

// Animation
import { motion } from 'framer-motion';

// Components
import { EmptyState } from '@components/EmptyState';
import { MainLayout } from '@components/Layout/MainLayout';
import { SectionHeader } from '@components/SectionHeader';
import { Wrapper } from '@components/Wrapper';

// Utils
import Avatar from 'boring-avatars';
import { truncate } from '@common/helpers';

// Icons
import { FaArrowRight } from 'react-icons/fa';

const SLIDE_UP_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 15 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -15 },
};

type TProjectsTable = {
  isLoading: boolean;
  projects: any[];
};

const initialState = {
  isLoading: true,
  projects: [],
};

const Index = () => {
  const { isSignedIn } = useAuth();
  const { currentStxAddress } = useUser();
  const [state, setState] = useState<TProjectsTable>(initialState);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: Organizations, error } = await supabase
          .from('Organizations')
          .select('id, name, slug, contractAddress');
        if (error) throw error;
        if (Organizations.length > 0) {
          const projects = Organizations;
          setState({ ...state, isLoading: false, projects });
        }
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
      }
    };
    fetchProjects();
  }, [currentStxAddress]);

  if (state.projects.length === 0) {
    return <EmptyState heading='No projects found' />;
  }

  return (
    <>
      <Box as='section'>
        <motion.div
          variants={SLIDE_UP_VARIANTS}
          initial={SLIDE_UP_VARIANTS.hidden}
          animate={SLIDE_UP_VARIANTS.enter}
          exit={SLIDE_UP_VARIANTS.exit}
          transition={{ duration: 0.75, type: 'linear' }}
        >
          <Box
            as='section'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <Wrapper>
              {isSignedIn ? (
                <>
                  <Stack
                    spacing={{ base: '8', md: '10' }}
                    align='center'
                    maxW='3xl'
                    mx='auto'
                  >
                    <Box textAlign='center' maxW='900px'>
                      <Heading
                        as='h1'
                        size='xl'
                        fontWeight='extrabold'
                        maxW='48rem'
                        mx='auto'
                        lineHeight='1.2'
                        letterSpacing='tight'
                        color='light.900'
                      >
                        DAOs on {''}
                        <Text
                          as='span'
                          pr='2'
                          maxW='xl'
                          mx='auto'
                          color='light.900'
                          bgGradient='linear(to-br, secondary.900, secondaryGradient.900)'
                          bgClip='text'
                          fontStyle='italic'
                        >
                          Bitcoin
                        </Text>
                      </Heading>
                      <Text
                        mt='4'
                        p='4'
                        maxW='xl'
                        mx='auto'
                        fontSize='lg'
                        color='gray.900'
                      >
                        Unleashing the ownership economy. No-code platform, dev
                        tools, & legal tech to build & manage #Bitcoin DAOs via
                        @Stacks.
                      </Text>
                      <Stack
                        direction='row'
                        spacing={4}
                        align='center'
                        justify='center'
                      >
                        {/* <a
                  href={`${baseUrl}/communities/get-started`}
                  target='_blank'
                  rel='noreferrer'
                > */}
                        <motion.div
                          variants={SLIDE_UP_VARIANTS}
                          initial={SLIDE_UP_VARIANTS.hidden}
                          animate={SLIDE_UP_VARIANTS.enter}
                          exit={SLIDE_UP_VARIANTS.exit}
                          transition={{ duration: 0.8, type: 'linear' }}
                        >
                          <Stack>
                            <Button
                              position='relative'
                              color='white'
                              bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                              p='6'
                              my='8'
                              size='md'
                              fontWeight='semibold'
                              disabled={true}
                              _hover={{ opacity: 0.35 }}
                              _active={{ opacity: 1 }}
                            >
                              Launch your DAO
                              <Text
                                as='span'
                                position='absolute'
                                bottom='-20px'
                                fontSize='sm'
                                color='light.900'
                              >
                                Coming soon.
                              </Text>
                            </Button>
                          </Stack>
                        </motion.div>
                        {/* </a> */}
                        <a
                          href={`https://discord.gg/nRbvWMBEQq`}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <motion.div
                            variants={SLIDE_UP_VARIANTS}
                            initial={SLIDE_UP_VARIANTS.hidden}
                            animate={SLIDE_UP_VARIANTS.enter}
                            exit={SLIDE_UP_VARIANTS.exit}
                            transition={{ duration: 0.8, type: 'linear' }}
                          >
                            <Button
                              bg='base.800'
                              color='white'
                              p='6'
                              my='8'
                              size='md'
                              fontWeight='medium'
                              _hover={{ opacity: 0.9 }}
                            >
                              Join the Discord
                            </Button>
                          </motion.div>
                        </a>
                      </Stack>
                    </Box>
                  </Stack>
                  <SectionHeader
                    justify='flex-start'
                    align='center'
                    color='white'
                  >
                    <Box>
                      <Heading size='xs' fontWeight='regular'>
                        Featured projects
                      </Heading>
                    </Box>
                  </SectionHeader>
                  <Stack spacing='0'>
                    {state?.projects?.map((project) => (
                      <Stack
                        key={project.id}
                        px='3'
                        py='5'
                        borderBottom='1px'
                        borderColor='base.500'
                        _hover={{ bg: 'base.800' }}
                      >
                        <HStack justify='space-between'>
                          <HStack spacing='3'>
                            <Avatar
                              size={35}
                              name={project.name}
                              variant='marble'
                              colors={[
                                '#50DDC3',
                                '#624AF2',
                                '#EB00FF',
                                '#7301FA',
                                '#25C2A0',
                              ]}
                            />
                            <Stack spacing='0'>
                              <Text color='light.900'>{project.name}</Text>
                              <Text color='gray.900' size='xs'>
                                {truncate(project.contractAddress, 4, 14)}
                              </Text>
                            </Stack>
                          </HStack>
                          <Stack>
                            <Stack spacing='1'>
                              <Link href={`/d/${project.slug}`}>
                                <a target='_blank' rel='noreferrer'>
                                  <IconButton
                                    icon={<FaArrowRight fontSize='0.75em' />}
                                    bg='base.900'
                                    color='light.900'
                                    size='md'
                                    border='1px solid'
                                    borderColor='base.500'
                                    aria-label='Transfer'
                                    _hover={{ bg: 'secondary.900' }}
                                  />
                                </a>
                              </Link>
                            </Stack>
                          </Stack>
                        </HStack>
                      </Stack>
                    ))}
                  </Stack>
                </>
              ) : (
                <Stack spacing='3' m='6' alignItems='center' color='white'>
                  <Text fontSize='2xl' fontWeight='medium'>
                    Get started
                  </Text>
                  <Text
                    fontSize='sm'
                    fontWeight='regular'
                    color='gray.900'
                    maxW='md'
                    mx='auto'
                    textAlign='center'
                  >
                    By connecting your wallet, you agree to Stacker DAO Labs
                    Terms, Privacy Policy, and Community Standards
                  </Text>

                  <Button
                    my='10'
                    py='4'
                    color='white'
                    bg='secondary.900'
                    size='sm'
                    _hover={{ opacity: 0.9 }}
                    _active={{ opacity: 1 }}
                  >
                    Connect your wallet
                  </Button>
                </Stack>
              )}
            </Wrapper>
          </Box>
        </motion.div>
      </Box>
    </>
  );
};

Index.getLayout = (page: any) => <MainLayout>{page}</MainLayout>;

export default Index;

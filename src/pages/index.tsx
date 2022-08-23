import React from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';

// Hooks
import { useProjects } from '@lib/hooks';

// Utils
import { isEmpty, map } from 'lodash';
import { truncateAddress } from '@stacks-os/utils';

// Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS, SLIDE_UP_VARIANTS } from '@lib/animation';

// Components
import { EmptyState } from '@components/misc';
import { MainLayout } from '@components/layouts';
import { SectionHeader } from '@components/containers';
import { Wrapper } from '@components/containers';

const MotionBox = motion(Box);

const Index = () => {
  const projectsQuery = useProjects();

  if (isEmpty(projectsQuery?.data)) {
    return <EmptyState heading='No projects found' />;
  }

  return (
    <>
      <motion.div
        variants={FADE_IN_VARIANTS}
        initial={FADE_IN_VARIANTS.hidden}
        animate={FADE_IN_VARIANTS.enter}
        exit={FADE_IN_VARIANTS.exit}
        transition={{ duration: 0.75, type: 'linear' }}
      >
        <Box
          as='section'
          display='flex'
          alignItems='center'
          justifyContent='center'
          mb='10'
        >
          <Wrapper>
            <Stack spacing='8'>
              <Stack maxW='2xl' spacing='2'>
                <HStack>
                  <Text fontSize='md' fontWeight='light' color='light.900'>
                    Protocol built on{' '}
                  </Text>
                  <Image
                    src='https://assets-global.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde159efe39d4_Stacks%20logo.svg'
                    w='13'
                    h='13'
                  />
                </HStack>
                <Heading
                  size='xl'
                  fontWeight='regular'
                  lineHeight='1.2'
                  letterSpacing='tight'
                  color='light.900'
                >
                  DAOs powered by {''}
                  <Text
                    color='light.900'
                    fontWeight='black'
                    fontSize='1.15em'
                    bgGradient='linear(to-br, bitcoin.900, bitcoin.800)'
                    bgClip='text'
                  >
                    Bitcoin
                  </Text>
                </Heading>
                <Text fontSize='lg' color='gray.900'>
                  Bring your ideas to life by submitting a proposal to a Prop
                  House. Funding rounds are held regularly and are available to
                  anyone, anywhere.
                </Text>
                <ButtonGroup>
                  <a
                    href={`https://form.typeform.com/to/zfYJYLgV`}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Button
                      bg='light.900'
                      color='base.900'
                      p='6'
                      size='md'
                      fontWeight='medium'
                      _hover={{
                        opacity: 0.9,
                      }}
                    >
                      Join our beta
                    </Button>
                  </a>
                </ButtonGroup>
              </Stack>
              <motion.div
                variants={SLIDE_UP_VARIANTS}
                initial={SLIDE_UP_VARIANTS.hidden}
                animate={SLIDE_UP_VARIANTS.enter}
                exit={SLIDE_UP_VARIANTS.exit}
                transition={{ duration: 0.8, type: 'linear' }}
              >
                <Stack spacing='2'>
                  <SectionHeader
                    justify='flex-start'
                    align='center'
                    color='white'
                  >
                    <Stack spacing='3'>
                      <Text fontSize='md' fontWeight='light' color='gray.900'>
                        Browse communities
                      </Text>
                      <Heading mt='0 !important' size='sm' fontWeight='regular'>
                        Explore DAOs
                      </Heading>
                    </Stack>
                  </SectionHeader>
                  <HStack spacing='6'>
                    {map(projectsQuery.data, (project: any) => (
                      <Link key={project.name} href={`/d/${project.slug}`}>
                        <Stack spacing='2' w='200px' h='200px' cursor='pointer'>
                          <MotionBox
                            whileHover={{
                              scale: 1.025,
                              transition: { duration: 0.25 },
                            }}
                            border='1px solid'
                            borderColor='base.500'
                            rounded='lg'
                          >
                            <Image
                              src='https://images.gamma.io/cdn-cgi/image/quality=100,width=300,height=300/https://images.gamma.io/ipfs/QmZjrCc9836Njqw1Yx8ztM6FbJzvuZijwtZJSkKPxLTMWU/225f43251ea44'
                              w='auto'
                              h='auto'
                              rounded='lg'
                            />
                          </MotionBox>
                          <Stack spacing='0' px='2'>
                            <Text
                              fontSize='md'
                              fontWeight='medium'
                              color='light.900'
                            >
                              {project.name}
                            </Text>
                            <Text
                              fontSize='sm'
                              fontWeight='light'
                              color='gray.900'
                            >
                              {truncateAddress(project.contractAddress)}
                            </Text>
                          </Stack>
                        </Stack>
                      </Link>
                    ))}
                  </HStack>
                </Stack>
              </motion.div>
            </Stack>
          </Wrapper>
        </Box>
      </motion.div>
    </>
  );
};

Index.getLayout = (page: any) => <MainLayout>{page}</MainLayout>;

export default Index;

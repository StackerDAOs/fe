import React from 'react';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/layouts';
import { Header } from '@components/headers';
import { Wrapper } from '@components/containers';

//  Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from 'lib/animation';

// Icons
import { SectionHeader } from '@components/containers';

const Extensions = () => {
  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Wrapper>
        <SectionHeader justify='flex-start' align='center' color='white'>
          <Box>
            <Text fontSize='lg' fontWeight='medium'>
              Available Extensions
            </Text>
            <Text color='gray.900' fontSize='sm'>
              Coming soon...
            </Text>
          </Box>
        </SectionHeader>
        <SimpleGrid
          display='none'
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing='6'
          pb='4'
          color='white'
        >
          {/* {extensions.map(({ type, description, status, result }) => {
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
                <Stack spacing={{ base: '0', md: '2' }} justify='space-between'>
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
          })} */}
        </SimpleGrid>
      </Wrapper>
    </motion.div>
  );
};

Extensions.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Extensions;

import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';

import { motion } from 'framer-motion';

// Components
import { MainLayout } from '@components/Layout/MainLayout';

const Index = () => {
  const SLIDE_UP_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 15 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -15 },
  };

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
            h='85vh'
          >
            <Container maxW='5xl'>
              <Stack spacing={{ base: '8', lg: '6' }}>
                <Stack w='auto'>
                  <Box as='section'>
                    <Container>
                      <Stack
                        spacing='3'
                        m='6'
                        alignItems='center'
                        color='white'
                      >
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
                          By connecting your wallet, you agree to Stacker DAO
                          Labs Terms, Privacy Policy, and Community Standards
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
                    </Container>
                  </Box>
                </Stack>
              </Stack>
            </Container>
          </Box>
        </motion.div>
      </Box>
    </>
  );
};

Index.getLayout = (page: any) => <MainLayout>{page}</MainLayout>;

export default Index;

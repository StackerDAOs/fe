import { Box, Container, Stack, Text } from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { FilterPopover } from '@components/FilterPopover';
import { Header } from '@components/Header';

//  Animation
import { motion } from 'framer-motion';

const Activity = () => {
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
                          Activity
                        </Text>
                        <Text color='gray.900' fontSize='sm'>
                          View the latest transactions for the DAO.
                        </Text>
                      </Box>
                      <FilterPopover />
                    </Stack>
                  </Stack>
                </Container>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

Activity.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Activity;

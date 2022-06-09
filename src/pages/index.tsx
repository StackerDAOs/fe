import Link from 'next/link';
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';

// Components
import { DefaultLayout } from '@components/Layout/DefaultLayout';

const Index = () => {
  const SLIDE_UP_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 15 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -15 },
  };

  const SLIDE_UP_BUTTON_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 15 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -15 },
  };

  return (
    <>
      <Box
        as='section'
        display='flex'
        height='95vh'
        alignItems='center'
        justifyContent='center'
        color='white'
        bgGradient='linear(to-b, base.900, base.800)'
      >
        <motion.div
          variants={SLIDE_UP_VARIANTS}
          initial={SLIDE_UP_VARIANTS.hidden}
          animate={SLIDE_UP_VARIANTS.enter}
          exit={SLIDE_UP_VARIANTS.exit}
          transition={{ duration: 0.75, type: 'linear' }}
        >
          <Box
            maxW={{ base: 'xl', md: '5xl' }}
            mx='auto'
            px={{ base: '6', md: '8' }}
          >
            <Box textAlign='center' maxW='900px'>
              <Heading
                as='h1'
                size='2xl'
                fontWeight='extrabold'
                maxW='48rem'
                mx='auto'
                lineHeight='1.2'
                letterSpacing='tight'
                color='light.900'
              >
                Build your community on {''}
                <Text
                  as='span'
                  mt='4'
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
                Unleashing the ownership economy. No-code platform, dev tools, &
                legal tech to build & manage #Bitcoin DAOs via @Stacks.
              </Text>
              <Stack
                direction='row'
                spacing={4}
                align='center'
                justify='center'
              >
                <Link href={{ pathname: '/communities/get-started' }}>
                  <motion.div
                    variants={SLIDE_UP_BUTTON_VARIANTS}
                    initial={SLIDE_UP_BUTTON_VARIANTS.hidden}
                    animate={SLIDE_UP_BUTTON_VARIANTS.enter}
                    exit={SLIDE_UP_BUTTON_VARIANTS.exit}
                    transition={{ duration: 0.8, type: 'linear' }}
                  >
                    <Button
                      color='white'
                      bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                      p='6'
                      my='8'
                      size='md'
                      fontWeight='semibold'
                      _hover={{ opacity: 0.9 }}
                      _active={{ opacity: 1 }}
                    >
                      Launch a DAO
                    </Button>
                  </motion.div>
                </Link>
                <Link href={{ pathname: '/dashboard/stackerdao' }}>
                  <motion.div
                    variants={SLIDE_UP_BUTTON_VARIANTS}
                    initial={SLIDE_UP_BUTTON_VARIANTS.hidden}
                    animate={SLIDE_UP_BUTTON_VARIANTS.enter}
                    exit={SLIDE_UP_BUTTON_VARIANTS.exit}
                    transition={{ duration: 0.8, type: 'linear' }}
                  >
                    <Button
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
                </Link>
              </Stack>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </>
  );
};

Index.getLayout = (page: any) => <DefaultLayout>{page}</DefaultLayout>;

export default Index;

import { useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Heading,
  HStack,
  StackDivider,
  VStack,
  useBreakpointValue,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Store
import { useStore } from 'store/CommunityStepStore';

// Animations
import { motion } from 'framer-motion';

// Components
import { AppNavbar } from '@components/AppNavbar';
import { Card } from '@components/Card';
import { Stat } from '@components/Stat';

const stats = [
  {
    label: 'Total Assets',
    value: '$71,887',
    delta: { value: '$3,218 vs last week', isUpwardsTrend: true },
    path: '/vault',
  },
  {
    label: 'Proposals',
    value: '3',
    delta: { value: '2 active, 1 pending', isUpwardsTrend: true },
    path: '/proposals',
  },
  {
    label: 'Voting Weight',
    value: '2.87%',
    delta: { value: '> 0.5% required', isUpwardsTrend: true },
    path: '/delegate',
  },
];

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

export const AppLayout = ({ children }: any) => {
  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <AppNavbar />
      <Box as='section'>
        <Container maxW='5xl' mt='6' pt='6'>
          <Stack spacing={{ base: '8', lg: '6' }} my='3'>
            <Container>
              <Stack
                spacing='4'
                mb='2'
                direction={{ base: 'column', md: 'row' }}
                justify='flex-start'
                align='center'
                color='white'
              >
                <VStack maxW='xl' spacing='3' alignItems='baseline'>
                  <HStack>
                    <Box
                      w='50px'
                      h='50px'
                      borderRadius='50%'
                      bgGradient='linear(to-l, secondaryGradient.900, secondary.900)'
                    />
                    <Heading
                      size='xl'
                      pb='2'
                      fontWeight='regular'
                      color={mode('base.900', 'light.900')}
                    >
                      StackerDAO
                    </Heading>
                  </HStack>
                </VStack>
              </Stack>
              <Stack
                spacing='4'
                mb='6'
                direction={{ base: 'column', md: 'row' }}
                justify='center'
                align='center'
                color='white'
              >
                <Stack
                  w='100%'
                  direction={{ base: 'column', md: 'row' }}
                  divider={<StackDivider borderColor='base.500' />}
                >
                  {stats.map((stat, id) => (
                    <Stat
                      key={id}
                      id={id}
                      flex='1'
                      _first={{ pl: '0' }}
                      {...stat}
                    />
                  ))}
                </Stack>
              </Stack>
            </Container>
          </Stack>
        </Container>
      </Box>
      {children}
    </motion.div>
  );
};

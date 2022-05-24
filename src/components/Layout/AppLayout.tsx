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

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

export const AppLayout = ({ header, children }: any) => {
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
          {header}
        </Container>
      </Box>
      {children}
    </motion.div>
  );
};

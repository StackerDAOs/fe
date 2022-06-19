import { Box, Container } from '@chakra-ui/react';

// Animations
import { motion } from 'framer-motion';

// Components
import { AppNavbar } from '@components/AppNavbar';
import { AppFooter } from '@components/AppFooter';

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
        <Container maxW='5xl'>{header}</Container>
      </Box>
      {children}
      <AppFooter />
    </motion.div>
  );
};

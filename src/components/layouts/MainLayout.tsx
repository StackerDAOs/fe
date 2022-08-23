import React from 'react';
import { Box, Container } from '@chakra-ui/react';

// Animations
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@lib/animation';

// Components
import { Footer } from '@components/footers';
import { MainNavbar } from '@components/navbars';

export const MainLayout = ({ header, children }: any) => {
  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <MainNavbar />
      <Box as='section'>
        <Container maxW='5xl' mt='6' pt='6'>
          {header}
        </Container>
      </Box>
      {children}
      <Footer />
    </motion.div>
  );
};

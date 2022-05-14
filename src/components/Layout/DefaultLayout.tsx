import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, HStack } from '@chakra-ui/react';

// Store
import { useStore } from 'store/CommunityStepStore';

// Animations
import { motion } from 'framer-motion';

// Components
import { Navbar } from '@components/Navbar';

export const DefaultLayout = ({ children }: any) => {
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
      <Navbar />
      {children}
    </motion.div>
  );
};

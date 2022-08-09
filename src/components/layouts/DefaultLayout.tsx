import React from 'react';

// Animations
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@lib/animation';

// Components
import { Navbar } from '@components/navbars';

export const DefaultLayout = ({ children }: any) => {
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

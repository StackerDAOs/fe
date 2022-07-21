import { useState } from 'react';
import { Box, Icon, useClipboard } from '@chakra-ui/react';
import { FiCopy, FiCheck } from 'react-icons/fi';

// Animation
import { motion } from 'framer-motion';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 1, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 1, x: 0, y: 0 },
};

export const CopyClipboard = (props: any) => {
  const [isHovered, setHovered] = useState(false);
  const [value, setValue] = useState(props.contractAddress);
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.25, type: 'linear' }}
      whileHover={{
        scale: 1.1,
      }}
      // whileTap={{
      //   scale: 1,
      // }}
      onClick={onCopy}
    >
      {hasCopied ? (
        <Icon
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          _hover={{
            cursor: 'pointer',
          }}
          as={FiCheck}
          color='light.600'
        />
      ) : (
        <Icon
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          _hover={{
            cursor: 'pointer',
          }}
          as={FiCopy}
          color='light.600'
        />
      )}
    </motion.div>
  );
};

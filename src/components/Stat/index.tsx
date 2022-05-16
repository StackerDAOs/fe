import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  BoxProps,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiArrowUpRight } from 'react-icons/fi';

import { motion } from 'framer-motion';

interface Props extends BoxProps {
  id: string;
  path: string;
  label: string;
  value: string;
  delta: {
    value: string;
    isUpwardsTrend: boolean;
  };
}

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

export const Stat = (props: Props) => {
  const { id, path, label, value, delta, ...boxProps } = props;
  console.log({ props });
  const [isHovered, setHovered] = useState(false);
  return (
    <Link href={`/dashboard/dao/${path}`}>
      <Box
        px={{ base: '4', md: '6' }}
        py={{ base: '5', md: '3' }}
        {...boxProps}
        _hover={{ cursor: 'pointer' }}
      >
        <Stack>
          <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            <HStack justify='space-between' h='2.5vh'>
              <Text fontSize='sm' color='gray.900'>
                {label}
              </Text>
              {isHovered && (
                <motion.div
                  variants={FADE_IN_VARIANTS}
                  initial={FADE_IN_VARIANTS.hidden}
                  animate={FADE_IN_VARIANTS.enter}
                  exit={FADE_IN_VARIANTS.exit}
                  transition={{ duration: 0.5, type: 'linear' }}
                >
                  <Icon as={FiArrowUpRight} boxSize='5' color='light.900' />
                </motion.div>
              )}
            </HStack>
            <Stack>
              <Heading size='xs'>{value}</Heading>
              <HStack spacing='1' fontWeight='medium'>
                <Text
                  as='span'
                  fontSize='sm'
                  pr='2'
                  maxW='xl'
                  bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                  bgClip='text'
                >
                  {delta.value}
                </Text>
              </HStack>
            </Stack>
          </motion.div>
        </Stack>
      </Box>
    </Link>
  );
};

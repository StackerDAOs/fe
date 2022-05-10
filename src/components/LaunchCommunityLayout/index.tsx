import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, HStack } from '@chakra-ui/react';

// Store
import { useStore } from 'store/CommunityStepStore';

// Animations
import { motion } from 'framer-motion';

// Components
import { Step } from '@components/Step';

export const LaunchCommunityLayout = ({ children }: any) => {
  const { maxSteps, currentStep } = useStore();
  const router = useRouter();

  useEffect(() => {
    handleRouting(currentStep);
  }, []);

  function handleRouting(step: number) {
    switch (step) {
      case 0:
        router.push('/communities/get-started');
        break;
      case 1:
        router.push('/communities/setup-vault');
        break;
      case 2:
        router.push('/communities/proposals');
        break;
      case 3:
        router.push('/communities/voting');
        break;
      case 4:
        router.push('/communities/emergency-rules');
        break;
      case 5:
        router.push('/communities/ready');
        break;
      default:
        break;
    }
  }

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
      <Box as='section' color='white' pt='10' mt='10'>
        <Box maxW={{ base: 'xl', md: '6xl' }} mx='auto'>
          <HStack spacing='0' justify='space-evenly'>
            {[...Array(maxSteps)].map((_, id) => (
              <Step
                key={id}
                cursor='pointer'
                isActive={currentStep === id}
                isCompleted={currentStep > id}
                isLastStep={maxSteps === id + 1}
              />
            ))}
          </HStack>
          <Box as='section' color='white' mt='7.5%'>
            {children}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

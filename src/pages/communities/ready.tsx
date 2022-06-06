import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Helpers
import { findIndex } from 'lodash';

// Utils
import { paths } from '@utils/data';
import { daoCore } from '@utils/extensions';

// Store
import { useStore as useCommunityStepStore } from 'store/CommunityStepStore';

// Animations
import { motion } from 'framer-motion';

// Components
import { Card } from '@components/Card';
import { LaunchCommunityLayout } from '@components/LaunchCommunityLayout';

// Widgets
import { ContractDeployButton } from '@widgets/ContractDeployButton';

const Ready = () => {
  const { currentStep, setStep } = useCommunityStepStore();
  const router = useRouter();

  const SLIDE_UP_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 15 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -15 },
  };

  const SLIDE_UP_BUTTON_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 25 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -25 },
  };

  function handlePrevious() {
    setStep(currentStep - 1);
    const { previousPath } = paths[findIndex(paths, { path: router.pathname })];
    router.push(previousPath);
  }

  return (
    <motion.div
      variants={SLIDE_UP_VARIANTS}
      initial={SLIDE_UP_VARIANTS.hidden}
      animate={SLIDE_UP_VARIANTS.enter}
      exit={SLIDE_UP_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Box maxW='xl' spacing='6' alignItems='baseline' mx='auto'>
        <Card px='10' py='10'>
          <Stack spacing='5'>
            <Stack spacing='1'>
              <Heading
                as='h1'
                size='sm'
                fontWeight='extrabold'
                lineHeight='1.5'
                letterSpacing='tight'
                color={mode('base.900', 'light.900')}
              >
                DAO {''}
                <Text
                  as='span'
                  maxW='xl'
                  mx='auto'
                  color={mode('base.300', 'base.400')}
                >
                  Dashboard
                </Text>
              </Heading>
            </Stack>
            <Text
              fontSize='md'
              maxW='xl'
              mx='auto'
              color={mode('base.400', 'base.300')}
            >
              You probably haven&#39;t heard of them iPhone succulents wayfarers
              austin yr shaman microdosing copper mug narwhal venmo raclette
              deep v.
            </Text>
          </Stack>
        </Card>
        <motion.div
          variants={SLIDE_UP_BUTTON_VARIANTS}
          initial={SLIDE_UP_BUTTON_VARIANTS.hidden}
          animate={SLIDE_UP_BUTTON_VARIANTS.enter}
          exit={SLIDE_UP_BUTTON_VARIANTS.exit}
          transition={{ duration: 0.75, type: 'linear' }}
        >
          <HStack width='full' mt='5' justifyContent='space-between'>
            <Text
              as='a'
              size='xs'
              fontWeight='regular'
              color='base.500'
              verticalAlign='baseline'
              textDecoration='underline'
              cursor='pointer'
              onClick={handlePrevious}
            >
              Back
            </Text>
            <ContractDeployButton
              contractName='stacker-dao'
              codeBody={daoCore}
            />
          </HStack>
        </motion.div>
      </Box>
    </motion.div>
  );
};

Ready.getLayout = (page: any) => (
  <LaunchCommunityLayout>{page}</LaunchCommunityLayout>
);

export default Ready;

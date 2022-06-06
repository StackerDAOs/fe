import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  Button,
  FormControl,
  Flex,
  Heading,
  HStack,
  VStack,
  Icon,
  Input,
  Stack,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Helpers
import { findIndex, split } from 'lodash';

// Utils
import { paths } from '@utils/data';

// Store
import { useStore } from 'store/CreateDaoStore';
import { useStore as useCommunityStepStore } from 'store/CommunityStepStore';

// Animations
import { motion } from 'framer-motion';

// Icons
import { FaCheckCircle } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';

// Components
import { Card } from '@components/Card';
import { LaunchCommunityLayout } from '@components/LaunchCommunityLayout';

const GetStarted = () => {
  const { name, handleInputChange } = useStore();
  const { maxSteps, currentStep, setStep } = useCommunityStepStore();
  const urlPath = split(name, ' ').join('-');
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

  function handleNext() {
    if (currentStep + 1 < maxSteps) {
      setStep(currentStep + 1);
    }
    const { nextPath } = paths[findIndex(paths, { path: router.pathname })];
    router.push(nextPath);
  }

  return (
    <motion.div
      variants={SLIDE_UP_VARIANTS}
      initial={SLIDE_UP_VARIANTS.hidden}
      animate={SLIDE_UP_VARIANTS.enter}
      exit={SLIDE_UP_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <SimpleGrid as={Flex} columns={2} spacing={10} alignItems='center'>
        <Box maxW='xl' spacing='3' alignItems='baseline'>
          <VStack align='left'>
            <HStack maxW='xl' spacing='3' alignItems='baseline'>
              <Box
                w='45px'
                h='45px'
                borderRadius='50%'
                bgGradient='linear(to-l, secondaryGradient.900, secondary.900)'
              />
              <Heading
                size='lg'
                pb='3'
                fontWeight='semibold'
                color={mode('base.900', 'light.900')}
              >
                {name || 'StackerDAO'}
              </Heading>
            </HStack>
            <Text
              fontSize='md'
              fontWeight='semibold'
              maxW='xl'
              mx='auto'
              bg='base.900'
              color={mode('base.900', 'light.900')}
              bgGradient={'linear(to-br, secondary.900, secondaryGradient.900)'}
              bgClip='text'
            >
              <Icon as={FaLock} color='base.600' mr='2' fontSize='md' />
              {`app.stackerdaos.com/communities/${urlPath || 'Stacker-DAO'}`}
            </Text>
          </VStack>
        </Box>
        <Box>
          <HStack justify='center' mb='5'>
            <Badge variant='subtle' colorScheme={'green'} px='3' py='2'>
              <HStack spacing='2'>
                <Icon as={FaCheckCircle} />
                <Text>Name available</Text>
              </HStack>
            </Badge>
          </HStack>
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
                  Name {''}
                  <Text
                    as='span'
                    maxW='xl'
                    mx='auto'
                    color={mode('base.300', 'base.400')}
                  >
                    your StackerDAO
                  </Text>
                </Heading>
              </Stack>
              <FormControl maxW={{ base: 'md', md: 'lg' }}>
                <Input
                  name='name'
                  autoComplete='off'
                  value={name}
                  size='lg'
                  placeholder='StackerDAO'
                  bg={mode('light.900', 'base.900')}
                  color={mode('base.900', 'light.900')}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Text
                fontSize='md'
                maxW='xl'
                mx='auto'
                color={mode('base.400', 'base.300')}
              >
                Choose an easily recognizable name for your StackerDAO. This
                will not be stored on-chain and can be updated later in your
                settings.
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
            <HStack width='full' mt='5' justifyContent='flex-end'>
              <Button
                type='submit'
                color='white'
                bgGradient={mode(
                  'linear(to-br, secondaryGradient.900, secondary.900)',
                  'linear(to-br, primaryGradient.900, primary.900)',
                )}
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
                onClick={handleNext}
              >
                Next
              </Button>
            </HStack>
          </motion.div>
        </Box>
      </SimpleGrid>
    </motion.div>
  );
};

GetStarted.getLayout = (page: any) => (
  <LaunchCommunityLayout>{page}</LaunchCommunityLayout>
);

export default GetStarted;

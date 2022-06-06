import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Circle,
  Flex,
  FormControl,
  Heading,
  Input,
  HStack,
  VStack,
  Stack,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Helpers
import { findIndex } from 'lodash';

// Utils
import { paths, whitelistAssets } from '@utils/data';
import { truncate } from '@common/helpers';

// Store
import { useStore } from 'store/CreateDaoStore';
import { useStore as useCommunityStepStore } from 'store/CommunityStepStore';

// Animations
import { motion } from 'framer-motion';

// Components
import { Card } from '@components/Card';
import { LaunchCommunityLayout } from '@components/LaunchCommunityLayout';
import { CheckboxCard, CheckboxCardGroup } from '@components/CheckboxCardGroup';

const SetupVault = () => {
  const { name, vaultExtension, addAsset, handleNestedInputChange } =
    useStore();
  const { maxSteps, currentStep, setStep } = useCommunityStepStore();
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
      <SimpleGrid as={Flex} columns={2} spacing={10} alignItems='center'>
        <Box maxW='xl' spacing='6' alignItems='baseline'>
          <VStack align='left'>
            <HStack maxW='xl' spacing='2' alignItems='flex-start'>
              <Circle
                w='35px'
                h='35px'
                borderRadius='25%'
                mt='0.5'
                fontWeight='bold'
                bgGradient='linear(to-l, secondaryGradient.900, secondary.900)'
              >
                3
              </Circle>
              <Heading
                size='md'
                pb='3'
                fontWeight='semibold'
                color={mode('base.900', 'light.900')}
              >
                Whitelist {''}
                <Text
                  as='span'
                  mt='4'
                  maxW='xl'
                  mx='auto'
                  color={mode('base.900', 'light.900')}
                  bgGradient={
                    'linear(to-br, secondary.900, secondaryGradient.900)'
                  }
                  bgClip='text'
                >
                  Assets
                </Text>
              </Heading>
            </HStack>
            <Text
              fontSize='md'
              fontWeight='semibold'
              maxW='md'
              mx='auto'
              pb='3'
              color={mode('base.900', 'light.900')}
            >
              Choose from a few assets you would like {name || 'StackerDAO'}{' '}
              <Text
                as='span'
                mt='4'
                maxW='xl'
                mx='auto'
                color={mode('base.900', 'light.900')}
                bgGradient={
                  'linear(to-br, secondary.900, secondaryGradient.900)'
                }
                bgClip='text'
              >
                to hold securely
              </Text>{' '}
              in your vault.
            </Text>
            <CheckboxCardGroup
              defaultValue={vaultExtension.whiteListedAddresses}
              spacing='3'
              maxW='md'
            >
              {whitelistAssets.map((option) => (
                <CheckboxCard
                  key={option.symbol}
                  value={option.contractAddress}
                >
                  <Text color='emphasized' fontWeight='medium' fontSize='md'>
                    {option.asset}
                  </Text>
                  <Text color='base.200' fontSize='md'>
                    {truncate(option.contractAddress, 10, 20)}
                  </Text>
                </CheckboxCard>
              ))}
            </CheckboxCardGroup>
          </VStack>
        </Box>
        <Box>
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
                  Vault {''}
                  <Text
                    as='span'
                    maxW='xl'
                    mx='auto'
                    color={mode('base.300', 'base.400')}
                  >
                    Management
                  </Text>
                </Heading>
              </Stack>
              <Text
                fontSize='md'
                maxW='xl'
                mx='auto'
                color={mode('base.400', 'base.300')}
              >
                This is where all your assets will live. Feel free to add tokens
                and/or NFT&#39;s that you would like to manage (e.g. SIP010,
                SIP009).
              </Text>
              <FormControl maxW={{ base: 'md', md: 'lg' }}>
                <Input
                  name='newAsset'
                  autoComplete='off'
                  value={vaultExtension.newAsset}
                  size='lg'
                  placeholder='Enter contract address'
                  bg={mode('light.900', 'base.900')}
                  color={mode('base.900', 'light.900')}
                  onChange={handleNestedInputChange}
                />
              </FormControl>
              <Button
                type='submit'
                color='white'
                bgGradient={mode(
                  'linear(to-br, secondaryGradient.900, secondary.900)',
                  'linear(to-br, primaryGradient.900, primary.900)',
                )}
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
                onClick={addAsset}
              >
                Add to whitelist
              </Button>
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

SetupVault.getLayout = (page: any) => (
  <LaunchCommunityLayout>{page}</LaunchCommunityLayout>
);

export default SetupVault;

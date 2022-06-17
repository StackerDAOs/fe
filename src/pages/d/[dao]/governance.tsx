import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Stack,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  InputRightAddon,
  Progress,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';

// Stacks
import { useCurrentStxAddress } from '@micro-stacks/react';
import {
  standardPrincipalCV,
  contractPrincipalCV,
  uintCV,
} from 'micro-stacks/clarity';

// Hooks
import {
  useOrganization,
  useVotingExtension,
  useGovernanceToken,
} from '@common/hooks';
import { useForm, Controller } from 'react-hook-form';

// Components
import { Card } from '@components/Card';
import { AppLayout } from '@components/Layout/AppLayout';
import { Header } from '@components/Header';
import { VaultActionPopover } from '@components/VaultActionPopover';

// Widgets
import { ContractCallButton } from '@widgets/ContractCallButton';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaCheck, FaTimes } from 'react-icons/fa';

// Utils
import {
  getPercentage,
  estimateDays,
  truncate,
  convertToken,
} from '@common/helpers';

const Governance = () => {
  const currentStxAddress = useCurrentStxAddress();
  const { register, control, handleSubmit, getValues } = useForm();
  const { delegateAddress } = getValues();
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { balance: userBalance } = useGovernanceToken({ organization });
  const { contractAddress, contractName } = useVotingExtension({
    organization,
  });

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  };

  const functionName = 'delegate';
  const functionArgs = delegateAddress
    ? [standardPrincipalCV(delegateAddress || currentStxAddress)]
    : [];
  const postConditions: any = [];

  const contractData = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  };

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Box as='section'>
        <Container maxW='5xl'>
          <Stack spacing={{ base: '8', lg: '6' }}>
            <Stack w='auto'>
              <Box as='section'>
                <Container>
                  <motion.div
                    variants={FADE_IN_VARIANTS}
                    initial={FADE_IN_VARIANTS.hidden}
                    animate={FADE_IN_VARIANTS.enter}
                    exit={FADE_IN_VARIANTS.exit}
                    transition={{ duration: 0.75, type: 'linear' }}
                  >
                    <Box as='section'>
                      <Stack spacing='5'>
                        <Stack
                          spacing='4'
                          my='6'
                          direction={{ base: 'column', md: 'row' }}
                          justify='space-between'
                          alignItems='center'
                          color='white'
                        >
                          <Box>
                            <Text fontSize='lg' fontWeight='medium'>
                              Delegation
                            </Text>
                            <Text color='gray.900' fontSize='sm'>
                              Manage token delegation
                            </Text>
                          </Box>
                        </Stack>
                      </Stack>
                      <Stack spacing={{ base: '8', lg: '6' }}>
                        <Stack w='auto' mb='10'>
                          <Card
                            bg='base.800'
                            border='1px solid'
                            borderColor='base.500'
                            maxW='xl'
                          >
                            <Box
                              py={{ base: '3', md: '3' }}
                              px={{ base: '6', md: '6' }}
                            >
                              <Stack spacing='2'>
                                <HStack spacing='2'>
                                  <Text color='light.900' fontWeight='regular'>
                                    Tokens:
                                  </Text>
                                  <Text color='light.900' fontWeight='regular'>
                                    {convertToken(userBalance, 2).toString()}{' '}
                                    <Text
                                      as='span'
                                      color='gray.900'
                                      fontWeight='medium'
                                    >
                                      MEGA
                                    </Text>
                                  </Text>
                                </HStack>
                                <HStack spacing='2' justify='space-between'>
                                  <Text
                                    fontSize='sm'
                                    fontWeight='medium'
                                    color='gray.900'
                                  >
                                    Delegated tokens
                                  </Text>
                                  <Text
                                    color='light.900'
                                    fontSize='sm'
                                    fontWeight='medium'
                                  >
                                    0{' '}
                                    <Text
                                      as='span'
                                      fontSize='sm'
                                      color='gray.900'
                                      fontWeight='medium'
                                    >
                                      MEGA
                                    </Text>
                                  </Text>
                                </HStack>
                              </Stack>
                            </Box>
                            <Divider borderColor='base.500' />
                            <Stack
                              spacing={{ base: '0', md: '1' }}
                              justify='center'
                              py={{ base: '3', md: '3' }}
                              px={{ base: '6', md: '6' }}
                            >
                              <Stack spacing='3'>
                                <HStack justify='flex-start'>
                                  <Text
                                    fontSize='sm'
                                    fontWeight='regular'
                                    color='light.900'
                                  >
                                    Delegate your voting power to someone by
                                    entering a BNS name or Stacks address below.
                                  </Text>
                                </HStack>
                                <form
                                  onSubmit={handleSubmit((data: any) =>
                                    console.log({ data }),
                                  )}
                                >
                                  <FormControl>
                                    <Controller
                                      control={control}
                                      name='delegateAddress'
                                      defaultValue={currentStxAddress}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <InputGroup size='md'>
                                          <Input
                                            name='delegateAddress'
                                            color='light.900'
                                            size='md'
                                            p='3'
                                            type='text'
                                            placeholder='SPKY981...'
                                            borderColor='base.500'
                                            onChange={onChange}
                                            _hover={{ borderColor: 'base.500' }}
                                            _focus={{
                                              borderColor: 'secondary.900',
                                            }}
                                          />
                                          <InputRightAddon
                                            width='6rem'
                                            color='light.900'
                                            bg='secondary.900'
                                            borderColor='secondary.900'
                                            border='1px solid'
                                          >
                                            <ContractCallButton
                                              title='Delegate'
                                              size='sm'
                                              color='light.900'
                                              bg='secondary.900'
                                              disabled={value?.length < 40}
                                              _disabled={{
                                                bg: 'secondary.900',
                                                opacity: 0.5,
                                                cursor: 'not-allowed',
                                                _hover: {
                                                  bg: 'secondary.900',
                                                  opacity: 0.5,
                                                  cursor: 'not-allowed',
                                                },
                                              }}
                                              _hover={{ bg: 'transparent' }}
                                              {...contractData}
                                            />
                                          </InputRightAddon>
                                        </InputGroup>
                                      )}
                                    />
                                  </FormControl>
                                </form>

                                <HStack justify='flex-start'>
                                  <Text
                                    fontSize='xs'
                                    fontWeight='regular'
                                    color='gray.900'
                                  >
                                    You will not transfer any tokens and you can
                                    revoke your delegation at any time.
                                  </Text>
                                </HStack>
                              </Stack>
                            </Stack>
                          </Card>
                        </Stack>
                      </Stack>
                    </Box>
                  </motion.div>
                </Container>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

Governance.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Governance;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  ButtonGroup,
  Container,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';

import { defaultTo } from 'lodash';

// Web3
import { useUser, useNetwork } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { standardPrincipalCV } from 'micro-stacks/clarity';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { Card } from '@components/Card';
import { DelegateButton } from '@components/Actions/DelegateButton';
import { Header } from '@components/Header';
import { SectionHeader } from '@components/SectionHeader';
import { Wrapper } from '@components/Wrapper';

import {
  useOrganization,
  useGovernanceToken,
  useVotingExtension,
} from '@common/hooks';

//  Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

// Icons
import { FaEllipsisH } from 'react-icons/fa';

// Utils
import { convertToken, truncate } from '@common/helpers';

const Governance = () => {
  const [state, setState] = useState<any>({
    isDelegating: false,
    currentDelegate: null,
    delegateAddress: '',
  });
  const router = useRouter();
  const { dao } = router.query as any;
  const { currentStxAddress } = useUser();
  const { network } = useNetwork();
  const { organization } = useOrganization({ name: dao });
  const { balance: userBalance, symbol } = useGovernanceToken({ organization });
  const { contractAddress, contractName } = useVotingExtension({
    organization,
  });
  const handleDelegateAddress = (e: any) => {
    setState({ ...state, delegateAddress: e.target.value });
  };

  const balance = defaultTo(userBalance, 0);
  const tokenBalance = defaultTo(convertToken(balance.toString(), 2), 0);

  useEffect(() => {
    const fetch = async () => {
      try {
        console.log({ currentStxAddress, contractAddress, contractName });
        const isDelegating: any = await fetchReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          senderAddress: currentStxAddress,
          functionArgs: [standardPrincipalCV(currentStxAddress || '')],
          functionName: 'is-delegating',
        });
        const currentDelegate: any = await fetchReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          senderAddress: currentStxAddress,
          functionArgs: [standardPrincipalCV(currentStxAddress || '')],
          functionName: 'get-delegate',
        });
        console.log({ isDelegating, currentDelegate });
        setState({
          ...state,
          isDelegating,
          currentDelegate: currentDelegate ?? null,
        });
      } catch (error) {
        console.error({ error });
      }
    };
    fetch();
  }, [organization, contractAddress, contractName, currentStxAddress]);

  console.log(state.delegateAddress.length < 40);

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Wrapper>
        <motion.div
          variants={FADE_IN_VARIANTS}
          initial={FADE_IN_VARIANTS.hidden}
          animate={FADE_IN_VARIANTS.enter}
          exit={FADE_IN_VARIANTS.exit}
          transition={{ duration: 0.75, type: 'linear' }}
        >
          <SectionHeader justify='space-between' align='center' color='white'>
            <Box>
              <Text fontSize='lg' fontWeight='medium'>
                Delegation
              </Text>
              <Text color='gray.900' fontSize='sm'>
                View and manage your current delegation status.
              </Text>
            </Box>
            <ButtonGroup bg='base.900' borderRadius='lg' p='1' spacing='2'>
              <Stack align='center' direction='row' spacing='3'>
                <IconButton
                  display='none'
                  aria-label='action-item'
                  bg='base.800'
                  variant='outline'
                  color='light.900'
                  borderColor='base.500'
                  size='md'
                  icon={
                    <Icon as={FaEllipsisH} color='whiteAlpha' fontSize='sm' />
                  }
                  _hover={{
                    bg: 'base.800',
                  }}
                />
                <IconButton
                  display='none'
                  aria-label='action-item'
                  bg='base.800'
                  variant='outline'
                  color='light.900'
                  borderColor='base.500'
                  size='md'
                  icon={
                    <Icon as={FaEllipsisH} color='whiteAlpha' fontSize='sm' />
                  }
                  _hover={{
                    bg: 'base.800',
                  }}
                />
              </Stack>
            </ButtonGroup>
          </SectionHeader>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 2 }}
            alignItems='flex-start'
            spacing='3'
          >
            <VStack
              align='left'
              spacing='3'
              direction={{ base: 'column', md: 'row' }}
              justify='space-between'
              color='white'
            >
              <Stack spacing='1'>
                <motion.div
                  variants={FADE_IN_VARIANTS}
                  initial={FADE_IN_VARIANTS.hidden}
                  animate={FADE_IN_VARIANTS.enter}
                  exit={FADE_IN_VARIANTS.exit}
                  transition={{ duration: 0.25, type: 'linear' }}
                >
                  <Stack spacing='3'>
                    <FormControl>
                      <Input
                        disabled={state.isDelegating ?? true}
                        color='light.900'
                        py='1'
                        px='2'
                        type='tel'
                        bg={state.isDelegating ? 'base.500' : 'base.900'}
                        border='none'
                        fontSize='md'
                        autoComplete='off'
                        placeholder='SP1T...'
                        value={
                          state.isDelegating
                            ? state.currentDelegate
                            : state.delegateAddress
                        }
                        onInput={handleDelegateAddress}
                        _focus={{
                          border: 'none',
                        }}
                      />
                    </FormControl>
                  </Stack>
                </motion.div>
              </Stack>
              <DelegateButton
                title={state.isDelegating ? 'Revoke' : 'Delegate'}
                contractAddress={contractAddress}
                contractName={contractName}
                functionName={
                  state.isDelegating ? 'revoke-delegation' : 'delegate'
                }
                delegateAddress={
                  state.isDelegating ? currentStxAddress : state.delegateAddress
                }
                isDisabled={
                  state.isDelegating
                    ? false
                    : state.delegateAddress.length < 40
                    ? true
                    : false
                }
              />
            </VStack>
            <Box as='section' display='flex' justifyContent='center'>
              <Container>
                <Card bg='base.900' border='1px solid' borderColor='base.500'>
                  <Box
                    py={{ base: '3', md: '3' }}
                    px={{ base: '6', md: '6' }}
                    bg='base.800'
                    borderTopLeftRadius='lg'
                    borderTopRightRadius='lg'
                    align='center'
                  >
                    <HStack justify='space-between'>
                      <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                        Status
                      </Text>
                      <Text fontSize='sm' color='gray.900' fontWeight='medium'>
                        {state.isDelegating ? 'Delegated' : 'Not Delegated'}
                      </Text>
                    </HStack>
                  </Box>

                  <Stack
                    spacing={{ base: '0', md: '1' }}
                    justify='center'
                    py={{ base: '3', md: '3' }}
                    px={{ base: '6', md: '6' }}
                  >
                    <Stack spacing='5'>
                      <HStack justify='space-between'>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          color='gray.900'
                        >
                          Delegated tokens
                        </Text>
                        {state.isDelegating ? (
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            {tokenBalance} {symbol}
                          </Text>
                        ) : (
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            0 {symbol}
                          </Text>
                        )}
                      </HStack>
                      <HStack justify='space-between'>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          color='gray.900'
                        >
                          Delegate
                        </Text>
                        {state.isDelegating ? (
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            {state.currentDelegate &&
                              truncate(state.currentDelegate, 4, 4)}
                          </Text>
                        ) : (
                          <Text
                            fontSize='sm'
                            fontWeight='medium'
                            color='light.900'
                          >
                            NA
                          </Text>
                        )}
                      </HStack>
                    </Stack>
                  </Stack>
                </Card>
              </Container>
            </Box>
          </SimpleGrid>
        </motion.div>
      </Wrapper>
    </motion.div>
  );
};

Governance.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Governance;

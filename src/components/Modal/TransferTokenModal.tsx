import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Web3
import { useNetwork } from '@micro-stacks/react';
import { fetchTransaction, fetchReadOnlyFunction } from 'micro-stacks/api';

// Hooks
import { useOrganization } from '@common/hooks';
import { useForm, Controller } from 'react-hook-form';
import { usePolling } from '@common/hooks';

// Components
import { Card } from '@components/Card';
import { TransferTokenButton } from '@components/Actions';
import { ProposeButton } from '@components/Actions/ProposeButton';

// Utils
import { truncate, formatComments } from '@common/helpers';
import Avatar from 'boring-avatars';

// Store
import { useStore } from 'store/TransactionStore';
import {
  Badge,
  Button,
  ButtonGroup,
  CloseButton,
  FormControl,
  HStack,
  Input,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';

import { FaArrowRight } from 'react-icons/fa';

export const TransferTokenModal = ({ contractAddress }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { network } = useNetwork();
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization }: any = useOrganization({ name: dao });
  const { transaction, setTransaction } = useStore();
  const [state, setState] = useState<any>({
    name: '',
    symbol: '',
    decimals: '',
    tokenUri: '',
    isDeployed: false,
  });
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm();
  const { transferAmount, transferTo, description } = getValues();

  useEffect(() => {
    setTransaction({ txId: '', data: {} });
    const fetchAssetData = async ({ contractAddress, contractName }: any) => {
      const senderAddress = `${contractAddress}.${contractName}`;
      const name = await fetchReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        senderAddress,
        functionArgs: [],
        functionName: 'get-name',
      });
      const symbol = await fetchReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        senderAddress,
        functionArgs: [],
        functionName: 'get-symbol',
      });
      const decimals = await fetchReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        senderAddress,
        functionArgs: [],
        functionName: 'get-decimals',
      });
      const tokenUri = await fetchReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        senderAddress,
        functionArgs: [],
        functionName: 'get-token-uri',
      });
      setState({ ...state, name, symbol, decimals, tokenUri });
      return {
        name,
        symbol,
        decimals,
        tokenUri,
      };
    };
    try {
      if (contractAddress) {
        fetchAssetData({
          contractAddress: contractAddress?.split('.')[0],
          contractName: contractAddress?.split('.')[1],
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [organization, isOpen]);

  const onSubmit = (data: any) => {
    console.log({ data });
    setState({ ...state, inReview: true });
  };

  usePolling(() => {
    fetchTransactionData(transaction?.txId);
  }, transaction.txId);

  async function fetchTransactionData(transactionId: string) {
    try {
      const transaction = await fetchTransaction({
        url: network.getCoreApiUrl(),
        txid: transactionId,
        event_offset: 0,
        event_limit: 0,
      });
      if (transaction?.tx_status === 'success') {
        setState({
          ...state,
          isDeployed: true,
          transactionId: transaction?.tx_id,
        });
        setTransaction({ txId: '', data: {} });
      }
      console.log({ transaction });
    } catch (e: any) {
      console.log({ e });
    }
  }

  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={<FaArrowRight />}
        size='sm'
        bg='base.800'
        border='1px solid'
        borderColor='base.500'
        aria-label='Transfer'
        _hover={{ bg: 'base.500' }}
      />
      <Modal
        blockScrollOnMount={true}
        isCentered
        closeOnOverlayClick={transaction?.txId ? false : true}
        isOpen={isOpen}
        onClose={onClose}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent
          bg='base.900'
          borderColor='base.500'
          borderWidth='1px'
          color='light.900'
          py='5'
          px='8'
        >
          <CloseButton
            onClick={onClose}
            color='gray.900'
            position='absolute'
            right='2'
            top='2'
          />
          {state.inReview ? (
            <>
              <Stack align='center' spacing='3'>
                <Avatar
                  size={45}
                  name='MDP Transfer STX'
                  variant='bauhaus'
                  colors={[
                    '#50DDC3',
                    '#624AF2',
                    '#EB00FF',
                    '#7301FA',
                    '#25C2A0',
                  ]}
                />
                <Text
                  fontSize='xl'
                  fontWeight='semibold'
                  color='light.900'
                  maxW='xs'
                >
                  MDP Transfer Tokens
                </Text>

                {transaction?.txId && !state.isDeployed && (
                  <HStack justify='center' my='3'>
                    <Badge
                      variant='subtle'
                      bg='base.800'
                      color='secondary.900'
                      px='4'
                      py='1'
                    >
                      <HStack spacing='2'>
                        <Spinner
                          size='xs'
                          color='secondary.900'
                          speed='0.75s'
                        />
                        <Text>Deploying contract</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                )}
              </Stack>
              <Stack
                spacing='6'
                m='6'
                direction={{ base: 'column', md: 'column' }}
                color='white'
              >
                <Card bg='base.900' border='1px solid' borderColor='base.500'>
                  <Stack
                    spacing='6'
                    my='0'
                    mx='3'
                    p='3'
                    direction={{ base: 'column', md: 'column' }}
                    justify='space-between'
                    color='white'
                  >
                    <Stack spacing='3'>
                      <Stack
                        spacing='1'
                        borderBottom='1px solid'
                        borderBottomColor='base.500'
                        py='2'
                        w='100%'
                      >
                        <Text
                          color='gray.900'
                          fontWeight='regular'
                          fontSize='sm'
                          mb={{ base: '10px', md: '0px' }}
                        >
                          Transferring
                        </Text>

                        <HStack>
                          <Avatar
                            size={15}
                            name={state.symbol}
                            variant='marble'
                            colors={[
                              '#50DDC3',
                              '#624AF2',
                              '#EB00FF',
                              '#7301FA',
                              '#25C2A0',
                            ]}
                          />

                          <Text
                            fontSize='md'
                            fontWeight='regular'
                            color='light.900'
                          >
                            {transferAmount} {state.symbol}
                          </Text>
                        </HStack>
                      </Stack>
                      <Stack
                        w='100%'
                        spacing='1'
                        py='2'
                        borderBottom='1px solid'
                        borderBottomColor='base.500'
                      >
                        <Text
                          color='gray.900'
                          fontSize='sm'
                          mb={{ base: '10px', md: '0px' }}
                        >
                          Destination
                        </Text>
                        <HStack>
                          <Avatar
                            size={15}
                            name={transferTo}
                            variant='beam'
                            colors={[
                              '#50DDC3',
                              '#624AF2',
                              '#EB00FF',
                              '#7301FA',
                              '#25C2A0',
                            ]}
                          />

                          <Text
                            fontSize='md'
                            fontWeight='regular'
                            color='light.900'
                          >
                            {transferTo && truncate(transferTo, 4, 4)}
                          </Text>
                        </HStack>
                      </Stack>
                      <Stack
                        spacing='1'
                        borderBottom='1px solid'
                        borderBottomColor='base.500'
                        py='2'
                        w='100%'
                      >
                        <Text
                          color='gray.900'
                          fontWeight='regular'
                          fontSize='sm'
                          mb={{ base: '10px', md: '0px' }}
                        >
                          Type
                        </Text>

                        <HStack>
                          <Avatar
                            size={15}
                            name='SDP Transfer Tokens'
                            variant='bauhaus'
                            colors={[
                              '#50DDC3',
                              '#624AF2',
                              '#EB00FF',
                              '#7301FA',
                              '#25C2A0',
                            ]}
                          />
                          <Text
                            fontSize='md'
                            fontWeight='regular'
                            color='light.900'
                          >
                            SDP Transfer Tokens
                          </Text>
                        </HStack>
                      </Stack>
                      <Stack w='100%' spacing='1' py='2'>
                        <Text
                          color='gray.900'
                          fontSize='sm'
                          mb={{ base: '10px', md: '0px' }}
                        >
                          Details
                        </Text>
                        <Text
                          fontSize='md'
                          fontWeight='regular'
                          color='light.900'
                        >
                          {description && truncate(description, 75, 0)}
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
                {/* <Card
                  bg='red.200'
                  border='1px solid'
                  borderColor='red.300'
                  color='red.900'
                >
                  <Stack
                    spacing='6'
                    my='0'
                    mx='3'
                    p='3'
                    direction={{ base: 'column', md: 'column' }}
                    justify='space-between'
                  >
                    <Stack spacing='5'>
                      <Stack spacing='1' py='2'>
                        <Text fontSize='sm' mb={{ base: '10px', md: '0px' }}>
                          Details
                        </Text>
                        <Text fontSize='md' fontWeight='regular'>
                          {description && truncate(description, 75, 0)}
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card> */}
                <ButtonGroup
                  spacing='3'
                  alignItems='space-between'
                  justifyContent='space-between'
                >
                  {/* <IconButton
                  onClick={() => setState({ ...state, inReview: false })}
                  icon={<FaArrowLeft />}
                  size='md'
                  bg='base.800'
                  border='1px solid'
                  borderColor='base.500'
                  aria-label='Transfer'
                  _hover={{ bg: 'base.500' }}
                /> */}

                  {state.isDeployed && (
                    <ProposeButton
                      organization={organization}
                      transactionId={state.transactionId}
                      _hover={{ opacity: 0.9 }}
                      _active={{ opacity: 1 }}
                    />
                  )}

                  {state.isDeployed || transaction?.txId ? null : (
                    <TransferTokenButton
                      organization={organization}
                      isSubmitting={isSubmitting}
                      description={description && formatComments(description)}
                      assetAddress={contractAddress}
                      tokenDecimals={Number(state?.decimals)}
                      transferAmount={transferAmount}
                      transferTo={transferTo}
                    />
                  )}
                </ButtonGroup>
              </Stack>
            </>
          ) : (
            <>
              <Stack
                spacing='1'
                bg='base.900'
                direction={{ base: 'column', md: 'row' }}
                align='center'
                justify='space-between'
                color='white'
                borderTopLeftRadius='lg'
                borderTopRightRadius='lg'
              >
                <Text fontSize='xl' fontWeight='semibold' color='light.900'>
                  Create Transfer Proposal
                </Text>
              </Stack>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack
                  spacing='6'
                  my='0'
                  direction={{ base: 'column', md: 'column' }}
                  justify='space-between'
                  color='white'
                >
                  <Stack spacing='5' my='3'>
                    <Stack
                      spacing='2'
                      py='2'
                      borderBottom='1px solid'
                      borderColor='base.500'
                    >
                      <Stack direction='column'>
                        <Text
                          fontSize='md'
                          fontWeight='regular'
                          color='gray.900'
                        >
                          Enter the amount of {state.symbol} that will be
                          transferred.
                        </Text>
                      </Stack>
                      <FormControl>
                        <Input
                          color='light.900'
                          py='1'
                          px='2'
                          pl='0'
                          type='tel'
                          bg='base.900'
                          border='none'
                          fontSize='md'
                          autoComplete='off'
                          placeholder='0'
                          {...register('transferAmount', {
                            required: 'This is required',
                          })}
                          _focus={{
                            border: 'none',
                          }}
                        />
                      </FormControl>
                      <HStack>
                        <Avatar
                          size={15}
                          name={state.symbol}
                          variant='marble'
                          colors={[
                            '#50DDC3',
                            '#624AF2',
                            '#EB00FF',
                            '#7301FA',
                            '#25C2A0',
                          ]}
                        />

                        <Text
                          fontSize='sm'
                          fontWeight='regular'
                          color='gray.900'
                        >
                          {state.symbol}
                        </Text>
                      </HStack>
                    </Stack>

                    <Stack
                      spacing='2'
                      py='2'
                      borderBottom='1px solid'
                      borderColor='base.500'
                    >
                      <Stack direction='column'>
                        <Text
                          fontSize='md'
                          fontWeight='regular'
                          color='gray.900'
                        >
                          Enter the address where the {state.symbol} will be
                          transferred.
                        </Text>
                      </Stack>
                      <FormControl>
                        <Controller
                          control={control}
                          name='transferTo'
                          render={({ field: { onChange, onBlur, value } }) => (
                            <>
                              <Input
                                color='light.900'
                                py='0'
                                px='2'
                                pl='0'
                                my='2'
                                type='tel'
                                bg='base.900'
                                border='none'
                                fontSize='md'
                                autoComplete='off'
                                placeholder='SP1T...'
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                                _focus={{
                                  border: 'none',
                                }}
                              />
                              <HStack>
                                <Avatar
                                  size={15}
                                  name={value}
                                  variant='beam'
                                  colors={[
                                    '#50DDC3',
                                    '#624AF2',
                                    '#EB00FF',
                                    '#7301FA',
                                    '#25C2A0',
                                  ]}
                                />

                                <Text
                                  fontSize='md'
                                  fontWeight='regular'
                                  color='gray.900'
                                >
                                  {value && truncate(value, 4, 4)}
                                </Text>
                              </HStack>
                            </>
                          )}
                        />
                      </FormControl>
                    </Stack>
                    <Stack
                      spacing='1'
                      borderBottom='1px solid'
                      borderBottomColor='base.500'
                    >
                      <Stack direction='column'>
                        <Text
                          fontSize='md'
                          fontWeight='regular'
                          color='gray.900'
                        >
                          Provide some additional context for the proposal.
                        </Text>
                      </Stack>
                      <FormControl>
                        <Textarea
                          type='text'
                          color='light.900'
                          fontSize='md'
                          py='1'
                          px='2'
                          pl='0'
                          bg='base.900'
                          border='none'
                          rows={8}
                          resize='none'
                          autoComplete='off'
                          placeholder='Transfers 100 STX to SP14...T78Y for...'
                          {...register('description', {
                            required: 'This is required',
                          })}
                          _focus={{
                            border: 'none',
                          }}
                        />
                      </FormControl>
                    </Stack>
                    <HStack width='full' justify='space-between'>
                      <Button
                        type='submit'
                        variant='outline'
                        borderColor='base.500'
                        isFullWidth
                        bg='base.900'
                        color='whiteAlpha'
                        _hover={{
                          bg: 'base.800',
                        }}
                      >
                        Submit & Review
                      </Button>
                    </HStack>
                  </Stack>
                </Stack>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

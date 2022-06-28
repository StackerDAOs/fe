import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Flex,
  FormControl,
  HStack,
  Image,
  InputGroup,
  InputRightAddon,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

// Components
import { Card } from '@components/Card';
import { DelegateButton } from '@components/Actions/DelegateButton';

// Web3
import { useNetwork, useUser } from '@micro-stacks/react';
import { fetchAccountStxBalance } from 'micro-stacks/api';
import { standardPrincipalCV } from 'micro-stacks/clarity';

// Hooks
import {
  useOrganization,
  useGovernanceToken,
  useVotingExtension,
} from '@common/hooks';
import { useForm, Controller } from 'react-hook-form';

// Utils
import { ustxToStx } from '@common/helpers';

export const DelegateCard = () => {
  const [state, setState] = useState<any>({ delegateAddress: '' });
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { decimals, symbol } = useGovernanceToken({ organization });
  const { contractAddress, contractName } = useVotingExtension({
    organization,
  });

  const handleDelegateAddress = (e: any) => {
    setState({ ...state, delegateAddress: e.target.value });
  };

  return (
    <Card bg='base.800' border='1px solid' borderColor='base.500'>
      <Flex
        direction='row'
        gap='6'
        align='center'
        py={{ base: '3', md: '3' }}
        px={{ base: '6', md: '6' }}
      >
        <HStack spacing='2'>
          <Text color='light.900' fontWeight='regular'>
            Delegated tokens:
          </Text>
          <Text color='light.900' fontWeight='regular'>
            0{' '}
            <Text as='span' color='gray.900' fontWeight='medium'>
              {symbol}
            </Text>
          </Text>
        </HStack>
        <Stack spacing='3' flex='1'>
          <InputGroup size='md'>
            <Input
              color='light.900'
              py='1'
              px='2'
              maxW='8em'
              type='tel'
              bg='base.900'
              border='none'
              fontSize='2xl'
              autoComplete='off'
              placeholder='0'
              value={state.delegateAddress}
              onChange={handleDelegateAddress}
              _focus={{
                border: 'none',
              }}
            />
            <InputRightAddon
              width='6rem'
              color='light.900'
              bg='secondary.900'
              borderColor='secondary.900'
              border='1px solid'
            >
              <DelegateButton
                contractAddress={contractAddress}
                contractName={contractName}
                delegateAddress={state.delegateAddress}
                bg='secondary.900'
                fontSize='md'
                size='md'
                disabled={state.delegateAddress?.length < 40}
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
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
              />
            </InputRightAddon>
          </InputGroup>
        </Stack>
      </Flex>
    </Card>
  );
};

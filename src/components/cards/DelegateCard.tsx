import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  FormControl,
  InputGroup,
  Input,
  Stack,
  VStack,
} from '@chakra-ui/react';

// Web3
import { useUser, useNetwork } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { standardPrincipalCV } from 'micro-stacks/clarity';

// Components
import { DelegateButton } from '@components/Actions/DelegateButton';

// Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

// Hooks
import { useOrganization, useVotingExtension } from '@common/hooks';

export const DelegateCard = () => {
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
  const { contractAddress, contractName } = useVotingExtension({
    organization,
  });

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
        const getDelegate: any = await fetchReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          senderAddress: currentStxAddress,
          functionArgs: [standardPrincipalCV(currentStxAddress || '')],
          functionName: 'get-delegate',
        });
        console.log({ isDelegating, getDelegate });
      } catch (error) {
        console.error({ error });
      }
    };
    fetch();
  }, [organization, contractAddress, contractName]);

  const handleDelegateAddress = (e: any) => {
    setState({ ...state, delegateAddress: e.target.value });
  };

  return (
    <VStack
      align='left'
      spacing='6'
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
          <Stack mt='2' spacing='3'>
            <FormControl>
              <Input
                color='light.900'
                py='1'
                px='2'
                type='tel'
                bg='base.900'
                border='none'
                fontSize='lg'
                autoComplete='off'
                placeholder='SP1T...'
                value={state.delegateAddress}
                onInput={handleDelegateAddress}
                _focus={{
                  border: 'none',
                }}
              />
            </FormControl>
          </Stack>
        </motion.div>
      </Stack>
      <InputGroup>
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
      </InputGroup>
    </VStack>
  );
};

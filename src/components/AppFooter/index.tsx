import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Icon,
  HStack,
  VStack,
  ModalBody,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Components
import { DepositButton, InitButton } from '@components/Actions';

// Components
import { DevToolModal } from '@components/Modal';

// Hooks
import { useBlocks } from '@common/hooks';

export const AppFooter = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [bootstrap, setBootstrap] = useState('');
  const { currentBlockHeight } = useBlocks();

  // INIT
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'executor-dao';
  // const functionName = 'init';

  // const functionArgs = [
  //   contractPrincipalCV(
  //     'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  //     'sdp-delegate-voting-dao',
  //   ),
  // ];
  // const postConditions: any = [];

  // DELEGATE
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'sde-governance-token-with-delegation';
  // const functionName = 'delegate';

  // const functionArgs = [
  //   standardPrincipalCV('STPJ2HPED2TMR1HAFBFA5VQF986CRD4ZWHH36F6X'),
  //   standardPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'),
  // ];
  // const postConditions: any = [];

  // REVOKE
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'sde-governance-token-with-delegation';
  // const functionName = 'revoke-delegation';

  // const functionArgs = [
  //   standardPrincipalCV('ST2ST2H80NP5C9SPR4ENJ1Z9CDM9PKAJVPYWPQZ50'),
  //   standardPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'),
  // ];
  // const postConditions: any = [];

  // PROPOSE
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'sde-proposal-submission-with-delegation';
  // const functionName = 'propose';

  // const functionArgs = [
  //   contractPrincipalCV(
  //     'STPJ2HPED2TMR1HAFBFA5VQF986CRD4ZWHH36F6X',
  //     'managing-coral-wallaby',
  //   ),
  //   uintCV(2230),
  //   contractPrincipalCV(
  //     'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  //     'sde-governance-token-with-delegation',
  //   ),
  // ];
  // const postConditions: any = [];

  // VOTE
  // const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  // const contractName = 'sde-proposal-voting-with-delegation';
  // const functionName = 'vote';
  // const postConditions: any = [];

  // const functionArgs = [
  //   boolCV(true),
  //   contractPrincipalCV(
  //     'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  //     'sdp-transfer-stx',
  //   ),
  //   contractPrincipalCV(
  //     'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  //     'sde-governance-token-with-delegation',
  //   ),
  // ];
  // const postConditions: any = [];

  return (
    <Box as='section'>
      <Box
        as='nav'
        position='fixed'
        bottom='0'
        py='5'
        px='9'
        w='100%'
        bg='transparent'
        zIndex='9999'
      >
        <HStack justify='space-between' flex='1'>
          <HStack spacing='2'>
            {process.env.NODE_ENV !== 'production' ? (
              <DevToolModal title='Dev Tools'>
                <ModalBody pb={6}>
                  <Stack spacing='3'>
                    <VStack spacing='2' align='flex-start'>
                      <FormControl>
                        <FormLabel>Proposal contract</FormLabel>
                        <Input
                          id='bootstrapContract'
                          bg='base.800'
                          borderColor='base.500'
                          autocomplete='off'
                          placeholder='ST...'
                          onInput={(e: any) => setBootstrap(e.target.value)}
                        />
                      </FormControl>
                      <InitButton address={bootstrap} />
                    </VStack>
                    <VStack spacing='2' align='flex-start'>
                      <FormControl>
                        <FormLabel>Amount</FormLabel>
                        <Input
                          id='depositAmount'
                          type='number'
                          bg='base.800'
                          borderColor='base.500'
                          autocomplete='off'
                          placeholder='100 STX'
                          onInput={(e: any) => setDepositAmount(e.target.value)}
                        />
                      </FormControl>
                      <DepositButton amount={depositAmount} />
                    </VStack>
                  </Stack>
                </ModalBody>
              </DevToolModal>
            ) : null}
          </HStack>
          <HStack
            cursor='default'
            spacing='1'
            color={mode('base.900', 'light.900')}
          >
            <Icon viewBox='0 0 200 200' color='secondary.900'>
              <path
                fill='currentColor'
                d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
              />
            </Icon>
            <Text color='gray.900' fontSize='sm'>
              Block height
              <Text as='span' color='light.900' ml='1'>
                {' '}
                {currentBlockHeight}
              </Text>
            </Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

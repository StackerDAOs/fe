import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
  ModalBody,
  Stack,
} from '@chakra-ui/react';

// Components
import { DepositButton, InitButton } from '@components/Actions';

// Components
import { DevToolModal } from '@components/Modal';

export const AppFooter = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [bootstrap, setBootstrap] = useState('');

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
        py='3'
        px='8'
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
                          autoComplete='off'
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
                          autoComplete='off'
                          placeholder='100 STX'
                          onInput={(e: any) => setDepositAmount(e.target.value)}
                        />
                      </FormControl>
                      <DepositButton title='Deposit' amount={depositAmount} />
                    </VStack>
                  </Stack>
                </ModalBody>
              </DevToolModal>
            ) : null}
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

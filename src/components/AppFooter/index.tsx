import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  Container,
  Icon,
  HStack,
  ModalBody,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Components
import { Card } from '@components/Card';
import { ContractCallButton } from '@widgets/ContractCallButton';

// Icons
import { FaEllipsisH } from 'react-icons/fa';

// Components
import { WalletConnectButton } from '@components/WalletConnectButton';
import { DevToolModal } from '@components/Modal';

// Web3
import { useUser, useAuth, useNetwork } from '@micro-stacks/react';
import { fetchNamesByAddress } from 'micro-stacks/api';
import {
  boolCV,
  uintCV,
  contractPrincipalCV,
  standardPrincipalCV,
} from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from 'micro-stacks/transactions';

// Utils
import { stxToUstx, truncate } from '@common/helpers';

// Hooks
import { useBlocks } from '@common/hooks';

export const AppFooter = () => {
  const { network } = useNetwork();
  const { currentStxAddress } = useUser();
  const { currentBlockHeight } = useBlocks();
  const NETWORK_CHAIN_ID: any = {
    1: 'Mainnet',
    2147483648: network.bnsLookupUrl?.includes('testnet')
      ? 'Testnet'
      : 'Devnet',
  };

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

  // INIT
  const initContractData = {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'executor-dao',
    functionName: 'init',
    functionArgs: [
      contractPrincipalCV(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'sdp-delegate-voting-dao',
      ),
    ],
    postConditions: [],
  };

  // DEPOSIT
  const depositContractData = {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'sde-vault',
    functionName: 'deposit',
    functionArgs: [uintCV(stxToUstx('285'))],
    postConditions: currentStxAddress
      ? [
          makeStandardSTXPostCondition(
            currentStxAddress || '', // Post condition address
            FungibleConditionCode.LessEqual, // Post condition code
            stxToUstx('285'), // Post condition amount
          ),
        ]
      : [],
  };

  return (
    <Box as='section' height='5vh'>
      <Box
        as='nav'
        position='fixed'
        bottom='0'
        p='3'
        px='9'
        w='100%'
        bg='base.900'
        zIndex='9999'
      >
        <HStack justify='space-between' flex='1'>
          <HStack spacing='2'>
            {process.env.NODE_ENV !== 'production' ? (
              <DevToolModal title='Dev Tools'>
                <ModalBody pb={6}>
                  <Stack spacing='3'>
                    <HStack>
                      <ContractCallButton
                        title='Initialize'
                        color='white'
                        size='sm'
                        {...initContractData}
                      />
                    </HStack>
                    <HStack>
                      <ContractCallButton
                        title='Depost'
                        color='white'
                        size='sm'
                        {...depositContractData}
                      />
                    </HStack>
                  </Stack>
                </ModalBody>
              </DevToolModal>
            ) : null}
          </HStack>
          <HStack
            cursor='default'
            spacing='2'
            color={mode('base.900', 'light.900')}
          >
            <>
              <Badge
                cursor='default'
                variant='subtle'
                bg='base.800'
                color='light.900'
                px='3'
                py='1'
              >
                <Text color='secondary.900' fontSize='xs' fontWeight='medium'>
                  {NETWORK_CHAIN_ID[network.chainId]}
                </Text>
              </Badge>
            </>
            <Icon viewBox='0 0 200 200' color='secondary.900'>
              <path
                fill='currentColor'
                d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
              />
            </Icon>
            <Text color='gray.900' fontSize='xs'>
              Block height
              <Text as='span' color='light.900'>
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

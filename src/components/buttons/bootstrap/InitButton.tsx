import React from 'react';
import { Button, Spinner } from '@chakra-ui/react';
import { useOpenContractCall } from '@micro-stacks/react';
import { contractPrincipalCV } from 'micro-stacks/clarity';
import {
  splitContractAddress,
  validateContractAddress,
} from '@stacks-os/utils';
import { BootstrapProps } from '../types';

export const InitButton = (props: BootstrapProps) => {
  const { openContractCall, isRequestPending } = useOpenContractCall();
  const [contractAddress, contractName] = splitContractAddress(
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mdp-megadao',
  );
  const init = async () => {
    if (
      validateContractAddress(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mdp-megadao',
      )
    ) {
      await openContractCall({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'mega-dao',
        functionName: 'init',
        functionArgs: [contractPrincipalCV(contractAddress, contractName)],
        postConditions: [],
        onFinish: () => {
          console.log('Finished');
        },
        onCancel: () => {
          console.log('Cancelled vote');
        },
      });
    }
  };

  return (
    <Button
      {...props}
      onClick={init}
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
    >
      {isRequestPending ? <Spinner /> : props?.title || 'Init'}
    </Button>
  );
};

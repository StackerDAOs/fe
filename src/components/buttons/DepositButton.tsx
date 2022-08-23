import React from 'react';
import { Button, Spinner } from '@chakra-ui/react';

// Web3
import { useAccount, useOpenContractCall } from '@micro-stacks/react';
import { uintCV } from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from 'micro-stacks/transactions';

// Utils
import { stxToUstx } from '@common/helpers';
import { vaultAddress } from '@common/constants';
import { splitContractAddress } from '@stacks-os/utils';
import { DepositProps } from './types';

export const DepositButton = (props: DepositProps) => {
  const { stxAddress } = useAccount();
  const { openContractCall, isRequestPending } = useOpenContractCall();
  const [contractAddress, contractName] = splitContractAddress(vaultAddress);

  const deposit = React.useCallback(async () => {
    await openContractCall({
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: 'deposit',
      functionArgs: [uintCV(stxToUstx(props?.amount))],
      postConditions: stxAddress
        ? [
            makeStandardSTXPostCondition(
              stxAddress, // Post condition address
              FungibleConditionCode.Equal, // Post condition code
              stxToUstx(props?.amount), // Post condition amount
            ),
          ]
        : [],
    });
  }, [contractAddress, contractName]);

  return (
    <Button
      {...props}
      onClick={deposit}
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
    >
      {isRequestPending ? <Spinner /> : props?.title || 'Init'}
    </Button>
  );
};

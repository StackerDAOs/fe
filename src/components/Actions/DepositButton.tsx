// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Web3
import { useUser } from '@micro-stacks/react';
import { uintCV } from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from 'micro-stacks/transactions';

// Utils
import { stxToUstx } from '@common/helpers';

export const DepositButton = ({ amount }: any) => {
  const { currentStxAddress } = useUser();

  // TODO: make calls to get vault address of organization
  const getDepositData = ({ amount }: any) => {
    if (amount) {
      return {
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'sde-vault',
        functionName: 'deposit',
        functionArgs: [uintCV(stxToUstx(amount))],
        postConditions: currentStxAddress
          ? [
              makeStandardSTXPostCondition(
                currentStxAddress || '', // Post condition address
                FungibleConditionCode.Equal, // Post condition code
                stxToUstx(amount), // Post condition amount
              ),
            ]
          : [],
      };
    }
  };

  return (
    <ContractCallButton
      title='Deposit'
      color='white'
      size='sm'
      {...getDepositData({ amount: amount })}
    />
  );
};

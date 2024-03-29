// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Web3
import { useAccount } from '@micro-stacks/react';
import { uintCV } from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from 'micro-stacks/transactions';

// Utils
import { stxToUstx } from '@common/helpers';
import { vaultAddress } from '@common/constants';

export const DepositButton = ({ title, amount }: any) => {
  const { stxAddress } = useAccount();

  // TODO: make calls to get vault address of organization
  const getDepositData = ({ amount }: any) => {
    if (amount) {
      return {
        contractAddress: vaultAddress.split('.')[0],
        contractName: vaultAddress.split('.')[1],
        functionName: 'deposit',
        functionArgs: [uintCV(stxToUstx(amount))],
        postConditions: stxAddress
          ? [
              makeStandardSTXPostCondition(
                stxAddress, // Post condition address
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
      title={!amount ? 'Enter an amount' : title}
      color='white'
      bg='base.800'
      size='sm'
      disabled={!amount}
      {...getDepositData({ amount: amount })}
    />
  );
};

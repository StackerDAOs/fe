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

export const DepositButton = ({ title, amount }: any) => {
  const { currentStxAddress } = useUser();

  // TODO: make calls to get vault address of organization
  const getDepositData = ({ amount }: any) => {
    if (amount) {
      return {
        contractAddress: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
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
      title={!amount ? 'Enter an amount' : title}
      color='white'
      bg='base.800'
      size='sm'
      disabled={!amount}
      {...getDepositData({ amount: amount })}
    />
  );
};

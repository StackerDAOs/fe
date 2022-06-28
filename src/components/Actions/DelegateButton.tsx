// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Web3
import { standardPrincipalCV } from 'micro-stacks/clarity';

export const DelegateButton = ({
  delegateAddress,
  contractAddress,
  contractName,
}: any) => {
  const isValid = delegateAddress && delegateAddress.length > 40; // TODO: validate for STX address
  const functionName = 'delegate';
  const functionArgs = delegateAddress &&
    isValid && [standardPrincipalCV(delegateAddress)];
  const postConditions: any = [];

  const contractData = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  };

  return (
    <ContractCallButton
      title='Delegate'
      color='white'
      bg='secondary.900'
      size='sm'
      isFullWidth
      {...contractData}
    />
  );
};

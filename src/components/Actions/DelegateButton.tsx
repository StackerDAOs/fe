// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Web3
import { standardPrincipalCV } from 'micro-stacks/clarity';

// Utils
import { validateStacksAddress } from '@common/helpers';

export const DelegateButton = ({
  title,
  delegateAddress,
  contractAddress,
  contractName,
  functionName,
  isDisabled,
}: any) => {
  const isValid = delegateAddress && validateStacksAddress(delegateAddress);
  const functionArgs = isValid && [standardPrincipalCV(delegateAddress)];
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
      title={title}
      color='white'
      bg='secondary.900'
      size='md'
      isFullWidth
      disabled={isDisabled}
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
      {...contractData}
    />
  );
};

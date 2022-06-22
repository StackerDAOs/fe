import { ContractCallButton } from '@widgets/ContractCallButton';

export const ConcludeProposalButton = ({
  contractAddress,
  contractName,
  functionName,
  functionArgs,
  postConditions,
}: any) => {
  const isPassing = true;
  const concludeProposal = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  };

  return (
    <ContractCallButton
      title={isPassing ? 'Execute' : 'Conclude'}
      color='white'
      bg='secondary.900'
      isFullWidth
      disabled={true}
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
      {...concludeProposal}
    />
  );
};

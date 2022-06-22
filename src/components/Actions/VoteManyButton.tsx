import { useCurrentStxAddress } from '@micro-stacks/react';
import {
  trueCV,
  falseCV,
  contractPrincipalCV,
  listCV,
  standardPrincipalCV,
  tupleCV,
  someCV,
  noneCV,
} from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeContractSTXPostCondition,
  makeContractFungiblePostCondition,
  createAssetInfo,
} from 'micro-stacks/transactions';
import { ContractCallButton } from '@widgets/ContractCallButton';

export const VoteManyButton = ({
  contractAddress,
  contractName,
  functionName,
  functionArgs,
  postConditions,
}: any) => {
  const isFor = true;
  const concludeProposal = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  };

  return (
    <ContractCallButton
      title={isFor ? 'Approve' : 'Reject'}
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

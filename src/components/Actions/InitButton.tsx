// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Web3
import { contractPrincipalCV } from 'micro-stacks/clarity';

export const InitButton = ({ address }: any) => {
  // TODO: make calls to get executor address of organization
  const getBootstrapProposal = ({ address }: any) => {
    const startsWith = process.env.NODE_ENV === 'development' ? 'ST' : 'SP';
    const isValid =
      address.startsWith(startsWith) &&
      address.length >= 45 &&
      address.includes('.'); // TODO: Find a better way to validate a STX address
    if (address && isValid) {
      return {
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'executor-dao',
        functionName: 'init',
        functionArgs: [
          contractPrincipalCV(address.split('.')[0], address.split('.')[1]),
        ],
        postConditions: [],
      };
    }
  };

  return (
    <ContractCallButton
      title='Deposit'
      color='white'
      size='sm'
      {...getBootstrapProposal({ address: address })}
    />
  );
};

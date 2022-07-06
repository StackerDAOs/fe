// Web3
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';

// Hooks
import { useBlocks } from '@common/hooks';

// Queries
import { useExtension } from '@common/queries';

// Components
import { ContractCard } from '@components/cards/ContractCard';

export const ContractCardList = ({ submissions }: any) => {
  const { extension: submission } = useExtension('Submission');
  const { extension: governance } = useExtension('Governance Token');
  const { currentBlockHeight } = useBlocks();
  const [contractAddress, contractName] =
    submission?.contractAddress.split('.');
  const [governanceContractAddress, governanceContractName] =
    governance?.contractAddress.split('.');

  const startHeight = currentBlockHeight + 315; // TODO: 30 needs to be dynamic startBlockHeight min
  return submissions?.map(
    (
      { type, contractAddress: proposalContractAddress }: any,
      index: number,
    ) => {
      const isLoading =
        proposalContractAddress &&
        governanceContractAddress &&
        governanceContractName;
      const contractData = isLoading && {
        contractAddress,
        contractName,
        functionName: 'propose',
        functionArgs: [
          contractPrincipalCV(
            proposalContractAddress.split('.')[0],
            proposalContractAddress.split('.')[1],
          ),
          uintCV(startHeight),
          contractPrincipalCV(
            governanceContractAddress,
            governanceContractName,
          ),
        ],
        postConditions: [],
      };
      return (
        <ContractCard
          key={index}
          type={type}
          proposalContractAddress={proposalContractAddress}
          contractData={contractData}
          _even={{
            bg: 'base.800',
            border: '1px solid',
            borderColor: 'base.500',
          }}
          _last={{ mb: '0' }}
        />
      );
    },
  );
};

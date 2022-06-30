import { useRouter } from 'next/router';

// Web3
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';

// Hooks
import {
  useGovernanceTokenExtension,
  useSubmissionExtension,
  useBlocks,
  useOrganization,
} from '@common/hooks';

// Components
import { ContractCard } from '@components/cards/ContractCard';

export const ContractCardList = ({ submissions }: any) => {
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { currentBlockHeight } = useBlocks();
  const {
    contractName: governanceContractName,
    contractAddress: governanceContractAddress,
  } = useGovernanceTokenExtension({ organization: organization });
  const { contractName, contractAddress } = useSubmissionExtension({
    organization: organization,
  });

  const startHeight = currentBlockHeight + 199; // TODO: 30 needs to be dynamic startBlockHeight min
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

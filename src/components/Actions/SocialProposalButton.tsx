// Web3
import { useUser } from '@micro-stacks/react';

// Components
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Utils
import { socialProposal } from '@utils/proposals/offchain';

// Queries
import { useGenerateName } from '@common/queries';

// Mutations
import { useAddProposal } from '@common/mutations/proposals';

export const SocialProposalButton = ({
  organization,
  description,
  closeOnDeploy,
}: any) => {
  const { currentStxAddress } = useUser();
  const { mutate: createProposal } = useAddProposal();
  const { data: contractName } = useGenerateName();

  const onFinishInsert: any = async (data: any) => {
    try {
      createProposal({
        organizationId: organization?.id,
        contractAddress: `${currentStxAddress}.${contractName}` || '',
        submittedBy: currentStxAddress || '',
        type: 'Social',
        transactionId: `0x${data.txId}`,
        name: contractName,
      });
      closeOnDeploy();
    } catch (e: any) {
      console.error({ e });
    }
  };

  const contract = socialProposal(contractName, description, currentStxAddress);

  return (
    <ContractDeployButton
      title='Deploy'
      color='white'
      bg='secondary.900'
      fontSize='md'
      size='md'
      flex='1'
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
      contractName={contractName}
      codeBody={contract}
      onFinish={onFinishInsert}
    />
  );
};

// Web3
import { useAccount } from '@micro-stacks/react';

// Components
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Utils
import { socialProposal } from '@utils/proposals/offchain';

// Queries
import { useGenerateName, useVotingExtension } from '@common/queries';

// Mutations
import { useAddProposal } from '@common/mutations/proposals';

export const SocialProposalButton = ({
  organization,
  description,
  closeOnDeploy,
}: any) => {
  const { stxAddress } = useAccount();
  const { mutate: createProposal } = useAddProposal();
  const { data: contractName } = useGenerateName();
  const { data: votingData } = useVotingExtension();

  const onFinishInsert: any = async (data: any) => {
    const executionDelay = Number(votingData?.executionDelay);
    try {
      createProposal({
        organizationId: organization?.id,
        contractAddress: `${stxAddress}.${contractName}`,
        proposer: stxAddress || '',
        type: 'Social',
        transactionId: `0x${data.txId}`,
        title: contractName,
        description,
        executionDelay,
        isVerified: true,
      });
      closeOnDeploy();
    } catch (e: any) {
      console.error({ e });
    }
  };

  const contract = socialProposal(contractName, description, stxAddress);

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

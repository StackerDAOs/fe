// Web3
import { useAccount } from '@micro-stacks/react';

// Components
import { ContractDeployButton } from '@widgets/ContractDeployButton';

/// Queries
import {
  useExtension,
  useVotingExtension,
  useGenerateName,
} from '@common/queries';

// Mutations
import { useAddProposal } from '@common/mutations/proposals';

// Utils
import { sendTokens } from '@utils/proposals/transfers';

export const TransferTokenButton = ({
  organization,
  description,
  assetAddress,
  assetName,
  tokenDecimals,
  transferAmount,
  transferTo,
  closeOnDeploy,
}: any) => {
  const { stxAddress } = useAccount();
  const { mutate: createProposal } = useAddProposal();
  const { data: contractName } = useGenerateName();
  const { extension: vault } = useExtension('Vault');
  const { data: votingData } = useVotingExtension();

  const onFinishInsert: any = async (data: any) => {
    const executionDelay = Number(votingData?.executionDelay);
    try {
      createProposal({
        organizationId: organization?.id,
        contractAddress: `${stxAddress}.${contractName}` || '',
        proposer: stxAddress || '',
        type: 'Transfer Token',
        transactionId: `0x${data.txId}`,
        title: contractName,
        description,
        postConditions: {
          from: vault?.contractAddress,
          assetAddress,
          assetName,
          amount: transferAmount,
        },
        executionDelay,
        isVerified: true,
      });
      closeOnDeploy();
    } catch (e: any) {
      console.error({ e });
    }
  };

  const contract = sendTokens(
    contractName,
    organization?.contractAddress?.split('.')[0],
    assetAddress,
    description,
    tokenDecimals,
    transferAmount,
    transferTo,
    stxAddress,
  );

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

// Web3
import { useAccount } from '@micro-stacks/react';

// Components
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Queries
import { useExtension, useGenerateName } from '@common/queries';

// Mutations
import { useAddProposal } from '@common/mutations/proposals';

// Utils
import { sendFunds } from '@utils/proposals/transfers';

export const TransferStxButton = ({
  organization,
  description,
  transferAmount,
  transferTo,
  closeOnDeploy,
}: any) => {
  const { stxAddress } = useAccount();
  const { mutate: createProposal } = useAddProposal();
  const { data: contractName } = useGenerateName();
  const { extension: vault } = useExtension('Vault');

  const onFinishInsert: any = async (data: any) => {
    try {
      createProposal({
        organizationId: organization?.id,
        contractAddress: `${stxAddress}.${contractName}` || '',
        submittedBy: stxAddress || '',
        type: 'Transfer STX',
        transactionId: `0x${data.txId}`,
        name: contractName,
        postConditions: {
          from: vault?.contractAddress,
          asset: 'STX',
          amount: transferAmount,
        },
      });
      closeOnDeploy();
    } catch (e: any) {
      console.error({ e });
    }
  };

  const contract = sendFunds(
    contractName,
    organization?.contractAddress?.split('.')[0],
    description,
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

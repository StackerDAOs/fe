// Web3
import { useUser } from '@micro-stacks/react';

// Components
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Queries
import { useGenerateName } from '@common/queries';

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
  const { currentStxAddress } = useUser();
  const { mutate: createProposal } = useAddProposal();
  const { data: contractName } = useGenerateName();

  const onFinishInsert: any = async (data: any) => {
    try {
      createProposal({
        organizationId: organization?.id,
        contractAddress: `${currentStxAddress}.${contractName}` || '',
        submittedBy: currentStxAddress || '',
        type: 'Transfer STX',
        transactionId: `0x${data.txId}`,
        name: contractName,
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
    currentStxAddress,
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

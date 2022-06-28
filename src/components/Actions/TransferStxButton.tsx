import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Web3
import { useUser } from '@micro-stacks/react';

// Hooks
import { useInsert } from 'react-supabase';
import { useRandomName } from '@common/hooks';

// Utils
import { sendFunds } from '@utils/proposals/transfers';

export const TransferStxButton = ({
  organization,
  description,
  transferAmount,
  transferTo,
}: any) => {
  const { currentStxAddress } = useUser();
  const generateContractName = useRandomName();
  const contractName = generateContractName();
  const [_, execute] = useInsert('Proposals');

  const insertProposals = async ({
    organizationId,
    contractAddress,
    submittedBy,
    type,
    transactionId,
  }: any) => {
    try {
      const vaultExtension = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === 'Vault',
      );
      const vaultAddress = vaultExtension?.contractAddress?.split('.')[0];
      const vaultName = vaultExtension?.contractAddress?.split('.')[1];
      const { error } = await execute({
        organizationId,
        contractAddress,
        submittedBy,
        type,
        transactionId,
        postConditions: {
          asset: 'STX',
          amount: transferAmount,
          from: `${vaultAddress}.${vaultName}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.log({ error });
    }
  };

  // TODO: type is not currently dynamic based on organization
  const onFinishInsert = async (data: any) => {
    console.info('Insert record into Proposals');
    await insertProposals({
      organizationId: organization?.id,
      contractAddress: `${currentStxAddress}.${contractName}` || '',
      submittedBy: currentStxAddress || '',
      type: 'MDP Transfer STX',
      transactionId: `0x${data.txId}`,
    });
  };

  const contract = sendFunds(
    organization?.contractAddress?.split('.')[0],
    description,
    transferAmount,
    transferTo,
    currentStxAddress,
  );

  return (
    <ContractDeployButton
      color='white'
      bg='secondary.900'
      fontSize='md'
      size='md'
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
      title='Deploy'
      contractName={contractName}
      codeBody={contract}
      onContractCall={onFinishInsert}
    />
  );
};

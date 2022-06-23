import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Web3
import { useUser } from '@micro-stacks/react';

// Hooks
import { useInsert } from 'react-supabase';
import { useRandomName } from '@common/hooks';

// Utils
import { offChain } from '@utils/proposals/offchain';

export const SurveyProposalButton = ({ organization, description }: any) => {
  const { currentStxAddress } = useUser();
  const generateContractName = useRandomName();
  const contractName = generateContractName();
  const [_, execute] = useInsert('Proposals');

  const insertProposals = async ({
    organizationId,
    contractAddress,
    submittedBy,
    type,
  }: any) => {
    try {
      const { error } = await execute({
        organizationId,
        contractAddress,
        submittedBy,
        type,
      });
      if (error) throw error;
    } catch (error) {
      console.log({ error });
    }
  };

  // TODO: type is not currently dynamic based on organization
  const onFinishInsert = async () => {
    console.info('Insert record into Proposals');
    await insertProposals({
      organizationId: organization?.id,
      contractAddress: `${currentStxAddress}.${contractName}` || '',
      submittedBy: currentStxAddress || '',
      type: 'MDP Survey Proposal',
      // postConditions: {
      //   amount: transferAmount,
      //   asset: 'STX',
      //   from: `${vaultContractAddress}.${vaultContractName}`,
      // },
    });
  };

  const contract = offChain(description, currentStxAddress);

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

import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabase';
// Web3
import { useUser } from '@micro-stacks/react';

// Components
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Hooks
import { useInsert } from 'react-supabase';

// Utils
import { sendFunds } from '@utils/proposals/transfers';

export const TransferStxButton = ({
  organization,
  description,
  transferAmount,
  transferTo,
}: any) => {
  const [state, setState] = useState<any>({ contractName: '' });
  const { currentStxAddress } = useUser();

  const [_, execute] = useInsert('Proposals');

  useEffect(() => {
    const fetchContractName = async () => {
      try {
        const { data: Proposals, error } = await supabase
          .from('Proposals')
          .select('contractAddress, Organizations!inner(id, name, prefix)')
          .eq('Organizations.id', organization?.id);
        if (error) throw error;
        if (Proposals.length > 0) {
          const proposalSize = (Proposals.length + 1).toString();
          const [proposal] = Proposals;
          const targetLength = Proposals.length + 1 < 1000 ? 3 : 4;
          const contractName = `${
            proposal.Organizations.prefix
          }-${proposalSize.padStart(targetLength, '0')}`;
          setState({
            ...state,
            contractName,
          });
        } else {
          const contractName = `${organization?.prefix}-001`;
          setState({
            ...state,
            contractName,
          });
        }
      } catch (error) {
        console.log({ error });
      }
    };
    fetchContractName();
  }, [organization]);

  const insertProposals = async ({
    organizationId,
    contractAddress,
    submittedBy,
    type,
    transactionId,
    name,
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
        name,
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

  const onFinishInsert: any = async (data: any) => {
    try {
      const { data: Proposals, error } = await supabase
        .from('Proposals')
        .select('contractAddress, Organizations!inner(id, name, prefix)')
        .eq('Organizations.id', organization?.id);
      if (error) throw error;
      if (Proposals.length > 0) {
        const proposalSize = (Proposals?.length + 1).toString();
        const [proposal] = Proposals;
        const targetLength = Proposals?.length + 1 < 1000 ? 3 : 4;
        const contractName = `${
          proposal?.Organizations?.prefix
        }-${proposalSize.padStart(targetLength, '0')}`;
        await insertProposals({
          organizationId: organization?.id,
          contractAddress: `${currentStxAddress}.${contractName}` || '',
          submittedBy: currentStxAddress || '',
          type: 'Transfer STX',
          transactionId: `0x${data.txId}`,
          name: contractName,
        });
      } else {
        const contractName = `${organization?.prefix}-001`;
        await insertProposals({
          organizationId: organization?.id,
          contractAddress: `${currentStxAddress}.${contractName}` || '',
          submittedBy: currentStxAddress || '',
          type: 'Transfer STX',
          transactionId: `0x${data.txId}`,
          name: contractName,
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const contract = sendFunds(
    state.contractName,
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
      contractName={state.contractName}
      codeBody={contract}
      onContractCall={onFinishInsert}
    />
  );
};

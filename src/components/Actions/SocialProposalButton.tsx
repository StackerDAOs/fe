import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabase';
// Web3
import { useUser } from '@micro-stacks/react';

// Components
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Hooks
import { useInsert } from 'react-supabase';

// Utils
import { socialProposal } from '@utils/proposals/offchain';

export const SocialProposalButton = ({ organization, description }: any) => {
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
      } catch (e: any) {
        console.error({ e });
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
      const { data, error } = await execute({
        organizationId,
        contractAddress,
        submittedBy,
        type,
        transactionId,
        name,
      });
      console.log('deploying proposal', { data });
      if (error) throw error;
    } catch (e: any) {
      console.error({ e });
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
          type: 'Social',
          transactionId: `0x${data.txId}`,
          name: contractName,
        });
      } else {
        const contractName = `${organization?.prefix}-001`;
        await insertProposals({
          organizationId: organization?.id,
          contractAddress: `${currentStxAddress}.${contractName}` || '',
          submittedBy: currentStxAddress || '',
          type: 'Social',
          transactionId: `0x${data.txId}`,
          name: contractName,
        });
      }
    } catch (e: any) {
      console.error({ e });
    }
  };

  const contract = socialProposal(
    state.contractName,
    description,
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

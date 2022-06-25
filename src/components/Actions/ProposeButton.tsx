import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabase';

// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Web3
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';

// Hooks
import {
  useBlocks,
  useGovernanceTokenExtension,
  useSubmissionExtension,
} from '@common/hooks';
import { useUpdate } from 'react-supabase';

export const ProposeButton = ({ organization, transactionId }: any) => {
  const [state, setState] = useState<any>({ proposalContractAddress: null });
  const { currentBlockHeight } = useBlocks();
  const {
    contractName: governanceContractName,
    contractAddress: governanceContractAddress,
  } = useGovernanceTokenExtension({ organization: organization });
  const { contractName, contractAddress } = useSubmissionExtension({
    organization: organization,
  });

  const [_, execute] = useUpdate('Proposals');

  useEffect(() => {
    const fetchProposal = async (transactionId: string) => {
      try {
        const formattedTransactionId = transactionId.substring(2);
        const { data: Proposals, error } = await supabase
          .from('Proposals')
          .select('contractAddress')
          .eq('transactionId', formattedTransactionId);
        if (error) throw error;
        if (Proposals.length > 0) {
          const proposal = Proposals[0];
          setState({
            ...state,
            proposalContractAddress: proposal.contractAddress,
          });
        }
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
      }
    };
    fetchProposal(transactionId);
  }, [transactionId]);

  const { proposalContractAddress } = state;
  const onFinishUpdate = async (proposalContractAddress: string) => {
    try {
      const { error } = await execute({ submitted: true }, (q) =>
        q.eq('contractAddress', proposalContractAddress),
      );
      if (error) throw error;
    } catch (error) {
      console.log({ error });
    }
  };

  const startHeight = currentBlockHeight + 50; // TODO: 50 needs to be dynamic startBlockHeight min

  const isLoading =
    proposalContractAddress &&
    governanceContractAddress &&
    governanceContractName;
  const functionName = 'propose';
  const functionArgs = isLoading && [
    contractPrincipalCV(
      proposalContractAddress.split('.')[0],
      proposalContractAddress.split('.')[1],
    ),
    uintCV(startHeight),
    contractPrincipalCV(governanceContractAddress, governanceContractName),
  ];
  const postConditions: any = [];

  const contractData = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
  };

  return (
    <ContractCallButton
      title='Propose'
      color='white'
      bg='secondary.900'
      size='sm'
      isFullWidth
      onContractCall={() => onFinishUpdate(proposalContractAddress)}
      {...contractData}
    />
  );
};

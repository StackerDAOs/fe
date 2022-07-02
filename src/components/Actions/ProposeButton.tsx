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

  useEffect(() => {
    const fetchProposal = async (transactionId: string) => {
      try {
        const { data: Proposals, error } = await supabase
          .from('Proposals')
          .select('contractAddress')
          .eq('transactionId', transactionId);
        if (error) throw error;
        if (Proposals.length > 0) {
          const proposal = Proposals[0];
          setState({
            ...state,
            proposalContractAddress: proposal.contractAddress,
          });
        }
      } catch (e: any) {
        console.error({ e });
      }
    };
    fetchProposal(transactionId);
  }, [transactionId]);

  const { proposalContractAddress } = state;
  const onFinishUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('Proposals')
        .update({ submitted: true })
        .match({ contractAddress: proposalContractAddress });
      if (error) throw error;
      console.log({ data });
    } catch (e: any) {
      console.error({ e });
    }
  };

  const startHeight = currentBlockHeight + 315; // TODO: 50 needs to be dynamic startBlockHeight min

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
      size='md'
      isFullWidth
      onContractCall={onFinishUpdate}
      {...contractData}
    />
  );
};

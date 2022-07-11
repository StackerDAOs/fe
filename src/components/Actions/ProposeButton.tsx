import { useEffect } from 'react';
import { supabase } from '@utils/supabase';

// Components
import { ContractCallButton } from '@widgets/ContractCallButton';

// Web3
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';

// Hooks
import { useBlocks } from '@common/hooks';

// Queries
import { useExtension } from '@common/queries';

export const ProposeButton = ({ proposalContractAddress }: any) => {
  const { currentBlockHeight } = useBlocks();
  const { extension: governance } = useExtension('Governance Token');
  const { extension: submission } = useExtension('Submission');

  const contractAddress = submission?.contractAddress?.split('.')[0];
  const contractName = submission?.contractAddress?.split('.')[1];

  const governanceContractAddress = governance?.contractAddress?.split('.')[0];
  const governanceContractName = governance?.contractAddress?.split('.')[1];

  useEffect(() => {
    console.log('rendered');
  }, [proposalContractAddress]);

  const onFinishUpdate = async (contractAddress: string) => {
    try {
      console.log('onFinishUpdate', { contractAddress });
      const { data, error } = await supabase
        .from('Proposals')
        .update({ submitted: true })
        .match({
          contractAddress: contractAddress,
        });
      if (error) throw error;
      console.log({ data });
    } catch (e: any) {
      console.error({ e });
    }
  };

  const startHeight = currentBlockHeight + 350; // TODO: 50 needs to be dynamic startBlockHeight min

  const functionName = 'propose';
  const functionArgs = proposalContractAddress && [
    contractPrincipalCV(
      proposalContractAddress?.split('.')[0],
      proposalContractAddress?.split('.')[1],
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
      onContractCall={() => onFinishUpdate(proposalContractAddress)}
      {...contractData}
    />
  );
};

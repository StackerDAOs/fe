import React from 'react';
import { Button, Spinner } from '@chakra-ui/react';
import { useAccount, useOpenContractDeploy } from '@micro-stacks/react';
import { socialProposal } from '@utils/proposals/offchain';
import { useDAO, useGenerateName, useVotingExtension } from '@lib/hooks';
import { useAddProposal } from '@lib/mutations/proposals';
import { DeployProposalProps } from '../types';

interface SocialProposalProps extends DeployProposalProps {
  proposalType: string;
  closeOnDeploy: () => void;
}

export const DeployProposalButton = (props: SocialProposalProps) => {
  const { data: dao } = useDAO();
  const { openContractDeploy, isRequestPending } = useOpenContractDeploy();
  const { stxAddress } = useAccount();
  const createProposal = useAddProposal();
  const { data: contractName }: any = useGenerateName();
  const { data: votingData }: any = useVotingExtension();

  const deploySocialProposal = React.useCallback(async () => {
    const onFinish: any = async (data: any) => {
      const executionDelay = Number(votingData?.executionDelay);
      try {
        createProposal.mutate({
          organizationId: dao?.id,
          contractAddress: `${stxAddress}.${contractName}`,
          proposer: stxAddress || '',
          type: props?.proposalType,
          transactionId: `0x${data.txId}`,
          title: contractName,
          description: props?.description,
          executionDelay,
          isVerified: true,
        });
        props?.closeOnDeploy ?? props.closeOnDeploy();
      } catch (e: any) {
        console.error({ e });
      }
    };

    const codeBody = (type: string) => {
      switch (type) {
        case 'Social':
          return socialProposal(contractName, props?.description, stxAddress);
        case 'Transfer STX':
          return '';
        case 'Transfer Tokens':
          return '';
        default:
          return '';
      }
    };

    await openContractDeploy({
      contractName,
      codeBody: codeBody(props?.proposalType),
      onFinish,
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  }, [contractName]);

  return (
    <Button
      {...props}
      onClick={deploySocialProposal}
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
    >
      {isRequestPending ? <Spinner /> : props?.title || 'Deploy'}
    </Button>
  );
};

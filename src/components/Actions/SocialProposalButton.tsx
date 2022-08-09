import React from 'react';
import type { ButtonProps } from '@chakra-ui/react';
import { Button, Spinner } from '@chakra-ui/react';

import { useAccount, useOpenContractDeploy } from '@micro-stacks/react';
import { socialProposal } from '@utils/proposals/offchain';
import { useGenerateName, useVotingExtension } from '@common/hooks';
import { useAddProposal } from '@common/mutations/proposals';

type TDeployButtonProps = ButtonProps & {
  title: string;
  organization: any;
  description: string;
  closeOnDeploy: () => void;
};

export const SocialProposalButton = (props: TDeployButtonProps) => {
  const { openContractDeploy, isRequestPending } = useOpenContractDeploy();
  const { stxAddress } = useAccount();
  const createProposal = useAddProposal();
  const { data: contractName } = useGenerateName();
  const { data: delay } = useVotingExtension();

  const codeBody = socialProposal(contractName, props?.description, stxAddress);

  const deploySocialProposal = React.useCallback(async () => {
    const onFinish: any = async (data: any) => {
      const executionDelay = Number(delay);
      try {
        createProposal.mutate({
          organizationId: props?.organization?.id,
          contractAddress: `${stxAddress}.${contractName}`,
          proposer: stxAddress || '',
          type: 'Social',
          transactionId: `0x${data.txId}`,
          title: contractName,
          description: props?.description,
          executionDelay,
          isVerified: true,
        });
        props?.closeOnDeploy();
      } catch (e: any) {
        console.error({ e });
      }
    };

    await openContractDeploy({
      contractName,
      codeBody,
      onFinish,
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  }, [contractName, codeBody]);

  return (
    <Button
      onClick={deploySocialProposal}
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
    >
      {isRequestPending ? <Spinner /> : props?.title || 'Deploy'}
    </Button>
  );
};

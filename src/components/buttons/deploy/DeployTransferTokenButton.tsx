import React from 'react';
import { Button, Spinner } from '@chakra-ui/react';
import { useAccount, useOpenContractDeploy } from '@micro-stacks/react';
import { useExtension, useVotingExtension, useGenerateName } from '@lib/hooks';
import { useAddProposal } from '@lib/mutations/proposals';
import { sendTokens } from '@utils/proposals/transfers';
import { DeployProposalProps } from '../types';

interface TransferProposalProps extends DeployProposalProps {
  transferAmount: string;
  transferTo: string;
  assetAddress: string;
  assetName: string;
  tokenDecimals: string;
  closeOnDeploy: () => void;
}

export const DeployTransferTokenButton = (props: TransferProposalProps) => {
  const { stxAddress } = useAccount();
  const { openContractDeploy, isRequestPending } = useOpenContractDeploy();
  const { mutate: createProposal } = useAddProposal();
  const { data: contractName } = useGenerateName();
  const { data: vault } = useExtension('Vault');
  const { data: delay } = useVotingExtension();

  const codeBody = sendTokens(
    contractName,
    props?.organization?.contractAddress?.split('.')[0],
    props?.assetAddress,
    props?.description,
    props?.tokenDecimals,
    props?.transferAmount,
    props?.transferTo,
    stxAddress,
  );

  const deployTransferToken = React.useCallback(async () => {
    const onFinish: any = async (data: any) => {
      const executionDelay = Number(delay);
      try {
        createProposal({
          organizationId: props?.organization?.id,
          contractAddress: `${stxAddress}.${contractName}` || '',
          proposer: stxAddress || '',
          type: 'Transfer Token',
          transactionId: `0x${data.txId}`,
          title: contractName,
          description: props?.description,
          postConditions: {
            from: vault?.contractAddress,
            assetAddress: props?.assetAddress,
            assetName: props?.assetName,
            amount: props?.transferAmount,
          },
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
      onClick={deployTransferToken}
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
    >
      {isRequestPending ? <Spinner /> : props?.title || 'Deploy'}
    </Button>
  );
};

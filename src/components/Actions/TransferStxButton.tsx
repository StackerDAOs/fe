import { useRouter } from 'next/router';
// Components
import { ContractDeployButton } from '@widgets/ContractDeployButton';

// Web3
import { useUser } from '@micro-stacks/react';
import { uintCV } from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from 'micro-stacks/transactions';

// Hooks
import { useOrganization } from '@common/hooks';
import { useInsert } from 'react-supabase';
import { useRandomName } from '@common/hooks';

// Utils
import { stxToUstx } from '@common/helpers';
import { sendFunds } from '@utils/proposals/transfers';

export const TransferStxButton = ({
  description,
  transferAmount,
  transferTo,
}: any) => {
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization }: any = useOrganization({ name: dao });
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
      const { count, data, error } = await execute({
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

  const onFinishInsert = async () => {
    console.log('onFinishInsert');
    await insertProposals({
      organizationId: organization?.id,
      contractAddress: `${currentStxAddress}.${contractName}` || '',
      submittedBy: currentStxAddress || '',
      type: 'SDP Transfer STX',
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

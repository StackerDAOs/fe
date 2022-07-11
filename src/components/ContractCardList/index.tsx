import { Stack } from '@chakra-ui/react';

// Web3
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';

// Hooks
import { useBlocks } from '@common/hooks';

// Queries
import { useExtension, useContracts } from '@common/queries';

// Components
import { ContractCard } from '@components/cards/ContractCard';
import { EmptyState } from '@components/EmptyState';

// Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

const MotionStack = motion(Stack);
const MotionContractCard = motion(ContractCard);

export const ContractCardList = () => {
  const { extension: submission } = useExtension('Submission');
  const { extension: governance } = useExtension('Governance Token');
  const {
    isLoading: isLoadingContracts,
    isFetching,
    isIdle,
    data: contracts,
  }: any = useContracts();
  const { currentBlockHeight } = useBlocks();
  const contractAddress = submission?.contractAddress.split('.')[0];
  const contractName = submission?.contractAddress.split('.')[1];
  const governanceContractAddress = governance?.contractAddress.split('.')[0];
  const governanceContractName = governance?.contractAddress.split('.')[1];
  const startHeight = currentBlockHeight + 300;

  if (isLoadingContracts) {
    return <div>Loading...</div>;
  }

  if (isFetching || isIdle) {
    return null;
  }

  if (contracts?.length === 0) {
    return <EmptyState heading='No action items found' />;
  }

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <MotionStack
        variants={FADE_IN_VARIANTS}
        initial={FADE_IN_VARIANTS.hidden}
        animate={FADE_IN_VARIANTS.enter}
        exit={FADE_IN_VARIANTS.exit}
        transition={{ duration: 0.75, type: 'linear' }}
        spacing='3'
      >
        {contracts?.map(
          (
            {
              type,
              transactionId,
              contractAddress: proposalContractAddress,
            }: any,
            index: number,
          ) => {
            const isLoading =
              proposalContractAddress &&
              governanceContractAddress &&
              governanceContractName;
            const contractData = isLoading && {
              contractAddress,
              contractName,
              functionName: 'propose',
              functionArgs: [
                contractPrincipalCV(
                  proposalContractAddress.split('.')[0],
                  proposalContractAddress.split('.')[1],
                ),
                uintCV(startHeight),
                contractPrincipalCV(
                  governanceContractAddress,
                  governanceContractName,
                ),
              ],
              postConditions: [],
            };
            return (
              <MotionContractCard
                key={index}
                type={type}
                variants={{
                  hidden: { opacity: 0 },
                  enter: { opacity: 1 },
                }}
                transactionId={transactionId}
                proposalContractAddress={proposalContractAddress}
                contractData={contractData}
                _even={{
                  bg: 'base.800',
                  border: '1px solid',
                  borderColor: 'base.500',
                }}
                _last={{ mb: '0' }}
              />
            );
          },
        )}
      </MotionStack>
    </motion.div>
  );
};

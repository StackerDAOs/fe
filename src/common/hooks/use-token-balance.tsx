// Hook (use-token-balance.tsx)
import { useQuery } from 'react-query';
import { useExtension } from '@common/hooks';
import { useAccount } from '@micro-stacks/react';
import { getTokenBalance } from 'lib/api';

export function useTokenBalance() {
  const { stxAddress }: any = useAccount();
  const { data: governanceToken } = useExtension('Governance Token');

  const { isFetching, isIdle, isLoading, data } = useQuery(
    ['user-balance', `${governanceToken?.contractAddress}`],
    async () => {
      return await getTokenBalance(
        stxAddress,
        governanceToken?.contractAddress,
      );
    },
    {
      enabled: !!stxAddress && !!governanceToken?.contractAddress,
    },
  );

  return { isFetching, isIdle, isLoading, data };
}

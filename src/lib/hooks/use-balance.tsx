// Hook (use-balance.tsx)
import { useQuery } from 'react-query';
import { useExtension } from '@lib/hooks';
import { getBalanceOf } from '@lib/api';

export function useBalance(assetAddress: string) {
  const { data: vault } = useExtension('Vault');

  const { isFetching, isIdle, isLoading, data } = useQuery(
    ['vault-balance', vault?.contractAddress, assetAddress],
    async () => {
      return await getBalanceOf(vault?.contractAddress, assetAddress);
    },
    {
      enabled: !!assetAddress && !!vault?.contractAddress,
    },
  );

  return { isFetching, isIdle, isLoading, data };
}

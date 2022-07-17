// Hook (use-contract-source.tsx)
import { useQuery } from 'react-query';
import { getContractSourceCode } from '@common/api';

export function useContractSource(proposalPrincipal: string) {
  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['contract-source', proposalPrincipal],
    async () => {
      const data = await getContractSourceCode(proposalPrincipal);
      return data;
    },
    {
      enabled: !!proposalPrincipal,
      refetchOnWindowFocus: false,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

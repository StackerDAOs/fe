// Hook (use-post-conditions.tsx)
import { useQuery } from 'react-query';
import { useDAO } from '@common/hooks';
import { getPostConditions } from 'lib/api';

export function usePostConditions(proposalPrincipal: string) {
  const { data: dao } = useDAO();

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['post-conditions', proposalPrincipal],
    async () => {
      return await getPostConditions(proposalPrincipal);
    },
    {
      enabled: !!dao && !!proposalPrincipal,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

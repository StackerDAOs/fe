// Hook (use-proposals.tsx)
import { useQuery } from 'react-query';
import { useDAO } from '@common/hooks';
import { getDBProposals } from 'lib/api';

export function useProposals(filter = 'all') {
  const { data: dao } = useDAO();
  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['proposals', dao?.id, filter],
    getDBProposals,
    {
      enabled: !!dao,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

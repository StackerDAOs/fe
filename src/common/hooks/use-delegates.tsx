// Hook (use-delegates.tsx)
import { useQuery } from 'react-query';
import { useAccount } from '@micro-stacks/react';
import { useDAO } from '@common/hooks';
import { getDelegates } from 'lib/api';

export function useDelegates() {
  const { data: dao } = useDAO();
  const { stxAddress } = useAccount();

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['delegates', dao?.name, stxAddress],
    async () => {
      return await getDelegates(dao?.id, stxAddress);
    },
    {
      enabled: !!dao,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

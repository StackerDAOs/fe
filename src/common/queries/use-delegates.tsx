// Hook (use-contracts.tsx)
import { useQuery } from 'react-query';
import { useUser } from '@micro-stacks/react';
import { useDAO } from '@common/queries';
import { getDelegates } from '@common/api';

export function useDelegates() {
  const { dao } = useDAO();
  const { currentStxAddress }: any = useUser();

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['delegates', dao?.name, currentStxAddress],
    async () => {
      const data: any = await getDelegates(dao?.id, currentStxAddress);
      console.log({ data });
      return data;
    },
    {
      enabled: !!dao,
      refetchOnWindowFocus: false,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

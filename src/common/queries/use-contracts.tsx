// Hook (use-contracts.tsx)
import { useQuery } from 'react-query';
import { useUser } from '@micro-stacks/react';
import { useDAO } from '@common/queries';
import { getContractsToDeploy } from '@common/api';

export function useContracts() {
  const { dao } = useDAO();
  const { currentStxAddress }: any = useUser();

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    'contracts',
    async () => {
      const data: any = await getContractsToDeploy(dao?.id, currentStxAddress);
      return data;
    },
    {
      enabled: !!dao,
      refetchOnWindowFocus: false,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

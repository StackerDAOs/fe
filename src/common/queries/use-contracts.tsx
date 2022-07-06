// Hook (use-contracts.tsx)
import { useQuery } from 'react-query';
import { useDAO } from '@common/queries';
import { getContractsToDeploy } from '@common/api';

export function useContracts() {
  const { dao } = useDAO();

  const {
    isFetching,
    isIdle,
    isLoading,
    isError,
    data: contracts,
  } = useQuery(
    'contracts',
    async () => {
      const data = await getContractsToDeploy(dao?.id);
      return data;
    },
    {
      enabled: !!dao,
      refetchOnWindowFocus: false,
    },
  );

  return { isFetching, isIdle, isLoading, isError, contracts };
}

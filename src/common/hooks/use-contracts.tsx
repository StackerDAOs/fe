// Hook (use-contracts.tsx)
import { useQuery } from 'react-query';
import { useAccount } from '@micro-stacks/react';
import { useDAO } from '@common/hooks';
import { getContractsToDeploy } from 'lib/api';

export function useContracts() {
  const { data: dao } = useDAO();
  const { stxAddress }: any = useAccount();

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    'contracts',
    async () => {
      return await getContractsToDeploy(dao?.id, stxAddress);
    },
    {
      enabled: !!dao,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

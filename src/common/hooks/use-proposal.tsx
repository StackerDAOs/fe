// Hook (use-proposal.tsx)
import { useQuery } from 'react-query';
import { useExtension } from '@common/hooks';
import { getProposal } from 'lib/api';

export function useProposal(id: string) {
  const { data: voting } = useExtension('Voting');

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['proposal', id],
    async () => {
      return await getProposal(voting?.contractAddress, id);
    },
    {
      enabled: !!voting?.contractAddress,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

// Hook (use-proposal.tsx)
import { useQuery } from 'react-query';
import { useExtension } from '@lib/hooks';
import { getParameter } from '@lib/api';

export function useVotingExtension() {
  const { data: voting } = useExtension('Voting');

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['voting-extension', voting?.contractAddress],
    async () => {
      return await getParameter(voting?.contractAddress, 'executionDelay');
    },
    {
      enabled: !!voting,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

// Hook (use-proposal.tsx)
import { useQuery } from 'react-query';
import { useExtension } from '@common/queries';
import { getProposal } from '@common/api';

export function useProposal(proposalPrincipal: string) {
  const { extension: voting } = useExtension('Voting');

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['proposal', proposalPrincipal],
    async () => {
      const data = await getProposal(
        voting?.contractAddress,
        proposalPrincipal,
      );
      return data;
    },
    {
      enabled: !!voting?.contractAddress,
      refetchOnWindowFocus: false,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

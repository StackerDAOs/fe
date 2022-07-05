// Hook (use-proposal.tsx)
import { useQuery } from 'react-query';
import { useExtension } from '@common/queries';
import { getProposal } from '@common/api';

export function useProposal(id: string) {
  const { extension: voting } = useExtension('Voting');

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['proposal', id],
    async () => {
      const contractAddress = voting?.contractAddress.split('.')[0];
      const contractName = voting?.contractAddress.split('.')[1];
      const data = await getProposal(`${contractAddress}.${contractName}`, id);
      return data;
    },
    {
      enabled: !!voting?.contractAddress,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

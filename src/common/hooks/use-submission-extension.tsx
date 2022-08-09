// Hook (use-submission-extension.tsx)
import { useQuery } from 'react-query';
import { useExtension } from '@common/hooks';
import { getParameter } from 'lib/api';

export function useSubmissionExtension() {
  const { data: submission } = useExtension('Submission');

  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['submission-extension', submission?.contractAddress],
    async () => {
      const minimumProposalStartDelay: any = await getParameter(
        submission?.contractAddress,
        'minimumProposalStartDelay',
      );
      const proposalDuration: any = await getParameter(
        submission?.contractAddress,
        'proposalDuration',
      );
      return { minimumProposalStartDelay, proposalDuration };
    },
    {
      enabled: !!submission,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

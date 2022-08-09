// Hook (use-events.tsx)
import { useQuery } from 'react-query';
import { getEvents } from 'lib/api';

export function useEvents(
  extensionAddress: string,
  eventName: string | undefined,
  filterByProposal: string | undefined,
  offset: number,
) {
  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    `events-${extensionAddress}-${eventName}`,
    async () => {
      return await getEvents({
        extensionAddress,
        eventName,
        filterByProposal,
        offset,
      });
    },
    {
      enabled: !!extensionAddress,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

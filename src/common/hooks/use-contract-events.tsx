// Hook (use-contract-events.tsx)
import { useCallback, useEffect, useState } from 'react';
import { useNetwork } from '@micro-stacks/react';
import { fetchContractEventsById } from 'micro-stacks/api';
import { deserializeCV, cvToValue } from 'micro-stacks/clarity';

type TEvent = {
  isLoading: boolean;
  events: any[];
  eventSize: number;
};

interface IEvent {
  organization?: any;
  extensionName?: string;
  filter?: string;
  filterByProposal?: string;
  offset?: number;
}

const initialState = {
  isLoading: true,
  events: [],
  eventSize: 0,
};

export function useContractEvents({
  organization,
  extensionName,
  filter,
  filterByProposal,
  offset = 0,
}: IEvent = {}) {
  const [state, setState] = useState<TEvent>(initialState);
  const { network } = useNetwork();
  const fetchEvents = useCallback(async () => {
    try {
      const extension = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === extensionName,
      );
      const url = network.getCoreApiUrl();
      const contractId = extension?.contractAddress;
      const data = await fetchContractEventsById({
        url,
        limit: 50,
        contract_id: contractId,
        offset: offset,
        unanchored: false,
      });
      const { results } = data as any;
      const serializedEvents = results.map((event: any) => {
        const hex = event?.contract_log?.value.hex;
        const deserialized = deserializeCV(hex);
        const decoded = cvToValue(deserialized);
        return decoded;
      });

      const filteredEvents = filterByProposal
        ? serializedEvents?.filter(
            (item: any) =>
              item?.event?.value === filter &&
              item?.proposal?.value === filterByProposal,
          )
        : filter
        ? serializedEvents?.filter((item: any) => item?.event?.value === filter)
        : serializedEvents;
      setState({
        ...state,
        events: filteredEvents,
        eventSize: filteredEvents.length,
        isLoading: false,
      });
    } catch (e: any) {
      console.error({ e });
    }
  }, [organization]);

  useEffect(() => {
    fetchEvents();
  }, [organization]);

  return { isLoading: state.isLoading, events: state.events };
}

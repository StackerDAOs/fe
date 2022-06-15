// Hook (use-contract-events.tsx)
import { useCallback, useEffect, useState } from 'react';
import { useNetwork } from '@micro-stacks/react';
import { fetchContractEventsById } from 'micro-stacks/api';
import { deserializeCV, cvToValue } from 'micro-stacks/clarity';

type TEvent = {
  isLoading: boolean;
  events: any[];
};

interface IEvent {
  organization?: any;
  extensionName?: string;
  filter?: string;
  filterByProposal?: string;
}

const initialState = {
  isLoading: true,
  events: [],
};

export function useContractEvents({
  organization,
  extensionName,
  filter,
  filterByProposal,
}: IEvent = {}) {
  const [state, setState] = useState<TEvent>(initialState);
  const { network } = useNetwork();
  const fetchEvents = useCallback(async () => {
    try {
      const extension = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === extensionName,
      );
      const url = network.getCoreApiUrl();
      const contractId = extension?.contract_address;
      const data = await fetchContractEventsById({
        url,
        limit: 0,
        contract_id: contractId,
        offset: 0,
        unanchored: false,
      });
      const { results } = data;
      const serializedEvents = results.map((event: any) => {
        const hex = event?.contract_log?.value.hex;
        const deserialized = deserializeCV(hex);
        const decoded = cvToValue(deserialized);
        return decoded;
      });

      const filteredEvents = filterByProposal
        ? serializedEvents.filter(
            (item: any) =>
              item?.event?.value === filter &&
              item?.proposal?.value === filterByProposal,
          )
        : filter
        ? serializedEvents.filter((item: any) => item?.event?.value === filter)
        : serializedEvents;
      setState({ ...state, events: filteredEvents, isLoading: false });
    } catch (error) {
      console.log({ error });
    }
  }, [organization]);

  useEffect(() => {
    fetchEvents();
  }, [organization]);

  return { isLoading: state.isLoading, events: state.events };
}

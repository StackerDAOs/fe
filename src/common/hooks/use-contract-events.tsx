// Hook (use-contract-events.tsx)
import { useCallback, useEffect, useState } from 'react';

import { useNetwork } from '@micro-stacks/react';
import { fetchContractEventsById } from 'micro-stacks/api';
import { deserializeCV, cvToValue } from 'micro-stacks/clarity';

import { useOrganization } from './use-organization';

interface IEvent {
  extensionName?: string;
  filter?: string;
  filterByProposal?: string;
}

export function useContractEvents({
  extensionName,
  filter,
  filterByProposal,
}: IEvent = {}) {
  // TODO: check if slug is present and return error if not
  // TODO: check if oranization exists before checking balance
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const { organization } = useOrganization();
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
        limit: 10,
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
      setEvents(filteredEvents);
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
    }
  }, [organization]);

  useEffect(() => {
    fetchEvents();
  }, [organization]);

  return { isLoading, events };
}

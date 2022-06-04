// Hook (use-contract-events.tsx)
import { useEffect, useState } from 'react';

import { useNetwork } from '@micro-stacks/react';
import { fetchContractEventsById } from 'micro-stacks/api';
import { deserializeCV, cvToValue } from 'micro-stacks/clarity';

import { useOrganization } from './use-organization';

interface IEvent {
  extensionName?: string;
  filter?: string;
}

export function useContractEvents({ extensionName, filter }: IEvent = {}) {
  // TODO: check if slug is present and return error if not
  // TODO: check if oranization exists before checking balance
  const [state, setState] = useState<any>({});
  const { organization } = useOrganization();
  const { network } = useNetwork();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const extension = organization?.Extensions?.find(
          (extension: any) => extension?.ExtensionTypes?.name === extensionName,
        );
        const url = network.getCoreApiUrl();
        const contractId = extension?.contract_address;
        const data = await fetchContractEventsById({
          url,
          contract_id: contractId,
          limit: 10,
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
        const events = serializedEvents.filter(
          (item: any) => item?.event?.value === filter,
        );
        setState({ events });
      } catch (error) {
        console.log({ error });
      }
    };
    fetchEvents();
  }, [organization]);

  return { events: state.events };
}

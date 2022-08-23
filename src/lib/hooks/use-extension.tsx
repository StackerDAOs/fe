// Hook (use-extension.tsx)
import { useQuery } from 'react-query';
import { useDAO } from '@lib/hooks';
import { findExtension } from '@lib/functions';

export function useExtension(name: string) {
  const { data: dao } = useDAO();
  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    `extension-${name}`,
    () => {
      return findExtension(dao?.Extensions, name);
    },
    {
      enabled: !!dao,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

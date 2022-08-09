// Hook (use-tranaction.tsx)
import React from 'react';
import { useQuery } from 'react-query';
import { getTransaction } from 'lib/api';

export function useTransaction(transactionId: string) {
  const [interval, setInterval] = React.useState(5000);
  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['transaction', transactionId],
    async () => {
      const data = await getTransaction(transactionId);
      if (data.tx_status === 'success') {
        setInterval(0);
      }
      return data;
    },
    {
      enabled: !!transactionId,
      refetchInterval: interval,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

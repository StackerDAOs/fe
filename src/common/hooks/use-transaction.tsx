// Hook (use-transaction.tsx)
import { useEffect, useState } from 'react';
import { fetchTransaction } from 'micro-stacks/api';
import { useNetwork } from '@micro-stacks/react';

interface TransactionProps {
  txId: string;
  isPolling: boolean;
}

export const useTransaction = ({ txId }: TransactionProps) => {
  const [transaction, setTransaction] = useState<any>({});
  const [isPending, setIsPending] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState(null);

  async function fetch() {
    const { network } = useNetwork();
    try {
      const transaction = await fetchTransaction({
        url: network.getCoreApiUrl(),
        txid: txId,
        event_offset: 0,
        event_limit: 1,
      });
      setIsPending(transaction?.tx_status === 'success' ? false : true);
      setTransaction(transaction);
    } catch (e: any) {
      setError(e);
    }
  }

  useEffect(() => {
    fetch();
  }, [txId]);

  useEffect(() => {
    if (isPolling) {
      const interval = setInterval(() => {
        fetch();
      }, 2500);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isPolling]);

  return {
    transaction,
    setTransaction,
    isPending,
    setIsPending,
    isPolling,
    setIsPolling,
    error,
  };
};

// Hook (use-balance.tsx)
import { useCallback, useEffect, useState } from 'react';
import { useNetwork } from '@micro-stacks/react';
import { fetchAccountMempoolTransactions } from 'micro-stacks/api';

type TBalance = {
  isLoading: boolean;
  transactions: any;
};

interface IMempool {
  organization?: any;
  extensionName?: string;
}

const initialState = {
  isLoading: true,
  transactions: [],
};

export function useMempool({ organization, extensionName }: IMempool = {}) {
  const [state, setState] = useState<TBalance>(initialState);
  const { network } = useNetwork();

  const fetchBalance = useCallback(async () => {
    try {
      const vault = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === extensionName,
      );
      const url = network.getCoreApiUrl();
      const principal = vault?.contractAddress;
      const transactions = await fetchAccountMempoolTransactions({
        url,
        principal,
        limit: 20,
      });
      setState({ ...state, isLoading: false, transactions });
    } catch (e: any) {
      console.error({ e });
    }
  }, [organization]);

  useEffect(() => {
    fetchBalance();
  }, [organization]);

  return { isLoading: state.isLoading, transactions: state.transactions };
}

// Hook (use-balance.tsx)
import { useCallback, useEffect, useState } from 'react';
import { useNetwork } from '@micro-stacks/react';
import { fetchAccountBalances } from 'micro-stacks/api';

type TBalance = {
  isLoading: boolean;
  balance: any;
};

interface IBalance {
  organization?: any;
}

const initialState = {
  isLoading: true,
  balance: [],
};

export function useBalance({ organization }: IBalance = {}) {
  const [state, setState] = useState<TBalance>(initialState);
  const { network } = useNetwork();

  const fetchBalance = useCallback(async () => {
    try {
      const vault = organization?.Extensions?.find(
        (extension: any) => extension?.ExtensionTypes?.name === 'Vault',
      );
      const url = network.getCoreApiUrl();
      const principal = vault?.contract_address;
      const balance = await fetchAccountBalances({
        url,
        principal,
      });
      setState({ ...state, isLoading: false, balance: balance });
    } catch (error) {
      console.error({ error });
    } finally {
      console.log('finally');
    }
  }, [organization]);

  useEffect(() => {
    fetchBalance();
  }, [organization]);

  return { isLoading: state.isLoading, balance: state.balance };
}

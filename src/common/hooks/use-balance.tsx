// Hook (use-balance.tsx)
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useNetwork } from '@micro-stacks/react';
import { fetchAccountBalances } from 'micro-stacks/api';

import { useStore as VaultStore } from 'store/VaultStore';

import { useOrganization } from './use-organization';

export function useBalance() {
  // TODO: check if slug is present and return error if not
  // TODO: check if oranization exists before checking balance
  const { organization } = useOrganization();
  const { network } = useNetwork();

  const { balance, setBalance } = VaultStore();

  useEffect(() => {
    const fetchBalance = async () => {
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
        setBalance(balance);
      } catch (error) {
        console.log({ error });
      }
    };
    fetchBalance();
  }, [organization]);

  return { balance };
}

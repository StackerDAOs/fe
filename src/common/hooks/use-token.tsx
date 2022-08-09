// Hook (use-token.tsx)
import { useQuery } from 'react-query';
import { useExtension } from '@common/hooks';
import { getTokenMetadata, getVaultBalance } from 'lib/api';
import { splitContractAddress } from '@stacks-os/utils';

export function useToken() {
  const { data: governanceToken } = useExtension('Governance Token');
  const { data: vault } = useExtension('Vault');

  const {
    isFetching,
    isIdle,
    isLoading,
    isError,
    data: token,
  } = useQuery(
    ['token', `${governanceToken?.contractAddress}`],
    async () => {
      const [contractAddress, contractName] = splitContractAddress(
        governanceToken?.contractAddress,
      );
      const data = await getTokenMetadata(governanceToken?.contractAddress);
      return { contractAddress, contractName, ...data };
    },
    {
      enabled: !!governanceToken?.contractAddress,
    },
  );

  const { data: balance } = useQuery(
    'vault-balance',
    async () => {
      return await getVaultBalance(vault?.contractAddress);
    },
    {
      enabled: !!vault?.contractAddress,
    },
  );

  return { isFetching, isIdle, isLoading, isError, token, balance };
}

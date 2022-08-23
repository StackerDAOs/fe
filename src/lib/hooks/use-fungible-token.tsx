// Hook (use-fungible-token.tsx)
import { useQuery } from 'react-query';
import { getTokenMetadata } from '@lib/api';
import { splitContractAddress } from '@stacks-os/utils';

export function useFungibleToken(tokenPrincipal: string) {
  const { isFetching, isIdle, isLoading, isError, data } = useQuery(
    ['fungible-token', tokenPrincipal],
    async () => {
      const [contractAddress, contractName] =
        splitContractAddress(tokenPrincipal);
      const data = await getTokenMetadata(tokenPrincipal);
      return { contractAddress, contractName, ...data };
    },
    {
      enabled: !!tokenPrincipal,
    },
  );

  return { isFetching, isIdle, isLoading, isError, data };
}

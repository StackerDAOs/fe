import { HStack, Text } from '@chakra-ui/react';
import { useExtension } from '@common/queries';
import { CopyClipboard } from '@components/CopyClipboard';

//helpers
import { truncate } from '@common/helpers';

export const VaultAddress = () => {
  const {
    isFetching,
    isIdle,
    isLoading,
    isError,
    extension: vault,
  } = useExtension('Vault');

  if (isFetching || isIdle || isLoading || isError) {
    return null;
  } else {
    return (
      <>
        <HStack align='baseline'>
          <Text fontSize='xs' color='light.600'>
            {truncate(vault.contractAddress, 4, 14)}
          </Text>
          <CopyClipboard contractAddress={vault.contractAddress} />
        </HStack>
      </>
    );
  }
};

// {vault.contractAddress.slice(0, 5) +
//   '...' +
//   vault.contractAddress.slice(37)}

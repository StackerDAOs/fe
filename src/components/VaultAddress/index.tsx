import { HStack, Text } from '@chakra-ui/react';
import { useExtension } from '@common/queries';
import { CopyClipboard } from '@components/CopyClipboard';

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
            {vault.contractAddress.slice(0, 5) +
              '...' +
              vault.contractAddress.slice(37)}
          </Text>
          <CopyClipboard contractAddress={vault.contractAddress} />
        </HStack>
      </>
    );
  }
};

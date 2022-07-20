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

  console.log('F', isFetching, 'i', isIdle, 'L', isLoading, 'e', isError);

  if (isFetching || isIdle || isLoading || isError) {
    return null;
  } else {
    return (
      <>
        <HStack>
          <Text fontSize='sm'>
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

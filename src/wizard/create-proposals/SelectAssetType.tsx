import { Box, Stack, Text } from '@chakra-ui/react';

// Store
import { useStore } from 'store/proposals/CreateTransfer';

// Components
import { RadioCard, RadioCardGroup } from '@components/RadioCardGroup';

export const SelectAssetType = () => {
  const { selectedAssetType, handleSelectAsset } = useStore();
  return (
    <>
      <Stack
        spacing='4'
        mb='3'
        direction={{ base: 'column', md: 'row' }}
        justify='space-between'
        color='white'
      >
        <Box>
          <Text fontSize='2xl' fontWeight='medium'>
            Choose an asset type
          </Text>
          <Text color='gray.900' fontSize='sm'>
            Select which type of asset you want to transfer.
          </Text>
        </Box>
      </Stack>
      <RadioCardGroup
        defaultValue='Token'
        spacing='3'
        direction='row'
        value={selectedAssetType}
        onChange={(selectedAssetType) =>
          handleSelectAsset('selectedAssetType', selectedAssetType)
        }
      >
        {[
          {
            type: 'Token',
            description: 'i.e., STX, $ALEX, or any SIP-10 token',
          },
          {
            type: 'NFT',
            description: 'i.e., Megapont, Crash Punks, or any SIP-09 NFT',
          },
        ].map((option) => (
          <RadioCard key={option.type} value={option.type} color='white'>
            <Text color='emphasized' fontWeight='medium' fontSize='sm'>
              {option.type}
            </Text>
            <Text color='gray.900' fontSize='sm'>
              {option.description}
            </Text>
          </RadioCard>
        ))}
      </RadioCardGroup>
    </>
  );
};

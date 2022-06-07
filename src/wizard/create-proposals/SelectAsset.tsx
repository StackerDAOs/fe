import { Box, Stack, Text } from '@chakra-ui/react';

// Store
import { useStore } from 'store/proposals/CreateTransfer';

// Components
import { RadioCard, RadioCardGroup } from '@components/RadioCardGroup';

export const SelectAsset = () => {
  const { selectedAsset, handleSelectAsset } = useStore();
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
            Select an asset
          </Text>
          <Text color='gray.900' fontSize='sm'>
            Select which asset you want to transfer.
          </Text>
        </Box>
      </Stack>
      <RadioCardGroup
        defaultValue='Token'
        spacing='3'
        direction='column'
        value={selectedAsset}
        onChange={(selectedAsset) =>
          handleSelectAsset('selectedAsset', selectedAsset)
        }
      >
        {[
          {
            type: 'STX',
            description: 'Stacks',
          },
          {
            type: 'GVT',
            description: 'Governance Token',
          },
          {
            type: 'MIA',
            description: 'MiamiCoin',
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

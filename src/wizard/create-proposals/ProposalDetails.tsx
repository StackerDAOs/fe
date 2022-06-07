import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  SimpleGrid,
  Text,
  Textarea,
} from '@chakra-ui/react';

// Store
import { proposalStore } from 'store/proposals/CreateTransfer';

export const ProposalDetails = () => {
  const { transferAmount, transferTo, description, handleChange } =
    proposalStore();
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
            Proposal Details
          </Text>
          <Text color='gray.900' fontSize='sm'>
            Provide some details about your proposal.
          </Text>
        </Box>
      </Stack>
      <Stack spacing='6' direction='column'>
        <SimpleGrid columns={2} spacing='5'>
          <FormControl color='light.900'>
            <FormLabel>Transfer amount</FormLabel>
            <Input
              name='transferAmount'
              placeholder='100'
              value={transferAmount}
              onInput={handleChange}
            />
          </FormControl>
          <FormControl color='light.900'>
            <FormLabel>Transfer to</FormLabel>
            <Input
              name='transferTo'
              placeholder='SP14...'
              value={transferTo}
              onChange={handleChange}
            />
          </FormControl>
        </SimpleGrid>
        <FormControl color='light.900'>
          <FormLabel>Description</FormLabel>
          <Textarea
            name='description'
            rows={4}
            resize='none'
            placeholder='Transfers 100 STX to SP14...'
            value={description}
            onChange={handleChange}
          />
        </FormControl>
      </Stack>
    </>
  );
};

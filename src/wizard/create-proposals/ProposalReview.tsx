import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  VStack,
  SimpleGrid,
  Text,
  Textarea,
} from '@chakra-ui/react';

// Stacks
import { useCurrentStxAddress } from '@micro-stacks/react';

// Store
import { useStore, proposalStore } from 'store/proposals/CreateTransfer';

// Components
import { Card } from '@components/Card';

// Utils
import { truncate } from '@common/helpers';

export const ProposalReview = () => {
  const currentStxAddress = useCurrentStxAddress();
  const { selectedAsset } = useStore();
  const { transferAmount, transferTo, description } = proposalStore();
  return (
    <>
      <Box as='section'>
        <VStack
          align='left'
          spacing='4'
          mb='3'
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          color='white'
        >
          <Card border='1px solid rgb(134, 143, 152)'>
            <Box py={{ base: '3', md: '3' }} px={{ base: '6', md: '6' }}>
              <Text
                fontSize='3xl'
                fontWeight='medium'
                bgGradient='linear(to-br, secondaryGradient.900, secondary.900)'
                bgClip='text'
                mb='1'
              >
                SDP Transfer {selectedAsset}
              </Text>
              <Text color='light.900' fontSize='sm'>
                Review & deploy smart contract.
              </Text>
              <Divider my='3' borderColor='base.500' />
              <Stack spacing='3' my='3'>
                <HStack justify='space-between'>
                  <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                    Amount
                  </Text>
                  <Text fontSize='sm' fontWeight='medium' color='light.900'>
                    {transferAmount} {selectedAsset}
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                    Recipient
                  </Text>
                  <Text fontSize='sm' fontWeight='medium' color='light.900'>
                    {transferTo && truncate(transferTo, 4, 4)}
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                    Proposer
                  </Text>
                  <Text fontSize='sm' fontWeight='medium' color='light.900'>
                    {currentStxAddress && truncate(currentStxAddress, 4, 4)}
                  </Text>
                </HStack>
              </Stack>
              <Stack my='3'>
                <Stack
                  spacing='4'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  color='white'
                >
                  <Box>
                    <Text fontSize='sm' fontWeight='medium' color='gray.900'>
                      Description
                    </Text>
                  </Box>
                </Stack>
                <Text
                  fontSize='sm'
                  _selection={{
                    bg: 'base.800',
                    color: 'secondary.900',
                  }}
                >
                  {description}
                </Text>
              </Stack>
            </Box>
          </Card>
        </VStack>
      </Box>
    </>
  );
};

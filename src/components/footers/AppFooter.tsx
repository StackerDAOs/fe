import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
  ModalBody,
  Stack,
} from '@chakra-ui/react';
import { useAccount } from '@micro-stacks/react';
import { DepositButton, InitButton } from '@components/buttons';
import { DevToolModal } from '@components/modals';
import { adminAddress } from '@common/constants';

export const AppFooter = () => {
  const [depositAmount, setDepositAmount] = React.useState('');
  const [bootstrap, setBootstrap] = React.useState('');
  const { stxAddress } = useAccount();

  if (stxAddress === adminAddress) {
    return (
      <Box as='section'>
        <Box
          as='nav'
          position='fixed'
          bottom='0'
          py='3'
          px='8'
          w='100%'
          bg='transparent'
          zIndex='9999'
        >
          <HStack justify='space-between' flex='1'>
            <HStack spacing='2'>
              <DevToolModal title='Dev Tools'>
                <ModalBody pb={6}>
                  <Stack spacing='3'>
                    <VStack spacing='2' align='flex-start'>
                      <FormControl>
                        <FormLabel>Proposal contract</FormLabel>
                        <Input
                          id='bootstrapContract'
                          bg='base.800'
                          borderColor='base.500'
                          autoComplete='off'
                          placeholder='ST...'
                          onInput={(e: any) => setBootstrap(e.target.value)}
                        />
                      </FormControl>
                      <InitButton title='Init' address={bootstrap} />
                    </VStack>
                    <VStack spacing='2' align='flex-start'>
                      <FormControl>
                        <FormLabel>Amount</FormLabel>
                        <Input
                          id='depositAmount'
                          type='number'
                          bg='base.800'
                          borderColor='base.500'
                          autoComplete='off'
                          placeholder='100 STX'
                          onInput={(e: any) => setDepositAmount(e.target.value)}
                        />
                      </FormControl>
                      <DepositButton title='Deposit' amount={depositAmount} />
                    </VStack>
                  </Stack>
                </ModalBody>
              </DevToolModal>
            </HStack>
          </HStack>
        </Box>
      </Box>
    );
  }
  return null;
};

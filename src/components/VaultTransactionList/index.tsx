import {
  Box,
  Button,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  SimpleGrid,
  Square,
  Icon,
  IconButton,
  Image,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

import { FiSend } from 'react-icons/fi';
import { FiMoon } from 'react-icons/fi';
import { FiFile } from 'react-icons/fi';
import { FiExternalLink } from 'react-icons/fi';

// Components
import { ActionModal } from '@components/Modal';

export const VaultTransactionList = () => {
  return (
    <Box color={mode('base.900', 'light.900')}>
      <Stack spacing='5'>
        <Stack spacing='1'>
          <SimpleGrid
            maxW='md'
            mt='6'
            py={{ base: '2', md: '2', lg: '2' }}
            columns={{ base: 1, md: 3 }}
            color={mode('base.900', 'light.900')}
          >
            <HStack>
              <Image
                src='https://cryptologos.cc/logos/stacks-stx-logo.png'
                height='25px'
                alt='Stacks'
              />
              <Text>28, 290</Text>
            </HStack>
            <HStack>
              <Image
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png'
                height='25px'
                alt='Stacks'
              />
              <Text>28, 290</Text>
            </HStack>
            <HStack>
              <Image
                src='https://s2.coinmarketcap.com/static/img/coins/64x64/10300.png'
                height='25px'
                alt='Stacks'
              />
              <Text>28, 290</Text>
            </HStack>
          </SimpleGrid>
          <Stack
            spacing='3'
            pt={{ base: '0', md: '2', lg: '2' }}
            direction={{ base: 'column-reverse', md: 'row' }}
          >
            <Button
              maxW='md'
              color='white'
              bgGradient={mode(
                'linear(to-br, secondaryGradient.900, secondary.900)',
                'linear(to-br, primaryGradient.900, primary.900)',
              )}
              border='none'
              size='md'
              fontSize='md'
              fontWeight='regular'
              _hover={{ opacity: 0.9 }}
              _active={{ opacity: 1 }}
            >
              Deposit
            </Button>
            <ActionModal
              payload={{
                header: 'Send funds',
                action: { title: 'Deploy', event: () => console.log('deploy') },
                button: { title: 'Send funds', type: 'secondary' },
              }}
            >
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Amount</FormLabel>
                  <Input
                    placeholder='Amount'
                    name='amount'
                    onChange={(e) => console.log(e)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Recipient</FormLabel>
                  <Input
                    placeholder='Recipient'
                    name='recipientAddress'
                    onChange={(e) => console.log(e)}
                  />
                </FormControl>
              </ModalBody>
            </ActionModal>
          </Stack>
        </Stack>
        <Box>
          {[
            {
              description: '1,200 sent to',
              value: 'SP123...98765',
              icon: FiFile,
            },
            {
              description: '420 sent to',
              value: 'SP987...41D98',
              icon: FiMoon,
            },
            {
              description: '69,420 deposited to',
              value: 'SP987...41D98',
              icon: FiSend,
            },
          ].map((data) => (
            <Stack
              key={data.description}
              as={Box}
              role='group'
              justify='space-between'
              direction={{ base: 'column', md: 'row' }}
              spacing='5'
              p={{ base: '0', md: '3' }}
              _hover={{
                bg: mode('light.700', 'base.700'),
                borderRadius: 'lg',
              }}
            >
              <HStack spacing='3'>
                <Square
                  size='10'
                  bg={mode('light.800', 'base.800')}
                  borderRadius='lg'
                  _groupHover={{
                    bg: mode('light.900', 'base.900'),
                  }}
                >
                  <Icon as={FiSend} boxSize='5' />
                </Square>
                <Box fontSize='sm'>
                  <Text color='empahsized' fontWeight='medium'>
                    {data.description}
                  </Text>
                  <Text color='muted'>{data.value}</Text>
                </Box>
              </HStack>
              <IconButton
                icon={<FiExternalLink />}
                bg={mode('light.800', 'base.800')}
                _groupHover={{
                  bg: mode('light.900', 'base.900'),
                }}
                aria-label='Edit member'
              />
            </Stack>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

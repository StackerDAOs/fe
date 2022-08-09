import React from 'react';
import {
  Button,
  HStack,
  FormControl,
  Image,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNetwork, useAccount } from '@micro-stacks/react';
import { fetchAccountStxBalance } from 'micro-stacks/api';

// Components
import { Card } from '@components/cards';
import { DepositButton } from '@components/Actions';

// Utils
import { ustxToStx } from '@common/helpers';

export const DepositCard = () => {
  const [balance, setBalance] = React.useState<string | undefined>('');
  const [depositAmount, setDepositAmount] = React.useState('');
  const { network } = useNetwork();
  const { stxAddress } = useAccount();
  React.useEffect(() => {
    const fetch = async () => {
      if (stxAddress) {
        try {
          const data = await fetchAccountStxBalance({
            url: network.getCoreApiUrl(),
            principal: stxAddress || '',
          });
          const balance = data?.balance?.toString() || '0';
          setBalance(ustxToStx(balance));
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetch();
  }, []);

  const handleInputDeposit = (e: any) => {
    const re = /^[0-9.\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setDepositAmount(e.target.value);
    }
  };

  return (
    <Card bg='base.900'>
      <Stack spacing='0'>
        <Stack
          align='flex-start'
          bg='base.800'
          borderRadius='lg'
          px={{ base: '6', md: '6' }}
          py={{ base: '3', md: '3' }}
        >
          <Text color='light.900' fontSize='md' fontWeight='medium'>
            Deposit
          </Text>
        </Stack>
        <Stack
          px={{ base: '6', md: '6' }}
          py={{ base: '6', md: '6' }}
          spacing='6'
        >
          <HStack justify='space-between' align='center' spacing='2'>
            <VStack align='flex-start' spacing='0'>
              <FormControl>
                <Input
                  color='light.900'
                  py='1'
                  px='2'
                  maxW='8em'
                  type='tel'
                  bg='base.900'
                  border='none'
                  fontSize='2xl'
                  autoComplete='off'
                  placeholder='0'
                  value={depositAmount}
                  onInput={handleInputDeposit}
                  _focus={{
                    border: 'none',
                  }}
                />
              </FormControl>
              <HStack px='2'>
                <Image
                  cursor='pointer'
                  height='15px'
                  src='https://cryptologos.cc/logos/stacks-stx-logo.png?v=022'
                  alt='logo'
                />

                <Text fontSize='md' fontWeight='regular' color='gray.900'>
                  STX
                </Text>
              </HStack>
            </VStack>

            <HStack>
              <Button
                color='white'
                bg='base.800'
                size='sm'
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 1 }}
              >
                Max
              </Button>
            </HStack>
          </HStack>
          <Stack w='100%'>
            <DepositButton title='Deposit' amount={depositAmount} />
            <Text
              color='gray.900'
              textAlign='center'
              fontSize='sm'
              fontWeight='regular'
            >
              Your wallet balance: {balance} STX
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

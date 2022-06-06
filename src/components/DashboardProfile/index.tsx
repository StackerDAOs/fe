import { Badge, IconButton, HStack, VStack, Text } from '@chakra-ui/react';

// Components
import { Stat } from '@components/Stat';

// Icons
import { FaMoneyBill } from 'react-icons/fa';

export const DashboardProfile = () => {
  return (
    <VStack spacing='5' alignItems='center' px='5'>
      <HStack>
        <Badge
          size='md'
          maxW='fit-content'
          variant='subtle'
          bg='base.800'
          px='3'
          py='2'
        >
          <HStack spacing='1'>
            <Text>My Holdings</Text>
          </HStack>
        </Badge>
      </HStack>

      <HStack spacing='3'>
        <IconButton
          size='sm'
          bg='primaryGradient.900'
          color='light.900'
          aria-label='Search database'
          icon={<FaMoneyBill />}
        />
        {''}
        <Stat fontSize='sm' title='Members'>
          4269
        </Stat>
      </HStack>
      <HStack spacing='3'>
        <IconButton
          size='sm'
          bg='primaryGradient.900'
          color='light.900'
          aria-label='Search database'
          icon={<FaMoneyBill />}
        />
        {''}
        <Stat fontSize='sm' title='Members'>
          4269
        </Stat>
      </HStack>
    </VStack>
  );
};

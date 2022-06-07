import {
  Avatar,
  Badge,
  HStack,
  IconButton,
  Table,
  Thead,
  Th,
  TableProps,
  Tbody,
  Td,
  Text,
  Tr,
  Skeleton,
  useColorModeValue as mode,
} from '@chakra-ui/react';

// Utils
import { convertToken } from '@common/helpers';

// Icons
import { FiExternalLink } from 'react-icons/fi';

type AssetTableProps = {
  type: string;
};

// Hooks
import { useBalance } from '@common/hooks';

export const AssetTable = (props: TableProps & AssetTableProps) => {
  const { type } = props;
  const { isLoading, balance } = useBalance();
  const { non_fungible_tokens, fungible_tokens } = balance;
  const fungibleTokens: any = Object.assign({}, fungible_tokens);
  const fungibleTokensList = Object.keys(fungibleTokens).map((key) => {
    const tokenKey = key.split('::')[1];
    const tokenValue = fungibleTokens[key];
    return {
      name: tokenKey,
      balance: tokenValue?.balance,
    };
  });
  const nonFungibleTokens: any = Object.assign({}, non_fungible_tokens);
  const nonFungibleTokensList = Object.keys(nonFungibleTokens).map((key) => {
    const tokenKey = key.split('::')[1];
    const tokenValue = nonFungibleTokens[key];
    return {
      name: tokenKey,
      balance: tokenValue?.balance,
    };
  });
  const listItems =
    type === 'fungible' ? fungibleTokensList : nonFungibleTokensList;

  return (
    <Skeleton isLoaded={!isLoading}>
      <Table {...props}>
        <Thead bg='base.900'>
          <Tr>
            <Th bg='base.900' border='none'>
              Name
            </Th>
            <Th bg='base.900' border='none'>
              Balance
            </Th>
            <Th bg='base.900' border='none'></Th>
          </Tr>
        </Thead>
        <Tbody color={mode('base.900', 'light.900')}>
          {listItems.map((item) => (
            <Tr
              key={item.name}
              borderTop={`1px solid #1F2129`}
              borderBottom={`1px solid #1F2129`}
              cursor='pointer'
              _hover={{
                bg: 'base.800',
              }}
            >
              <Td border='none'>
                <HStack spacing='3'>
                  <Avatar src={'https://bit.ly/sage-adebayo'} boxSize='8' />
                  <Text color='muted'>{item.name}</Text>
                  <Text color='gray.900'>GVT</Text>
                </HStack>
              </Td>
              <Td border='none'>
                <Badge size='md' colorScheme='base'>
                  {convertToken(item.balance)}
                </Badge>
              </Td>
              <Td border='none'>
                <HStack spacing='1'>
                  <IconButton
                    icon={<FiExternalLink />}
                    variant='ghost'
                    aria-label='View on Stacks Explorer'
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Skeleton>
  );
};

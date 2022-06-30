import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  HStack,
  Table,
  Thead,
  Th,
  TableProps,
  Tbody,
  Td,
  Text,
  Tr,
  Skeleton,
} from '@chakra-ui/react';

// Components
import { EmptyState } from '@components/EmptyState';

// Web3
import { useNetwork } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';

// Utils
import { ustxToStx, convertToken } from '@common/helpers';
import Avatar from 'boring-avatars';

// Hooks
import { useBalance, useOrganization } from '@common/hooks';

// Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

// Icons
import { TransferTokenModal, TransferStxModal } from '@components/Modal';

type AssetTableProps = {
  type: string;
};

type TAssetTable = {
  isLoading: boolean;
  fungibleTokensList: any[];
};

const initialState = {
  isLoading: true,
  fungibleTokensList: [],
};

export const AssetTable = (props: TableProps & AssetTableProps) => {
  const [state, setState] = useState<TAssetTable>(initialState);
  const { type } = props;
  const { network } = useNetwork();
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { isLoading, balance } = useBalance({ organization });
  const { stx, non_fungible_tokens, fungible_tokens } = balance;
  const fungibleTokens: any = Object.assign({}, fungible_tokens);
  const nonFungibleTokens: any = Object.assign({}, non_fungible_tokens);
  const nonFungibleTokensList = Object.keys(nonFungibleTokens).map((key) => {
    const tokenKey = key.split('::')[1];
    const tokenValue = nonFungibleTokens[key];
    return {
      name: tokenKey,
      balance: tokenValue?.balance,
      totalSent: tokenValue?.total_sent,
      totalReceived: tokenValue?.total_received,
    };
  });
  console.log({ stx });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const fetchAssetData = async (
          type: string,
          {
            balance,
            total_sent: totalSent,
            total_received: totalReceived,
          }: any,
          { contractAddress, contractName }: any,
        ) => {
          console.log({ type });
          const senderAddress = `${contractAddress}.${contractName}`;
          const name = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress,
            functionArgs: [],
            functionName: 'get-name',
          });
          const symbol = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress,
            functionArgs: [],
            functionName: 'get-symbol',
          });
          const decimals = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress,
            functionArgs: [],
            functionName: 'get-decimals',
          });
          const tokenUri = await fetchReadOnlyFunction({
            network,
            contractAddress,
            contractName,
            senderAddress,
            functionArgs: [],
            functionName: 'get-token-uri',
          });
          return {
            contractAddress: `${contractAddress}.${contractName}`,
            name,
            balance,
            totalSent,
            totalReceived,
            symbol,
            decimals,
            tokenUri,
          };
        };
        const assets = Object.keys(fungibleTokens).map((key) => {
          const contractAddress = key.split('::')[0].split('.')[0];
          const contractName = key.split('::')[0].split('.')[1];
          const { balance, total_sent, total_received } = fungibleTokens[key];
          const rest = { balance, total_sent, total_received };
          return fetchAssetData('fungible', rest, {
            contractAddress,
            contractName,
          });
        });
        const fungibleTokensList = await Promise.all(assets);
        const stacks: any = {
          contractAddress: null,
          name: 'Stacks',
          symbol: 'STX',
          balance: stx?.balance,
          totalSent: stx?.total_sent,
          totalReceived: stx?.total_received,
        };
        const withStacks = fungibleTokensList.concat(stacks);
        setState({
          ...state,
          isLoading: false,
          fungibleTokensList: withStacks,
        });
      } catch (error) {
        console.error({ error });
      } finally {
        console.log('done');
      }
    };
    fetchAssets();
  }, [organization, balance]);

  const listItems =
    type === 'fungible' ? state.fungibleTokensList : nonFungibleTokensList;

  console.log(state.fungibleTokensList);

  if (listItems.length === 0) {
    return (
      <EmptyState
        heading={
          type === 'fungible' ? 'No coins found' : 'No collectibles found'
        }
        linkTo={`/d/${dao}/proposals/c/transfer/stx`}
        buttonTitle={type === 'fungible' ? 'Transfer' : 'Transfer'}
      />
    );
  }

  return (
    <Skeleton isLoaded={!isLoading}>
      <motion.div
        variants={FADE_IN_VARIANTS}
        initial={FADE_IN_VARIANTS.hidden}
        animate={FADE_IN_VARIANTS.enter}
        exit={FADE_IN_VARIANTS.exit}
        transition={{ duration: 1, type: 'linear' }}
      >
        <Table {...props}>
          <Thead color='gray.900'>
            <Tr>
              <Th bg='transparent' border='none'>
                Name
              </Th>
              <Th bg='transparent' border='none'>
                Balance
              </Th>
              <Th bg='transparent' border='none'>
                Total sent
              </Th>
              <Th bg='transparent' border='none'>
                Total received
              </Th>
              <Th bg='transparent' border='none'></Th>
            </Tr>
          </Thead>
          <Tbody color='light.900'>
            {listItems.map((item) => {
              const { contractAddress, name, symbol, decimals } = item;
              let { balance, totalSent, totalReceived } = item;
              switch (name) {
                case 'Stacks':
                  balance = ustxToStx(item.balance);
                  totalSent = ustxToStx(item.totalSent);
                  totalReceived = ustxToStx(item.totalReceived);
                  break;

                default:
                  if (contractAddress) {
                    balance = convertToken(item.balance, decimals);
                    totalSent = convertToken(item.totalSent, decimals);
                    totalReceived = convertToken(item.totalReceived, decimals);
                    break;
                  }
              }
              return (
                <Tr key={item.name} cursor='pointer'>
                  <Td borderColor='base.500'>
                    <HStack spacing='2' align='center'>
                      {/* <Avatar
                      src={
                        'ipfs://Qmdgks1HjYZQhF4sTnkoeh7naic7J3G5aHQk91Uq25RwmF'
                      }
                      boxSize='6'
                    /> */}
                      <Avatar
                        size={15}
                        name={item.symbol}
                        variant='marble'
                        colors={[
                          '#50DDC3',
                          '#624AF2',
                          '#EB00FF',
                          '#7301FA',
                          '#25C2A0',
                        ]}
                      />
                      <HStack align='baseline'>
                        <Text color='light.900' fontWeight='medium'>
                          {item.name}
                        </Text>
                        <Text fontSize='xs' color='gray.900'>
                          ({symbol})
                        </Text>
                      </HStack>
                    </HStack>
                  </Td>
                  <Td borderColor='base.500'>{balance}</Td>
                  <Td borderColor='base.500'>{totalSent}</Td>
                  <Td borderColor='base.500'>{totalReceived}</Td>
                  <Td borderColor='base.500'>
                    {contractAddress ? (
                      <TransferTokenModal contractAddress={contractAddress} />
                    ) : (
                      <TransferStxModal />
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </motion.div>
    </Skeleton>
  );
};

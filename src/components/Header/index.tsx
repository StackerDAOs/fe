import {
  Container,
  Heading,
  HStack,
  Image,
  Stack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

// Utils
import { ustxToStx, convertToken } from '@common/helpers';
import Avatar from 'boring-avatars';

// Components
import { Stat } from '@components/Stat';

// Hooks
import {
  useBalance,
  useBlocks,
  useOrganization,
  useContractEvents,
  useGovernanceToken,
} from '@common/hooks';

export const Header = () => {
  const { organization } = useOrganization();
  const { isLoading: isLoadingBalance, balance } = useBalance();
  const { balance: userBalance } = useGovernanceToken();
  const { events: proposalEvents } = useContractEvents({
    extensionName: 'Voting',
    filter: 'propose',
  });
  const { currentBlockHeight } = useBlocks();

  const Vault = () => {
    const { stx, non_fungible_tokens, fungible_tokens } = balance as any;
    const fungibleTokens = Object.assign({}, fungible_tokens);
    const nonFungibleTokens = Object.assign({}, non_fungible_tokens);
    const tokenSize = Object.values(fungibleTokens)?.length;
    const nftSize = Object.values(nonFungibleTokens)?.length;
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Vault'
        value={`${ustxToStx(stx?.balance) || 0}`}
        assetSymbol='STX'
        info={`${tokenSize} ${
          tokenSize === 1 ? 'token' : 'tokens'
        } & ${nftSize} ${nftSize === 1 ? 'NFT' : 'NFTs'}`}
        path='vault'
      />
    );
  };

  const Proposals = () => {
    const proposalSize = proposalEvents?.length;
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Proposals'
        value={proposalSize.toString()}
        info={`Active`}
        path='proposals'
      />
    );
  };

  const Governance = () => {
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Governance'
        value={convertToken(userBalance?.toString(), 100).toString()}
        info={`MEGA tokens`}
        path='governance'
      />
    );
  };

  if (isLoadingBalance) {
    return <Spinner />;
  }

  return (
    <Stack spacing={{ base: '8', lg: '6' }} my='3'>
      <Container>
        <Stack
          spacing='4'
          mb='2'
          direction={{ base: 'column', md: 'row' }}
          justify='flex-start'
          color='white'
        >
          <VStack maxW='xl' spacing='3'>
            <HStack align='baseline'>
              <Avatar
                size={40}
                name={organization?.name}
                variant='marble'
                colors={['#50DDC3', '#624AF2', '#EB00FF', '#7301FA', '#25C2A0']}
              />
              <Heading size='lg' pb='2' fontWeight='semibold' color='light.900'>
                {organization?.name}
              </Heading>
              <Text
                as='span'
                pl='1'
                fontSize='3xl'
                color='gray.900'
                fontWeight='regular'
              >
                DAO
              </Text>
            </HStack>
          </VStack>
        </Stack>
        <Stack
          spacing='8'
          mb='8'
          direction={{ base: 'column', md: 'row' }}
          justify='center'
          align='center'
          color='white'
        >
          <Vault />
          <Proposals />
          <Governance />
        </Stack>
      </Container>
    </Stack>
  );
};

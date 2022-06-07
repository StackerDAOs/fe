import {
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  Spinner,
  StackDivider,
  VStack,
} from '@chakra-ui/react';

// Utils
import { ustxToStx, convertToken } from '@common/helpers';

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
  const { votingWeight } = useGovernanceToken();
  const { events: proposalEvents } = useContractEvents({
    extensionName: 'Voting',
    filter: 'propose',
  });
  const { currentBlockHeight } = useBlocks();

  const Vault = () => {
    const { stx, non_fungible_tokens, fungible_tokens } = balance as any;
    const fungibleTokens = Object.assign({}, fungible_tokens);
    const nonFungibleTokens = Object.assign({}, non_fungible_tokens);
    return (
      <Stat
        flex='1'
        _first={{ pl: '0' }}
        _last={{ borderRightWidth: '0' }}
        label='Vault'
        value={`${ustxToStx(stx?.balance) || 0} STX`}
        info={`${Object.values(fungibleTokens)?.length} tokens & ${
          Object.values(nonFungibleTokens)?.length
        } NFTs`}
        path='vault'
      />
    );
  };

  const Proposals = () => {
    const proposalSize = proposalEvents?.length;
    console.log({ proposalEvents });
    return (
      <Stat
        flex='1'
        _first={{ pl: '0' }}
        _last={{ borderRightWidth: '0' }}
        label='Proposals'
        value={proposalSize.toString()}
        info={`0 active`}
        path='governance'
      />
    );
  };

  const Profile = () => {
    return (
      <Stat
        flex='1'
        _first={{ pl: '0' }}
        _last={{ borderRightWidth: '0' }}
        label='Voting power'
        value={convertToken(votingWeight.toString()).toString()}
        info={`> 1.5% required`}
        path='delegates'
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
          align='center'
          color='white'
        >
          <VStack maxW='xl' spacing='3' alignItems='baseline'>
            <HStack>
              <Box
                w='50px'
                h='50px'
                borderRadius='50%'
                bgGradient='linear(to-l, secondaryGradient.900, secondary.900)'
              />
              <Heading size='xl' pb='2' fontWeight='regular' color='light.900'>
                {organization?.name}
              </Heading>
            </HStack>
          </VStack>
        </Stack>
        <Stack
          spacing='4'
          mb='6'
          direction={{ base: 'column', md: 'row' }}
          justify='center'
          align='center'
          color='white'
        >
          <Stack
            w='100%'
            direction={{ base: 'column', md: 'row' }}
            divider={<StackDivider borderColor='base.500' />}
          >
            <Vault />
            <Proposals />
            <Profile />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

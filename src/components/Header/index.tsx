import { useEffect } from 'react';
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

// Stacks
import { useCurrentStxAddress } from '@micro-stacks/react';

// Utils
import { ustxToStx } from '@common/helpers';

// Components
import { Stat } from '@components/Stat';
import { SafeSuspense } from '@components/SafeSuspense';

// Hooks
import {
  useBalance,
  useBlocks,
  useOrganization,
  useProposals,
  useVotingExtension,
} from '@common/hooks';

export const Header = () => {
  const currentStxAddress = useCurrentStxAddress();
  const { organization } = useOrganization();
  const { balance } = useBalance();
  const { proposals } = useProposals();
  const { currentBlockHeight } = useBlocks();
  const { isLoading, votingWeight } = useVotingExtension();

  useEffect(() => {
    console.log('Header');
  }, [currentStxAddress]);

  const Vault = () => {
    const { stx, non_fungible_tokens, fungible_tokens } = balance;
    const fungibleTokens = Object.assign({}, fungible_tokens);
    const nonFungibleTokens = Object.assign({}, non_fungible_tokens);
    return (
      <Stat
        flex='1'
        _first={{ pl: '0' }}
        _last={{ borderRightWidth: '0' }}
        borderColor='base.500'
        borderRightWidth='1px'
        label='Vault'
        value={`${ustxToStx(stx?.balance)} STX`}
        info={`${Object.values(fungibleTokens)?.length} tokens & ${
          Object.values(nonFungibleTokens)?.length
        } NFTs`}
        path='vault'
      />
    );
  };

  const Proposals = () => {
    const proposalSize = proposals?.length;
    const activeProposals = proposals?.filter(
      (proposal: any) =>
        currentBlockHeight >= proposal?.startBlockHeight.toString(),
    );
    return (
      <Stat
        flex='1'
        _first={{ pl: '0' }}
        _last={{ borderRightWidth: '0' }}
        borderColor='base.500'
        borderRightWidth='1px'
        label='Proposals'
        value={proposalSize.toString()}
        info={`${activeProposals.length} active`}
        path='governance'
      />
    );
  };

  const Profile = () => {
    // const { results: proposalEvents } = events;
    return (
      <Stat
        flex='1'
        _first={{ pl: '0' }}
        _last={{ borderRightWidth: '0' }}
        borderColor='base.500'
        borderRightWidth='1px'
        label='Voting power'
        value={votingWeight.toString()}
        info={`> 1.5% required`}
        path='delegates'
      />
    );
  };

  // if (isLoading) {
  //   return <Spinner />;
  // }

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
            <SafeSuspense fallback={<Spinner />}>
              <Vault />
              <Proposals />
              <Profile />
            </SafeSuspense>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

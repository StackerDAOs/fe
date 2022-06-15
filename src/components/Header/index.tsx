import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Container,
  Heading,
  HStack,
  Stack,
  Spinner,
  VStack,
} from '@chakra-ui/react';

// Utils
import { ustxToStx, convertToken } from '@common/helpers';
import Avatar from 'boring-avatars';

// Components
import { EmptyState } from '@components/EmptyState';
import { Stat } from '@components/Stat';

// Hooks
import { useBalance, useOrganization, useGovernanceToken } from '@common/hooks';
import { useSelect } from 'react-supabase';

export const Header = () => {
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { isLoading: isLoadingBalance, balance } = useBalance({
    organization: organization,
  });
  const { balance: userBalance } = useGovernanceToken({
    organization: organization,
  });
  const [{ data }] = useSelect('Proposals');

  const Vault = () => {
    const { stx } = balance as any;
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Vault'
        value={`${ustxToStx(stx?.balance) || 0}`}
        assetSymbol='STX'
        info={`Total balance`}
        path='vault'
      />
    );
  };

  const Proposals = () => {
    const proposalSize = data?.filter(
      (proposal) => !proposal.submitted,
    )?.length;
    return (
      <Stat
        flex='1'
        borderRadius='lg'
        label='Proposals'
        value={proposalSize?.toString()}
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
    return (
      <EmptyState
        heading='Unable to load balance'
        linkTo={`/d/${dao}/proposals/create/transfer`}
        buttonTitle='Try again'
      />
    );
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
            <Link href={`/d/${dao}`}>
              <a>
                <HStack align='baseline'>
                  <Avatar
                    size={40}
                    name={organization?.name}
                    variant='marble'
                    colors={[
                      '#50DDC3',
                      '#624AF2',
                      '#EB00FF',
                      '#7301FA',
                      '#25C2A0',
                    ]}
                  />
                  <Heading
                    size='lg'
                    pb='2'
                    fontWeight='semibold'
                    color='light.900'
                  >
                    {organization?.name}
                  </Heading>
                  {/* <Text
                    as='span'
                    pl='1'
                    fontSize='3xl'
                    color='gray.900'
                    fontWeight='regular'
                  >
                    DAO
                  </Text> */}
                </HStack>
              </a>
            </Link>
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

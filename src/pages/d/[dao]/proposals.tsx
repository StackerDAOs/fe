import { useRouter } from 'next/router';
import {
  Box,
  ButtonGroup,
  Icon,
  IconButton,
  Stack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

// Hooks
import { useOrganization, useMempool, useProposals } from '@common/hooks';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { EmptyState } from '@components/EmptyState';
import { Header } from '@components/Header';
import { ProposalCard } from '@components/cards';
import { Wrapper } from '@components/Wrapper';

//  Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';
import { SectionHeader } from '@components/SectionHeader';

// Icons
import { FaEllipsisH, FaPlusCircle } from 'react-icons/fa';

const MotionGrid = motion(SimpleGrid);
const MotionProposalCard = motion(ProposalCard);

const Proposals = () => {
  const router = useRouter();
  const { dao } = router.query as any;
  const { organization } = useOrganization({ name: dao });
  const { isLoading, proposals } = useProposals({ organization });
  const { transactions } = useMempool({ organization, extensionName: 'Vault' });

  console.log({ transactions });

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Wrapper>
        {isLoading ? (
          <Stack></Stack>
        ) : proposals?.length === 0 ? (
          <>
            <SectionHeader justify='space-between' align='center' color='white'>
              <Box>
                <Text fontSize='lg' fontWeight='medium'>
                  Proposals
                </Text>
                <Text color='gray.900' fontSize='sm'>
                  View all pending, active, and completed proposals.
                </Text>
              </Box>
              <ButtonGroup bg='base.900' borderRadius='lg' p='1' spacing='2'>
                <Stack align='center' direction='row' spacing='3'>
                  <IconButton
                    aria-label='action-item'
                    bg='base.800'
                    variant='outline'
                    color='light.900'
                    borderColor='base.500'
                    size='md'
                    icon={
                      <Icon
                        as={FaPlusCircle}
                        color='whiteAlpha'
                        fontSize='sm'
                      />
                    }
                    _hover={{
                      bg: 'base.800',
                    }}
                  />
                  <IconButton
                    aria-label='action-item'
                    bg='base.800'
                    variant='outline'
                    color='light.900'
                    borderColor='base.500'
                    size='md'
                    icon={
                      <Icon as={FaEllipsisH} color='whiteAlpha' fontSize='sm' />
                    }
                    _hover={{
                      bg: 'base.800',
                    }}
                  />
                </Stack>
              </ButtonGroup>
            </SectionHeader>
            <EmptyState
              heading='No proposals found.'
              linkTo={`/d/${dao}/proposals/c/survey`}
              buttonTitle='Create proposal'
              isDisabled={false}
            />
          </>
        ) : (
          <>
            <SectionHeader justify='space-between' align='center' color='white'>
              <Box>
                <Text fontSize='lg' fontWeight='medium'>
                  Proposals
                </Text>
                <Text color='gray.900' fontSize='sm'>
                  View all pending, active, and completed proposals.
                </Text>
              </Box>
              <ButtonGroup bg='base.900' borderRadius='lg' p='1' spacing='2'>
                <Stack align='center' direction='row' spacing='3'>
                  <IconButton
                    aria-label='action-item'
                    bg='base.800'
                    variant='outline'
                    color='light.900'
                    borderColor='base.500'
                    size='md'
                    icon={
                      <Icon
                        as={FaPlusCircle}
                        color='whiteAlpha'
                        fontSize='sm'
                      />
                    }
                    _hover={{
                      bg: 'base.800',
                    }}
                  />
                  <IconButton
                    aria-label='action-item'
                    bg='base.800'
                    variant='outline'
                    color='light.900'
                    borderColor='base.500'
                    size='md'
                    icon={
                      <Icon as={FaEllipsisH} color='whiteAlpha' fontSize='sm' />
                    }
                    _hover={{
                      bg: 'base.800',
                    }}
                  />
                </Stack>
              </ButtonGroup>
            </SectionHeader>

            <MotionGrid
              variants={FADE_IN_VARIANTS}
              initial={FADE_IN_VARIANTS.hidden}
              animate={FADE_IN_VARIANTS.enter}
              exit={FADE_IN_VARIANTS.exit}
              transition={{ duration: 0.75, type: 'linear' }}
              columns={{ base: 1, md: 3 }}
              spacing='6'
              color='white'
            >
              {proposals?.map((data: any, index: number) => (
                <MotionProposalCard
                  variants={{
                    hidden: { opacity: 0 },
                    enter: { opacity: 1 },
                  }}
                  key={index}
                  {...data}
                />
              ))}
            </MotionGrid>
          </>
        )}
      </Wrapper>
    </motion.div>
  );
};

Proposals.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Proposals;

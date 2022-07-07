import {
  Box,
  ButtonGroup,
  Icon,
  IconButton,
  Stack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { EmptyState } from '@components/EmptyState';
import { Header } from '@components/Header';
import { ProposalCard } from '@components/cards';
import { Wrapper } from '@components/Wrapper';

// Queries
import { useProposals } from '@common/queries';

//  Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';
import { SectionHeader } from '@components/SectionHeader';

// Icons
import { FaArrowRight, FaEllipsisH, FaPlusCircle } from 'react-icons/fa';
import { SocialProposalModal } from '@components/Modal/SocialProposalModal';

const MotionGrid = motion(SimpleGrid);
const MotionProposalCard = motion(ProposalCard);

const Proposals = () => {
  const { isLoading, proposals } = useProposals();

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.25, type: 'linear' }}
    >
      <Wrapper>
        {isLoading ? (
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
                <SocialProposalModal
                  icon={
                    <Icon as={FaPlusCircle} color='whiteAlpha' fontSize='sm' />
                  }
                />
                <IconButton
                  display='none'
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
                  <SocialProposalModal
                    icon={
                      <Icon
                        as={FaPlusCircle}
                        color='whiteAlpha'
                        fontSize='sm'
                      />
                    }
                  />
                  <IconButton
                    display='none'
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
            <EmptyState heading='No proposals found.' />
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
                  <SocialProposalModal
                    icon={
                      <Icon
                        as={FaPlusCircle}
                        color='whiteAlpha'
                        fontSize='md'
                      />
                    }
                  />
                  <IconButton
                    display='none'
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
              transition={{ duration: 0.5, type: 'linear' }}
              columns={{ base: 1, md: 3 }}
              spacing='6'
              color='white'
            >
              {proposals?.map(({ data }: any, index: number) => (
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
            <SectionHeader justify='flex-end'>
              <Stack>
                <IconButton
                  display='none'
                  aria-label='action-item'
                  bg='base.800'
                  variant='outline'
                  color='light.900'
                  borderColor='base.500'
                  size='md'
                  icon={
                    <Icon as={FaArrowRight} color='whiteAlpha' fontSize='sm' />
                  }
                  _hover={{
                    bg: 'base.800',
                  }}
                />
              </Stack>
            </SectionHeader>
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

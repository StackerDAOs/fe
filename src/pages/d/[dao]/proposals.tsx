import React from 'react';
import {
  Heading,
  Radio,
  RadioGroup,
  Stack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/layouts';
import { EmptyState } from '@components/misc';
import { Header } from '@components/headers';
import { ProposalCard } from '@components/cards';
import { Wrapper } from '@components/containers';

// Queries
import { useProposals } from '@lib/hooks';

import { capitalize, isEmpty, map } from 'lodash';

//  Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@lib/animation';
import { SectionHeader } from '@components/containers';

const MotionGrid = motion(SimpleGrid);
const MotionProposalCard = motion(ProposalCard);

const Proposals = () => {
  const [filter, setFilter] = React.useState('all');
  const { data: proposals } = useProposals(filter);

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.25, type: 'linear' }}
    >
      <Wrapper>
        <Stack spacing='1'>
          <SectionHeader
            justify={{ base: 'flex-start', md: 'space-between' }}
            align={{ base: 'flex-start', md: 'space-between' }}
            color='white'
          >
            <Stack spacing='3'>
              <Text fontSize='md' fontWeight='light' color='gray.900'>
                Discover ideas
              </Text>
              <Heading mt='0 !important' size='sm' fontWeight='regular'>
                Proposals
              </Heading>
            </Stack>
            <Stack align='center' direction='row' spacing='3'>
              <RadioGroup onChange={setFilter} value={filter}>
                <Stack direction='row'>
                  {map(['all', 'active', 'executed'], (filter: string) => (
                    <Radio
                      bg='base.900'
                      size='md'
                      borderColor='base.500'
                      value={filter}
                      _focus={{ outline: 'none' }}
                      _checked={{
                        bg: 'secondary.900',
                        color: 'white',
                        borderColor: 'base.500',
                      }}
                    >
                      {capitalize(filter)}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Stack>
          </SectionHeader>
          {isEmpty(proposals) ? (
            <EmptyState heading='No proposals found' />
          ) : (
            <MotionGrid
              variants={FADE_IN_VARIANTS}
              initial={FADE_IN_VARIANTS.hidden}
              animate={FADE_IN_VARIANTS.enter}
              exit={FADE_IN_VARIANTS.exit}
              transition={{ duration: 0.5, type: 'linear' }}
              columns={{ base: 1, md: 3 }}
              spacing='3'
              color='white'
            >
              {map(proposals, (proposal: any, index: number) => (
                <MotionProposalCard
                  variants={{
                    hidden: { opacity: 0 },
                    enter: { opacity: 1 },
                  }}
                  key={index}
                  {...proposal}
                />
              ))}
            </MotionGrid>
          )}
        </Stack>
      </Wrapper>
    </motion.div>
  );
};

Proposals.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Proposals;

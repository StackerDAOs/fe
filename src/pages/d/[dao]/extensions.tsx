import React from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/layouts';
import { Header } from '@components/headers';
import { SectionHeader } from '@components/containers';
import { Wrapper } from '@components/containers';

//  Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@lib/animation';

const Extensions = () => {
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
                Explore Contracts
              </Text>
              <Heading mt='0 !important' size='sm' fontWeight='regular'>
                Browse Extensions
              </Heading>
            </Stack>
          </SectionHeader>
        </Stack>
      </Wrapper>
    </motion.div>
  );
};

Extensions.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Extensions;

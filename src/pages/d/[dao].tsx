import React from 'react';
import {
  ButtonGroup,
  Heading,
  Stack,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/layouts';
import { AssetTable } from '@components/tables';
import { Header } from '@components/headers';
import { SectionHeader } from '@components/containers';
import { Wrapper } from '@components/containers';

import { map } from 'lodash';

//  Animation
import { motion } from 'framer-motion';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const Dashboard = () => {
  const [tab, setTab] = React.useState('Tokens');
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
                {tab}
              </Text>
              <Heading mt='0 !important' size='sm' fontWeight='regular'>
                Manage Assets
              </Heading>
            </Stack>
          </SectionHeader>
          <Tabs
            color='white'
            variant='unstyled'
            onChange={(tabIndex: number) =>
              setTab(['Tokens', 'Collectibles'][tabIndex])
            }
          >
            <TabList>
              <ButtonGroup bg='base.800' borderRadius='lg' p='1'>
                {map(['Tokens', 'Collectibles'], (item) => (
                  <Tab
                    key={item}
                    fontSize='md'
                    borderRadius='lg'
                    color='gray.900'
                    px='5'
                    w='50%'
                    _selected={{ bg: 'base.500', color: 'light.900' }}
                  >
                    {item}
                  </Tab>
                ))}
              </ButtonGroup>
            </TabList>
            <TabPanels>
              <TabPanel px='0'>
                <motion.div
                  variants={FADE_IN_VARIANTS}
                  initial={FADE_IN_VARIANTS.hidden}
                  animate={FADE_IN_VARIANTS.enter}
                  exit={FADE_IN_VARIANTS.exit}
                  transition={{ duration: 0.25, type: 'linear' }}
                >
                  <AssetTable color='light.900' size='md' type='fungible' />
                </motion.div>
              </TabPanel>
              <TabPanel px='0'>
                <motion.div
                  variants={FADE_IN_VARIANTS}
                  initial={FADE_IN_VARIANTS.hidden}
                  animate={FADE_IN_VARIANTS.enter}
                  exit={FADE_IN_VARIANTS.exit}
                  transition={{ duration: 0.25, type: 'linear' }}
                >
                  <AssetTable color='light.900' size='md' type='nonFungible' />
                </motion.div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Wrapper>
    </motion.div>
  );
};

Dashboard.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Dashboard;

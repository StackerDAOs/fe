import React from 'react';
import {
  Box,
  ButtonGroup,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Text,
} from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/layouts';
import { Header } from '@components/headers';
import { AssetTable } from '@components/tables';
import { SectionHeader } from '@components/containers';
import { Wrapper } from '@components/containers';

// Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from 'lib/animation';

const DAODashboard = () => {
  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 1, type: 'linear' }}
    >
      <Wrapper>
        <SectionHeader justify='flex-start' align='center' color='white'>
          <Box>
            <Text fontSize='lg' fontWeight='medium'>
              Assets
            </Text>
            <Text color='gray.900' fontSize='sm'>
              List of shared assets owned by the DAO
            </Text>
          </Box>
        </SectionHeader>

        <Tabs color='white' variant='unstyled'>
          <TabList>
            <ButtonGroup bg='base.800' borderRadius='lg' p='1'>
              {['Coins', 'Collectibles'].map((item) => (
                <Tab
                  key={item}
                  fontSize='sm'
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
              <AssetTable color='light.900' size='md' type='fungible' />
            </TabPanel>
            <TabPanel px='0'>
              <AssetTable color='light.900' size='md' type='nonFungible' />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Wrapper>
    </motion.div>
  );
};

DAODashboard.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default DAODashboard;

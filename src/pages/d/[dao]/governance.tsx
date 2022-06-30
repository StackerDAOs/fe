import {
  Stack,
  ButtonGroup,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { AssetTable } from '@components/AssetTable';
import { DelegateCard } from '@components/cards';
import { Header } from '@components/Header';
import { Wrapper } from '@components/Wrapper';

//  Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

const Governance = () => {
  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Wrapper>
        <motion.div
          variants={FADE_IN_VARIANTS}
          initial={FADE_IN_VARIANTS.hidden}
          animate={FADE_IN_VARIANTS.enter}
          exit={FADE_IN_VARIANTS.exit}
          transition={{ duration: 0.75, type: 'linear' }}
        >
          <Stack spacing={{ base: '8', lg: '6' }}>
            <Stack w='auto' mb='10'>
              <DelegateCard />
            </Stack>
          </Stack>
          <Tabs color='white' variant='unstyled' display='none'>
            <TabList>
              <ButtonGroup bg='base.800' borderRadius='lg' p='1'>
                {['Delegates', 'Activity'].map((item) => (
                  <Tab
                    key={item}
                    fontSize='sm'
                    borderRadius='lg'
                    color='gray.900'
                    px='5'
                    isFullWidth
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
                  <AssetTable color='light.900' size='lg' type='fungible' />
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
                  <AssetTable color='light.900' size='lg' type='nonFungible' />
                </motion.div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </motion.div>
      </Wrapper>
    </motion.div>
  );
};

Governance.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Governance;

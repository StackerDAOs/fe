import {
  Box,
  ButtonGroup,
  Icon,
  IconButton,
  Stack,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { AssetTable } from '@components/AssetTable';
import { Header } from '@components/Header';
import { SectionHeader } from '@components/SectionHeader';
import { Wrapper } from '@components/Wrapper';

//  Animation
import { motion } from 'framer-motion';

// Icons
import { FaEllipsisH } from 'react-icons/fa';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const Vault = () => {
  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 1, type: 'linear' }}
    >
      <Wrapper>
        <SectionHeader justify='space-between' align='center' color='white'>
          <Box>
            <Text fontSize='lg' fontWeight='medium'>
              Assets
            </Text>
            <Text color='gray.900' fontSize='sm'>
              View and initiate proposals from a list of assets managed by the
              DAO
            </Text>
          </Box>
          <ButtonGroup bg='base.900' borderRadius='lg' p='1' spacing='2'>
            <Stack align='center' direction='row' spacing='3'>
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
      </Wrapper>
    </motion.div>
  );
};

Vault.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Vault;

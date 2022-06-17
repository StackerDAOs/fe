import {
  Box,
  ButtonGroup,
  Container,
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
import { VaultActionPopover } from '@components/VaultActionPopover';

//  Animation
import { motion } from 'framer-motion';

const Vault = () => {
  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  };

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Box as='section'>
        <Container maxW='5xl'>
          <Stack spacing={{ base: '8', lg: '6' }}>
            <Stack w='auto'>
              <Box as='section'>
                <Container>
                  <Stack spacing='5'>
                    <Stack
                      spacing='4'
                      mb='3'
                      direction={{ base: 'column', md: 'row' }}
                      justify='space-between'
                      color='white'
                    >
                      <Box>
                        <Text fontSize='2xl' fontWeight='medium'>
                          Assets
                        </Text>
                        <Text color='gray.900' fontSize='sm'>
                          List of shared assets owned by the DAO.
                        </Text>
                      </Box>
                      {/* <VaultActionPopover /> */}
                    </Stack>
                  </Stack>
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
                          <AssetTable
                            color='light.900'
                            size='lg'
                            type='fungible'
                          />
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
                          <AssetTable
                            color='light.900'
                            size='lg'
                            type='nonFungible'
                          />
                        </motion.div>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Container>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

Vault.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default Vault;

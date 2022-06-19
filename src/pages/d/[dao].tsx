import {
  Box,
  ButtonGroup,
  Container,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Text,
} from '@chakra-ui/react';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { Header } from '@components/Header';
import { AssetTable } from '@components/AssetTable';

//  Animation
import { motion } from 'framer-motion';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const DAODashboard = () => {
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
            <Container>
              <Stack spacing='5'>
                <Stack
                  spacing='4'
                  my='3'
                  direction={{ base: 'column', md: 'row' }}
                  justify='space-between'
                  align='flex-end'
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
                  {/* <Link href={`/d/${dao}/vault`}>
                    <Text
                      as='a'
                      cursor='pointer'
                      color='gray.900'
                      fontSize='sm'
                      fontWeight='regular'
                      textDecoration='underline'
                    >
                      View more
                    </Text>
                  </Link> */}
                </Stack>
              </Stack>
              <motion.div
                variants={FADE_IN_VARIANTS}
                initial={FADE_IN_VARIANTS.hidden}
                animate={FADE_IN_VARIANTS.enter}
                exit={FADE_IN_VARIANTS.exit}
                transition={{ duration: 0.25, type: 'linear' }}
              >
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
              </motion.div>
            </Container>
          </Stack>
        </Container>
      </Box>
    </motion.div>
  );
};

DAODashboard.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default DAODashboard;

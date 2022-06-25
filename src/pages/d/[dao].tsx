import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  HStack,
  Image,
  Input,
  Stack,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Text,
  VStack,
} from '@chakra-ui/react';

// Web3
import { useUser, useNetwork } from '@micro-stacks/react';
import { fetchAccountStxBalance } from 'micro-stacks/api';

// Components
import { AppLayout } from '@components/Layout/AppLayout';
import { Card } from '@components/Card';
import { Header } from '@components/Header';
import { AssetTable } from '@components/AssetTable';
import { DepositButton } from '@components/Actions';

// Charts
import { BarChart } from '@components/Chart';

//  Animation
import { motion } from 'framer-motion';

// Utils
import { ustxToStx } from '@common/helpers';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const DAODashboard = () => {
  const [balance, setBalance] = useState<string | undefined>('');
  const [depositAmount, setDepositAmount] = useState('');
  const { network } = useNetwork();
  const { currentStxAddress } = useUser();
  useEffect(() => {
    const fetch = async () => {
      if (currentStxAddress) {
        try {
          const data = await fetchAccountStxBalance({
            url: network.getCoreApiUrl(),
            principal: currentStxAddress || '',
          });
          const balance = data?.balance?.toString() || '0';
          setBalance(ustxToStx(balance));
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetch();
  }, []);

  const handleInputDeposit = (e: any) => {
    const re = /^[0-9.\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setDepositAmount(e.target.value);
    }
  };

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Container maxW='5xl'>
        <Stack spacing={{ base: '8', lg: '6' }}>
          <Container>
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              spacing='10'
              align='space-between'
              justify='space-between'
              my='6'
            >
              <Stack>
                <Stack spacing='5'>
                  <Stack
                    spacing='4'
                    direction={{ base: 'column', md: 'row' }}
                    justify='space-between'
                    alignItems='center'
                    color='white'
                  >
                    <Box>
                      <Text fontSize='lg' fontWeight='medium'>
                        Activity
                      </Text>
                      <Text color='gray.900' fontSize='sm'>
                        View the latest proposal activity.
                      </Text>
                    </Box>
                  </Stack>
                </Stack>
                <BarChart />
              </Stack>
              <Stack>
                <Card bg='base.900'>
                  <Stack spacing='0'>
                    <Stack
                      align='flex-start'
                      bg='base.800'
                      borderRadius='lg'
                      px={{ base: '6', md: '6' }}
                      py={{ base: '3', md: '3' }}
                    >
                      <Text color='light.900' fontSize='md' fontWeight='medium'>
                        Deposit
                      </Text>
                    </Stack>
                    <Stack
                      px={{ base: '6', md: '6' }}
                      py={{ base: '6', md: '6' }}
                      spacing='6'
                    >
                      <HStack
                        justify='space-between'
                        align='center'
                        spacing='2'
                      >
                        <VStack align='flex-start' spacing='0'>
                          <FormControl>
                            <Input
                              color='light.900'
                              py='1'
                              px='2'
                              maxW='8em'
                              type='tel'
                              bg='base.900'
                              border='none'
                              fontSize='2xl'
                              autoComplete='off'
                              placeholder='0'
                              value={depositAmount}
                              onInput={handleInputDeposit}
                              _focus={{
                                border: 'none',
                              }}
                            />
                          </FormControl>
                          <HStack px='2'>
                            <Image
                              cursor='pointer'
                              height='15px'
                              src='https://cryptologos.cc/logos/stacks-stx-logo.png?v=022'
                              alt='logo'
                            />

                            <Text
                              fontSize='md'
                              fontWeight='regular'
                              color='gray.900'
                            >
                              STX
                            </Text>
                          </HStack>
                        </VStack>

                        <HStack>
                          <Button
                            color='white'
                            bg='base.800'
                            size='sm'
                            _hover={{ opacity: 0.9 }}
                            _active={{ opacity: 1 }}
                          >
                            Max
                          </Button>
                        </HStack>
                      </HStack>
                      <Stack w='100%'>
                        <DepositButton title='Deposit' amount={depositAmount} />
                        <Text
                          color='gray.900'
                          textAlign='center'
                          fontSize='sm'
                          fontWeight='regular'
                        >
                          Your wallet balance: {balance} STX
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            </SimpleGrid>
            <Stack spacing='5'>
              <Stack
                spacing='4'
                my='6'
                direction={{ base: 'column', md: 'row' }}
                justify='space-between'
                alignItems='center'
                color='white'
              >
                <Box>
                  <Text fontSize='lg' fontWeight='medium'>
                    Assets
                  </Text>
                  <Text color='gray.900' fontSize='sm'>
                    List of shared assets owned by the DAO
                  </Text>
                </Box>
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
    </motion.div>
  );
};

DAODashboard.getLayout = (page: any) => {
  return <AppLayout header={<Header />}>{page}</AppLayout>;
};

export default DAODashboard;

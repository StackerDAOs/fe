import { useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';

import { useUser, useNetwork } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { standardPrincipalCV } from 'micro-stacks/clarity';

// import { StacksMocknet } from 'micro-stacks/network';
// import { fetchTransactionsList } from 'micro-stacks/api';

const Index = () => {
  const { currentStxAddress } = useUser();
  const { network } = useNetwork();

  useEffect(() => {
    async function fetchData() {
      try {
        const balance = await fetchReadOnlyFunction({
          network,
          contractAddress: 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
          contractName: 'miamicoin-token',
          senderAddress: currentStxAddress,
          functionArgs: [
            standardPrincipalCV(
              currentStxAddress || 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
            ),
          ],
          functionName: 'get-balance',
        });
        console.log({ balance });
      } catch (error) {
        console.log({ error });
      }
    }
    fetchData();
  }, [currentStxAddress, network]);

  const SLIDE_UP_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 15 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -15 },
  };

  const SLIDE_UP_BUTTON_VARIANTS = {
    hidden: { opacity: 0, x: 0, y: 15 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -15 },
  };

  return (
    <motion.div
      variants={SLIDE_UP_VARIANTS}
      initial={SLIDE_UP_VARIANTS.hidden}
      animate={SLIDE_UP_VARIANTS.enter}
      exit={SLIDE_UP_VARIANTS.exit}
      transition={{ duration: 0.75, type: 'linear' }}
    >
      <Box
        as='section'
        height='95vh'
        display='flex'
        alignItems='center'
        color='white'
      >
        <Box
          maxW={{ base: 'xl', md: '5xl' }}
          mx='auto'
          px={{ base: '6', md: '8' }}
        >
          <Box textAlign='center'>
            <Stack spacing={{ base: '4', md: '5' }} p='5' align='center'>
              <Image height='85px' src='./img/logo-only.png' alt='logo' />
            </Stack>
            <Heading
              as='h1'
              size='md'
              fontWeight='extrabold'
              maxW='48rem'
              mx='auto'
              lineHeight='1.2'
              letterSpacing='tight'
              color={mode('base.900', 'light.900')}
            >
              Build your community on {''}
              <Text
                as='span'
                mt='4'
                maxW='xl'
                mx='auto'
                color={mode('base.900', 'light.900')}
                bgGradient={mode(
                  'linear(to-br, secondary.900, secondaryGradient.900)',
                  'linear(to-br, primaryGradient.900, primary.900)',
                )}
                bgClip='text'
              >
                Bitcoin
              </Text>
            </Heading>
            <Link href={{ pathname: '/communities/get-started' }}>
              <motion.div
                variants={SLIDE_UP_BUTTON_VARIANTS}
                initial={SLIDE_UP_BUTTON_VARIANTS.hidden}
                animate={SLIDE_UP_BUTTON_VARIANTS.enter}
                exit={SLIDE_UP_BUTTON_VARIANTS.exit}
                transition={{ duration: 0.8, type: 'linear' }}
              >
                <Button
                  color='white'
                  bgGradient={mode(
                    'linear(to-br, secondaryGradient.900, secondary.900)',
                    'linear(to-br, primaryGradient.900, primary.900)',
                  )}
                  px='8'
                  my='8'
                  size='lg'
                  fontSize='lg'
                  fontWeight='bold'
                  _hover={{ opacity: 0.9 }}
                  _active={{ opacity: 1 }}
                >
                  Get started
                </Button>
              </motion.div>
            </Link>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Index;

import React from 'react';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { withMicroStacks } from 'common';

// Framer
import { AnimatePresence } from 'framer-motion';

import theme from 'theme';

function App({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page);
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Head>
        <title>StackerDAOs</title>
        <meta name='description' content='StackerDAOs' />
      </Head>
      <AnimatePresence
        exitBeforeEnter
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        {getLayout(<Component {...pageProps} />)}
      </AnimatePresence>
    </ChakraProvider>
  );
}

export default withMicroStacks(App);

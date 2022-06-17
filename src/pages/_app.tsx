import React from 'react';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { withMicroStacks } from 'common';
import { Provider } from 'react-supabase';
import { supabase } from '@utils/supabase';

// Framer
import { AnimatePresence } from 'framer-motion';

import theme from 'theme';

function App({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page);
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Provider value={supabase}>
        <Head>
          <title>StackerDAO Labs</title>
          <meta name='description' content='StackerDAO Labs' />
        </Head>
        <AnimatePresence
          exitBeforeEnter
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          {getLayout(<Component {...pageProps} />)}
        </AnimatePresence>
      </Provider>
    </ChakraProvider>
  );
}

export default withMicroStacks(App);

import React from 'react';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { withMicroStacks } from 'common';
import { Provider } from 'react-supabase';
import { supabase } from '@utils/supabase';
import ErrorBoundary from '@components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import theme from 'theme';

const queryClient = new QueryClient();

function App({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page);
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Provider value={supabase}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Head>
            <title>StackerDAO Labs</title>
            <meta name='description' content='StackerDAO Labs' />
          </Head>
          <AnimatePresence
            exitBeforeEnter
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <ErrorBoundary>
              {getLayout(<Component {...pageProps} />)}
            </ErrorBoundary>
          </AnimatePresence>
        </QueryClientProvider>
      </Provider>
    </ChakraProvider>
  );
}

export default withMicroStacks(App);

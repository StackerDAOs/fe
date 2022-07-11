import React from 'react';
import Head from 'next/head';
import { ClientProvider } from '@micro-stacks/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-supabase';
import { supabase } from '@utils/supabase';
import ErrorBoundary from '@components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { StacksMocknet } from 'micro-stacks/network';
import { devnet, appDetails } from '@common/constants';
import theme from 'theme';

const queryClient = new QueryClient();
const network = new StacksMocknet();

function App({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page);
  return (
    <ClientProvider
      appName={appDetails.name}
      appIconUrl={appDetails.icon}
      network={devnet ? network : 'mainnet'}
    >
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
    </ClientProvider>
  );
}

export default App;

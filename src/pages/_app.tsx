import React from 'react';
import Head from 'next/head';
import { ClientProvider } from '@micro-stacks/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-supabase';
import { supabase } from 'lib/supabase';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { StacksMocknet } from 'micro-stacks/network';
import { devnet, appDetails } from '@common/constants';
import theme from 'theme';

const devNetwork = new StacksMocknet();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 120000 },
  },
});

function App({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page);
  return (
    <ClientProvider
      appName={appDetails.name}
      appIconUrl={appDetails.icon}
      network={devnet ? devNetwork : 'mainnet'}
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
              {getLayout(<Component {...pageProps} />)}
            </AnimatePresence>
          </QueryClientProvider>
        </Provider>
      </ChakraProvider>
    </ClientProvider>
  );
}

export default App;

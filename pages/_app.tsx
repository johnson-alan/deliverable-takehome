import '@/styles/globals.css';

import type { AppProps } from 'next/app';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import Layout from '@/components/Layout';
import { SearchProvider } from '@/lib/contexts/SearchContext';

export default function App({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <SearchProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SearchProvider>
    </QueryClientProvider>
  );
}

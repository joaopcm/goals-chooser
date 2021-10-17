import type { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from '../styles/theme';
import Header from '../components/Header'
import Container from '../components/Container'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Container>
        <Component {...pageProps} />
      </Container>
    </ChakraProvider>
  );
}

export default MyApp;
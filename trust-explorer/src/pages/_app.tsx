import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { extendTheme } from "@chakra-ui/react";
import { MetaMaskSDK } from "@metamask/sdk";

export const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Trust Explorer",
    url: "https://trustexplorer.io/favicon.ico",
  },
});
export const ethereum = MMSDK.getProvider();
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

export const theme = extendTheme({
  colors,
  fonts: {
    heading: "var(--font-rubik)",
    body: "var(--font-rubik)",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

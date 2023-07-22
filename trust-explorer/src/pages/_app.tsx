import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { extendTheme } from "@chakra-ui/react";
import { MetaMaskProvider } from "../hooks/useMetamask";
import { SdkLayout } from "../component/SdkProvider";
import Header from "../component/Header";

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
    <MetaMaskProvider>
      <SdkLayout>
        <ChakraProvider theme={theme}>
          <Header />
          <Component {...pageProps} />
        </ChakraProvider>
      </SdkLayout>
    </MetaMaskProvider>
  );
}

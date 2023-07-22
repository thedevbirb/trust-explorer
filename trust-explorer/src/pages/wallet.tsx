import { Box } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { MMSDK, ethereum } from "./_app";

export default function Wallet({ Component, pageProps }: AppProps) {
  const res = ethereum.request({ method: "eth_requestAccounts", params: [] });
  const wallet = ethereum.chainId;
  console.log(wallet);
  return (
    <Box
      bgGradient="linear(to-r, pink.700, blue.600)"
      width="full"
      minHeight={"100vh"}
      h={"100%"}
    >
      <Box
        p={4}
        fontSize={32}
        bgGradient="linear(to-r, green.200, pink.500)"
        margin={"auto"}
        width={"fit-content"}
      >
        Connect Wallet
      </Box>
    </Box>
  );
}

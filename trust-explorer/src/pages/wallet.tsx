import { Box, Flex, Text } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useMetaMask } from "../hooks/useMetamask";
import { useListen } from "../hooks/useListen";
import Image from "next/image";
import { instantiateSdk } from "../lib/metamaskSDK";
import { useGraph } from "../hooks/useGraph";

export default function Wallet({ Component, pageProps }: AppProps) {
  const {
    dispatch,
    state: { status, isMetaMaskInstalled, wallet },
  } = useMetaMask();
  const listen = useListen();
  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    if (accounts.length > 0) {
      const balance = (await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })) as string;
      dispatch({ type: "connect", wallet: accounts[0], balance });
      listen();
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  return (
    <Box
      p={4}
      bgGradient="linear(to-r, green.200, pink.500)"
      margin={"auto"}
      width={"fit-content"}
      cursor={"pointer"}
      onClick={isConnected ? handleDisconnect : handleConnect}
      rounded={"xl"}
    >
      <Flex>
        <Text
          width={isConnected ? 100 : "fit-content"}
          fontSize={20}
          isTruncated={true}
        >
          {isConnected ? wallet : "Connect Wallet"}
        </Text>
        {isConnected && (
          <Image alt="waifu-connect" src="/waifu.png" width={30} height={6} />
        )}
      </Flex>
    </Box>
  );
}

import { Box } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useMetaMask } from "../hooks/useMetamask";
import { useListen } from "../hooks/useListen";

export default function Wallet({ Component, pageProps }: AppProps) {
  const {
    dispatch,
    state: { status, isMetaMaskInstalled, wallet },
  } = useMetaMask();
  const listen = useListen();
  const showConnectButton =
    status !== "pageNotLoaded" && isMetaMaskInstalled && !wallet;
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

      // we can register an event listener for changes to the users wallet
      listen();
    }
  };

  // can be passed to an onclick handler
  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

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
        cursor={"pointer"}
        onClick={handleConnect}
      >
        {isConnected ? wallet : "Connect Wallet"}
      </Box>
    </Box>
  );
}

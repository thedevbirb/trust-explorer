import { Box, Flex, Text } from "@chakra-ui/react";
import { useMetaMask } from "../hooks/useMetamask";
import { useListen } from "../hooks/useListen";
import Image from "next/image";

export default function Wallet() {
  const {
    dispatch,
    state: { status, wallet },
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
      p={2}
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
          fontSize={16}
          isTruncated={true}
        >
          {isConnected ? wallet : "Connect Wallet"}
        </Text>
        {isConnected && (
          <Image alt="waifu-connect" src="/waifu.png" width={18} height={6} />
        )}
      </Flex>
    </Box>
  );
}

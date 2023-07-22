import { ethers } from "ethers";
import { useMetaMask } from "./useMetamask";
import { Client } from "@xmtp/xmtp-js";

export const useXmtp = () => {
  const {
    state: { wallet },
  } = useMetaMask();

  const getGroupChat = () => {
    const signer = wallet;

    // const xmtp = await Client.create(signer, { env: "dev" });
    // xmtp.enableGroupChat();
  };

  const handleConnect = async () => {
    // Create the client with a `Signer` from your application
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const xmtp = await Client.create(signer, { env: "dev" });
    xmtp.enableGroupChat();

    return;
  };

  return {
    getGroupChat,
    handleConnect,
  };
};

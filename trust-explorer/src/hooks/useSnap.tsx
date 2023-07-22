import detectEthereumProvider from "@metamask/detect-provider";

export const useSnap = () => {
  async function detectSnap() {
    // This resolves to the value of window.ethereum or null
    const provider = await detectEthereumProvider();
    // web3_clientVersion returns the installed MetaMask version as a string
    const isFlask = (
      await (provider as any).request({
        method: "web3_clientVersion",
      })
    )?.includes("flask");

    if (provider && isFlask) {
      console.log("MetaMask Flask successfully detected!");

      // Now you can use Snaps!
    } else {
      console.error("Please install MetaMask Flask!");
    }
  }

  return {
    detectSnap,
  };
};

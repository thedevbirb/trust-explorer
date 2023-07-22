import MetaMaskSDK from "@metamask/sdk";

export const instantiateSdk = () => {
  new MetaMaskSDK({
    dappMetadata: {
      name: "Trust Explorer",
      url: "https://trustexplorer.io",
    },
  });
};

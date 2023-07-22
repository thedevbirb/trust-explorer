import { PropsWithChildren, useEffect } from "react";
import { useListen } from "../hooks/useListen";
import { useMetaMask } from "../hooks/useMetamask";
import { instantiateSdk } from "../lib/metamaskSDK";

export const SdkLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { dispatch } = useMetaMask();
  const listen = useListen();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";

      const isMetaMaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem("metamaskState");

      if (local) listen();

      const { wallet, balance } = local
        ? JSON.parse(local)
        : { wallet: null, balance: null };

      instantiateSdk();
      dispatch({ type: "pageLoaded", isMetaMaskInstalled, wallet, balance });
    }
  }, []);

  return <div>{children}</div>;
};

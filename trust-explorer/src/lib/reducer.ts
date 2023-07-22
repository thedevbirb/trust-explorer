const actions = {
  LOGIN_WALLET: "LOGIN_WALLET",
  LOGOUT_WALLET: "LOGOUT_WALLET",
  CHANGE_NETWORK: "CHANGE_NETWORK",
  SET_CHAIN_ID: "SET_CHAIN_ID",
};

type action = {
  type: string;
  payload?: any;
};

type State = {
  is_connected: boolean;
  account: string | null;
  provider: any | null;
  network_name: string | null;
  chain_id: number | string | null;
};

export const initialState: State = {
  is_connected: false,
  account: "",
  provider: null,
  network_name: null,
  chain_id: null,
};

export const reducer = (state: State, action: action): State => {
  switch (action.type) {
    case actions.LOGIN_WALLET:
      return {
        ...state,
        is_connected: true,
        account: action.payload.account,
        provider: action.payload.provider,
        network_name: action.payload.network_name,
        chain_id: action.payload.chain_id,
      };

    case actions.LOGOUT_WALLET:
      window.localStorage.removeItem("shouldConnectMetamask");
      window.localStorage.removeItem("shouldConnectMagicLink");
      window.localStorage.removeItem("shouldConnectWalletConnect");
      return {
        ...state,
        account: "",
        provider: null,
        chain_id: null,
        network_name: null,
        is_connected: false,
      };

    case actions.CHANGE_NETWORK:
      return {
        ...state,
        provider: action.payload.provider,
        network_name: action.payload.network_name,
        chain_id: action.payload.chain_id,
      };

    case actions.SET_CHAIN_ID:
      return {
        ...state,
        chain_id: action.payload,
      };

    default:
      return state;
  }
};

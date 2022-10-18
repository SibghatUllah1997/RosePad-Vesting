import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const injected = new InjectedConnector({
   supportedChainIds: [1, 3, 4, 5, 42,137, 80001,97, 56, 42261, 42262]
 // supportedChainIds: [56]

});

const walletconnect = new WalletConnectConnector({
  rpcUrl: 'https://emerald.oasis.dev',
  //`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});

const walletlink = new WalletLinkConnector({
  url: 'https://emerald.oasis.dev', 
  //`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: "web3-react-demo"
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink
};

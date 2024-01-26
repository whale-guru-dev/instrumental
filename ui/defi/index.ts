import { DEFI_CONFIG } from "./config";
import { NETWORKS } from "./networks";
// import {userConnectorsByName} from "./connectors";
import { SupportedNetworks } from "./types";
import { ethers } from "ethers";

export const isValidNetwork = (chainId?: number) =>
  DEFI_CONFIG.supportedNetworkIds.includes(chainId as SupportedNetworks);

export const getNetworkName = (chainId: number) =>
  (chainId as SupportedNetworks) in NETWORKS
    ? NETWORKS[chainId as SupportedNetworks].name
    : "Unknown";

export const getNetworkUrl = (chainId: number | undefined) =>
  (chainId as SupportedNetworks) in NETWORKS
    ? NETWORKS[chainId as SupportedNetworks].infoPageUrl
    : "Unknown";

export const getNetworkRpcUrl = (chainId: number | undefined) =>
  (chainId as SupportedNetworks) in NETWORKS
    ? NETWORKS[chainId as SupportedNetworks].rpcUrl
    : "Unknown";

// export const getUserConnectors = () => {
//   return userConnectorsByName;
// };

export const getDefaultWeb3Library = (
  provider: any,
): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider, "any");
  library.pollingInterval = 12000;
  return library; //new multicallProviders.MulticallProvider(library as any)  // library
};

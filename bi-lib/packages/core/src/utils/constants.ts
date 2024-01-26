export const QUERY_NETWORKS = [
  {
    chainId: 1,
    name: "ethereum"
  },
  {
    chainId: 56,
    name: "bsc"
  },
  {
    chainId: 97,
    name: "bsc_testnet"
  },
  {
    chainId: 137,
    name: "matic"
  },
] as const;

export const queryNetworkIds = QUERY_NETWORKS.map((entry: any) => entry.chainId);

export type QueryNetworkChainId = typeof QUERY_NETWORKS[number]['chainId'];
export type QueryNetworkName = typeof QUERY_NETWORKS[number]['name'];

export interface QueryNetwork {
  chainId: QueryNetworkChainId;
  name: QueryNetworkName;
}

export const defaultEmptyFunction = () => console.warn("Empty function")

export function defaultPromiseFunction<T>() {
  return new Promise<T>(() => {
    throw new Error("Not implemented");
  });
}
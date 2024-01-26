import { SupportedAmm } from "../store/supportedTokens/slice";
import { getAmmIconURL, getChainIconURL } from "../store/supportedTokens/utils";

const nativeAddress = "0x0000000000000000000000000000000000000000";

export const ETHERIUM_MAINNET_NETWORK = {
  chainId: 1,
  infoPageUrl: "",
  name: "Mainnet",
  rpcUrl: process.env.RPC_URL_1!,
  nativeToken: {
    chainId: 1,
    address: nativeAddress,
    image: getChainIconURL(1),
    symbol: "ETH",
    name: "ETH",
    decimals: 18,
    crossChainId: "-1",
    provider: "nonNative",
    amms: [],
  },
  neededConfirmations: 35,
} as const;

const KOVAN_NETWORK = {
  chainId: 42,
  infoPageUrl: "https://kovan.etherscan.io/tx/",
  name: "Kovan",
  rpcUrl: process.env.RPC_URL_42!,
  nativeToken: {
    chainId: 42,
    address: nativeAddress,
    image: getChainIconURL(42),
    symbol: "ETH",
    decimals: 18,
    crossChainId: "-1",
    amms: [],
    name: "ETH",
    provider: "nonNative",
  },
  neededConfirmations: 30,
} as const;

const RINKEBY_NETWORK = {
  chainId: 4,
  infoPageUrl: "https://rinkeby.etherscan.io/tx/",
  name: "Rinkeby",
  rpcUrl: process.env.RPC_URL_4!,
  nativeToken: {
    chainId: 4,
    address: nativeAddress,
    image: getChainIconURL(4),
    symbol: "ETH",
    decimals: 18,
    crossChainId: "-1",
    amms: [],
    name: "ETH",
    provider: "nonNative",
  },
  neededConfirmations: 30,
} as const;

export const SUPPORTED_NETWORKS = {
  1: ETHERIUM_MAINNET_NETWORK,
  4: RINKEBY_NETWORK,
  42: KOVAN_NETWORK,
  137: {
    chainId: 137,
    infoPageUrl: "",
    name: "Polygon",
    rpcUrl: process.env.RPC_URL_137!,
    nativeToken: {
      chainId: 137,
      address: nativeAddress,
      image: getChainIconURL(137),
      symbol: "MATIC",
      name: "MATIC",
      decimals: 18,
      crossChainId: "-137",
      amms: [],
      provider: "nonNative",
    },
    neededConfirmations: 100,
  },
  250: {
    chainId: 250,
    infoPageUrl: "",
    name: "Fantom",
    rpcUrl: process.env.RPC_URL_250!,
    nativeToken: {
      chainId: 250,
      address: nativeAddress,
      image: getChainIconURL(250),
      symbol: "FTM",
      name: "FTM",
      decimals: 18,
      crossChainId: "-250",
      amms: [],
      provider: "nonNative",
    },
    neededConfirmations: 50,
  },
  1285: {
    chainId: 1285,
    infoPageUrl: "",
    name: "Moonriver",
    rpcUrl: process.env.RPC_URL_1285!,
    nativeToken: {
      chainId: 1285,
      address: nativeAddress,
      image: getChainIconURL(1285),
      symbol: "MOVR",
      name: "MOVR",
      decimals: 18,
      crossChainId: "-1285",
      amms: [],
      provider: "nonNative",
    },
    neededConfirmations: 30,
  },
  42161: {
    chainId: 42161,
    infoPageUrl: "",
    name: "Arbitrum",
    rpcUrl: process.env.RPC_URL_42161!,
    nativeToken: {
      chainId: 42161,
      address: nativeAddress,
      image: getChainIconURL(42161),
      symbol: "ETH",
      name: "ETH",
      decimals: 18,
      crossChainId: "-1",
      amms: [],
      provider: "nonNative",
    },
    neededConfirmations: 150,
  },
  43114: {
    chainId: 43114,
    infoPageUrl: "",
    name: "Avalanche",
    rpcUrl: process.env.RPC_URL_43114!,
    nativeToken: {
      chainId: 43114,
      address: nativeAddress,
      image: getChainIconURL(43114),
      symbol: "AVAX",
      name: "AVAX",
      decimals: 8,
      crossChainId: "-43114",
      amms: [],
      provider: "nonNative",
    },
    neededConfirmations: 180,
  },
} as const;

export type SupportedNetworkId = keyof typeof SUPPORTED_NETWORKS;

export const getNetworkUrl = (chainId: SupportedNetworkId) => SUPPORTED_NETWORKS[chainId].infoPageUrl;

export type SupportedNetwork = typeof SUPPORTED_NETWORKS[SupportedNetworkId];

export const supportedNetworksIds: Array<SupportedNetworkId> = Object.keys(SUPPORTED_NETWORKS).map(Number) as SupportedNetworkId[];

type SupportedNetworksSubset = Partial<{
  [key in SupportedNetworkId]: SupportedNetwork;
}>

export const TEST_SUPPORTED_NETWORKS: SupportedNetworksSubset = {
  1: ETHERIUM_MAINNET_NETWORK,
  4: RINKEBY_NETWORK,
  42: KOVAN_NETWORK,
} as const;

export type TestSupportedNetworkId = keyof typeof TEST_SUPPORTED_NETWORKS;

export const testSupportedNetworksIds: Array<TestSupportedNetworkId> = Object.keys(TEST_SUPPORTED_NETWORKS).map(Number) as TestSupportedNetworkId[];

export const ammAPINames = {
  "1": 'UNISWAPV2',
  "2": 'SUSHISWAP',
  "3": 'CURVEFI',
  "4": 'BALANCERV1',
  "5": 'BALANCERV2',
  "6": 'BANCOR',
  "7": 'QUICKSWAP',
  "8": 'SYNAPSE',
  "9": 'GMX',
  "10": 'TRADERJOE',
  "11": 'YAK',
  "12": 'PANGOLIN',
  "13": 'SPOOKYSWAP',
  "14": 'BETHOVENX',
  "15": 'SPIRITSWAP',
  "16": 'SOLARBEAM',
  "17": 'ELK',
  "18": 'HUCKLEBERRY',
  "19": 'SEADEX',
  "20": 'DYFN',
} as const;

export type AmmID = keyof typeof ammAPINames;
export type AmmName = typeof ammAPINames[AmmID];

type AmmIdToAmmNameMapping = {
  [key in AmmID]: string;
}

export const ammNames : AmmIdToAmmNameMapping = {
  "1": 'Uniswap',
  "2": 'SushiSwap',
  "3": 'Curve',
  "4": 'Balancer V1',
  "5": 'Balancer V2',
  "6": 'Bancor',
  "7": 'QuickSwap',
  "8": 'Synapse',
  "9": 'GMX',
  "10": 'Trader Joe',
  "11": 'YAK',
  "12": 'Pangolin',
  "13": 'Spooky swap',
  "14": 'Bethovenx',
  "15": 'Spirit swap',
  "16": 'Solabeam',
  "17": 'ELK',
  "18": 'Huckleberry',
  "19": 'Seadex',
  "20": 'DYFN',
} as const;

export type SwapAmmID = AmmID | "0";

export const supportedAMMs : Array<SupportedAmm> = Object.keys(ammAPINames).map((key: string) => {
  const ammId = key as AmmID;

  return {
    ammId,
    apiName: ammAPINames[ammId],
    ammAddress: "",
    name: ammNames[ammId],
    image: getAmmIconURL(ammId),
  }
})

type TokenChainIdToSymbolMapping = {
  [key: number]: string;
}

type TokenAddressToSymbolsMapping = {
  [key: string]: TokenChainIdToSymbolMapping;
}

export const tokenAddressToSymbolsMapping : TokenAddressToSymbolsMapping = {
  "0x77f2431c653b22eeec167bd0bc65128dc8dbe971": { // TODO(Marko): Remove this temp data
    4: "wETH",
    42: "wETH",
  },
  "0x5c7d7f1e1917ff7d6d38e4e8cbf31c39691ffb91": { // TODO(Marko): Remove this temp data
    4: "wETH-USDC LP",
    42: "wETH-USDC LP",
  },
}

export const liquidityFeePercentage = 0.8;
export const mosaicFeePercentage = 0.2;
export const toNativeDisabledThreshold = 15;

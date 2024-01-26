import { DEFI_CONFIG } from "./config";

export const TOKEN_PROVIDERS = ["native", "coinMarketcap"] as const;
export type TokenProvider = typeof TOKEN_PROVIDERS[number];
export type TokenId = typeof DEFI_CONFIG.tokenIds[number];
export type Token = {
  id: TokenId;
  icon: string;
  symbol: string;
  address: string;
  provider: TokenProvider;
  decimals: number;
  crossChainId: string;
  imageURL: string;
  amms: Array<SupportedAmm>;
};

export const ammAPINames = {
  "1": "UNISWAPV2",
  "2": "SUSHISWAP",
  "3": "CURVEFI",
  "4": "BALANCERV1",
  "5": "BALANCERV2",
  "6": "BANCOR",
  "7": "QUICKSWAP",
  "8": "SYNAPSE",
  "9": "GMX",
  "10": "TRADERJOE",
  "11": "YAK",
  "12": "PANGOLIN",
  "13": "SPOOKYSWAP",
  "14": "BETHOVENX",
  "15": "SPIRITSWAP",
  "16": "SOLARBEAM",
  "17": "ELK",
  "18": "HUCKLEBERRY",
  "19": "SEADEX",
  "20": "DYFN",
} as const;

export type AmmID = keyof typeof ammAPINames;
export type AmmName = typeof ammAPINames[AmmID];

export interface SupportedAmm {
  ammAddress: string;
  ammId: AmmID;
  name: string;
  imageURL: string;
  isRecommended?: boolean; // To detect whether an AMM is recomended  from our backend
}
export type NetworkId = typeof DEFI_CONFIG.networkIds[number];
export type Network = {
  imageURL: string;
  chainId: number;
  name: string;
  rpcUrl: string;
  infoPageUrl: string;
  infoPage: string;
  backgroundColor: string;
  logo: string;
  defaultTokenSymbol: string;
  publicRpcUrl: string;
  nativeToken: Token;
};

const supportedNetworkIds = DEFI_CONFIG.supportedNetworkIds; // important
export type SupportedNetworks = typeof supportedNetworkIds[number];

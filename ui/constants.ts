import { SupportedNetworks } from "defi/types";

export type SupportedNftRelayerNetwork = 1 | 137 | 42161 | 1285;
export const NFT_RELAYER_SUPPORTED_NETWORKS: SupportedNftRelayerNetwork[] = [
  1, 137, 42161, 1285,
];

export type SupportedRelayerNetwork = 1 | 137 | 42161 | 43114 | 1285 | 250;
export const RELAYER_SUPPORTED_NETWORKS: SupportedNetworks[] = [
  1, 137, 42161, 43114, 1285, 250, 421611, 3,
];

export const OVERVIEW_SUPPORTED_NETWORKS: SupportedNetworks[] = [
  1, 137, 42161, 43114, 1285,
];

export const NEEDED_CONFIRMATIONS: {
  [chainId in SupportedRelayerNetwork | SupportedNftRelayerNetwork]: number;
} = {
  1: 35,
  137: 100,
  1285: 30,
  42161: 150,
  43114: 180,
  250: 50,
};

export const BLOCK_UPDATE_FREQENCY: {
  [chainId in SupportedRelayerNetwork | SupportedNftRelayerNetwork]: number;
} = {
  1: 1,
  137: 2,
  1285: 1,
  42161: 2,
  43114: 2,
  250: 2,
};

export type SupportedRelayerToken =
  | "weth"
  | "usdc"
  | "aDai"
  | "aUsdc"
  | "aUsdt"
  | "crvTricrypto-usd-btc-eth"
  | "sushi-weth-usdc"
  | "sushi-weth-usdt"
  | "mim";

export const RELAYER_SUPPORTED_TOKENS: {
  tokenId: SupportedRelayerToken;
  supportedNetworks: SupportedRelayerNetwork[];
  launchTimestamp: number;
}[] = [
  {
    tokenId: "usdc",
    supportedNetworks: [1, 137, 42161, 43114, 1285, 250],
    launchTimestamp: 1632477600000,
  },
  {
    tokenId: "weth",
    supportedNetworks: [1, 137, 42161, 43114, 1285, 250],
    launchTimestamp: 1632477600000,
  },
  {
    tokenId: "aDai",
    supportedNetworks: [1, 137, 43114],
    launchTimestamp: 1633356000000,
  },
  {
    tokenId: "aUsdc",
    supportedNetworks: [1, 137, 43114],
    launchTimestamp: 1633356000000,
  },
  {
    tokenId: "aUsdt",
    supportedNetworks: [1, 137, 43114],
    launchTimestamp: 1633356000000,
  },
  {
    tokenId: "crvTricrypto-usd-btc-eth",
    supportedNetworks: [1, 137, 42161, 43114],
    launchTimestamp: 1633356000000,
  },
  {
    tokenId: "sushi-weth-usdc",
    supportedNetworks: [1, 137, 42161],
    launchTimestamp: 1633356000000,
  },
  {
    tokenId: "sushi-weth-usdt",
    supportedNetworks: [1, 137, 42161],
    launchTimestamp: 1633356000000,
  },
  {
    tokenId: "mim",
    supportedNetworks: [1, 42161, 43114, 1285, 250],
    launchTimestamp: 1635165603000,
  },
];

export type SupportedLpToken =
  | "weth"
  | "usdc"
  | "crvTricrypto-usd-btc-eth"
  | "mim"
  | "sushi-weth-usdc"
  | "sushi-weth-usdt"
  | "aDai"
  | "aUsdt"
  | "aUsdc";

export const LIQUIDITY_PROVIDER_SUPPORTED_TOKEN: {
  tokenId: SupportedLpToken;
}[] = [
  { tokenId: "weth" },
  { tokenId: "usdc" },
  { tokenId: "mim" },
  { tokenId: "crvTricrypto-usd-btc-eth" },
  { tokenId: "aDai" },
  { tokenId: "aUsdt" },
  { tokenId: "aUsdc" },
  { tokenId: "sushi-weth-usdc" },
  { tokenId: "sushi-weth-usdt" },
];

export const LAYR_PRICE = 1.05;

export const WS_URL = process.env.RELAYER_WS_URL;

export const LIQUIDITY_PROVIDER_WITHDRAWABLE_ADDRESSES = [
  "0x8D520d016246F31FE7A676648f1FD5E55ec5562D", //lv
  "0xd19f4f7c9dF8C6Bd134840BBcB9063588B9B5054", // fp
  "0xd9c3415Bf8600f007A1b4199DF967C25A3E00EeA",
  "0x84c2fA2213267163b515A046a343eEb5B99cAfC7",
  "0x54f38f4E33e47BD13e7A0F46Ed7AfAD61A40BFc1",
  "0x42d02f4cd48BDAC116b7E3A4895f586777948FaE",
];

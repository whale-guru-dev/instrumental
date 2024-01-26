export const DEFI_CONFIG = {
  supportedNetworkIds: [
    1, 137, 42161, 80001, 3, 421611, 43114, 1285, 250, 42,
  ] as const, // important
  networkIds: [1, 137, 42161, 80001, 3, 421611, 43114, 1285, 250, 42] as const, // important
  tokenIds: [
    "eth",
    "matic",
    "avax",
    "weth",
    "usdc",
    "dot",
    "uni",
    "ftm",
    "pica",
    "movr",
    "ksm",
  ] as const, // important
  ammIds: ["uniswap", "sushiswap", "quickiswap"] as const,
};

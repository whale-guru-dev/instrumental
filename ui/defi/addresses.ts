import { SupportedNetworks } from "./types";

export type ERC20Addresses = "strm" | "eth_strm_lp" | "veSTRM";

export type LiquidityMiningContract = "liquidityMining";
export type InstrumentalVestingContract = "vesting";
export type VotingEscrow = "veSTRM";
export type RelayerVaule = "relayervault";
export type ContractAddresses =
  | ERC20Addresses
  | VotingEscrow
  | LiquidityMiningContract
  | RelayerVaule
  | InstrumentalVestingContract;

export const ADDRESSES: {
  [name in ContractAddresses]: { [chainId in SupportedNetworks]: string };
} = {
  strm: {
    1: "0x0eDF9bc41Bbc1354c70e2107F80C42caE7FBBcA8",
    3: "",
    137: "",
    42161: "",
    80001: "",
    421611: "",
    43114: "",
    1285: "",
    250: "",
    42: "",
  },

  eth_strm_lp: {
    1: "0xb301d7efb4d46528f9cf0e5c86b065fbc9f50e9a",
    3: "",
    137: "",
    42161: "",
    80001: "",
    421611: "",
    43114: "",
    1285: "",
    250: "",
    42: "",
  },
  liquidityMining: {
    1: "0xC5124896459D3C219Be821D1a9146cd51e4Bc759",
    3: "",
    137: "",
    42161: "",
    80001: "",
    421611: "",
    43114: "",
    1285: "",
    250: "",
    42: "",
  },
  vesting: {
    1: "0x39B72d136ba3e4ceF35F48CD09587ffaB754DD8B",
    3: "",
    137: "",
    42161: "",
    80001: "",
    421611: "",
    43114: "",
    1285: "",
    250: "",
    42: "",
  },
  veSTRM: {
    1: "0x62Ae88697782f474B2537B890733CC15d3E01F1d",
    3: "",
    137: "",
    42161: "",
    80001: "",
    421611: "",
    43114: "",
    1285: "",
    250: "",
    42: "",
  },
  relayervault: {
    1: "0x29E0A2A859301957C93E626Eb611Ff4D41291cAD",
    3: "",
    137: "",
    42161: "",
    80001: "",
    421611: "",
    43114: "",
    1285: "",
    250: "",
    42: "",
  },
};

export const getAddressesByChainId = (chainId: SupportedNetworks) => {
  return Object.keys(ADDRESSES).reduce((map, k) => {
    map[k as ContractAddresses] = ADDRESSES[k as ContractAddresses][chainId];
    return map;
  }, {} as { [name in ContractAddresses]: string });
};

export const getContractAddressIDByChainIdAndAddress = (
  chainId: SupportedNetworks,
  address: string,
) => {
  address = address.toLowerCase();
  const ret = Object.entries(ADDRESSES).find(
    ([_, addresses]) => addresses[chainId].toLowerCase() === address,
  );
  if (ret) {
    return ret[0] as ContractAddresses;
  }

  return ret;
};

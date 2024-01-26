//import { RELAYER_SUPPORTED_NETWORKS } from "../constants";
import { ContractAddresses } from "./addresses";
import { TokenId } from "./tokenInfo";
import { SupportedNetworks } from "./types";

const allowances: {
  [key in TokenId]: {
    contract: ContractAddresses;
    chainIds: SupportedNetworks[];
  }[];
} = {
  eth_strm_lp: [
    { contract: "liquidityMining", chainIds: [1] },
    //{ contract: "vesting", chainIds: [1, 42] },
  ],
  strm: [
    { contract: "liquidityMining", chainIds: [1] },
    //{ contract: "vesting", chainIds: [1, 42] },
  ],
  eth: [],
  veSTRM: [{ contract: "vesting", chainIds: [1] }],
};

export const getAllowances = (
  tokenId: TokenId,
  chainId: SupportedNetworks,
): ContractAddresses[] =>
  allowances[tokenId]
    .filter((x) => x.chainIds.includes(chainId))
    .map((x) => x.contract);

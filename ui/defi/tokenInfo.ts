import { eth, ethInst, inst, veStrm } from "@/assets/tokens";
import { ComponentType } from "react";
import { ERC20Addresses } from "./addresses";

export interface Token {
  symbol: string;
  decimals: number;
  displayedDecimals: number;
  pricing?: {
    geckoApiId?: string;
    static?: number;
  };
  picture: ComponentType<{}>;
  picture2?: string;
  noBalance?: boolean;
  isSc?: boolean;
}

export type AdditionalBalances = "eth";

export type TokenId = ERC20Addresses | AdditionalBalances;

export const tokens: { [key in TokenId]: Token } = {
  strm: {
    symbol: "STRM",
    decimals: 18,
    displayedDecimals: 0,
    pricing: {
      geckoApiId: "instrumental-finance",
    },
    picture: inst,
  },
  veSTRM: {
    symbol: "veSTRM",
    decimals: 18,
    displayedDecimals: 0,
    pricing: {
      geckoApiId: "instrumental-finance",
    },
    picture: veStrm,
  },
  eth_strm_lp: {
    symbol: "ETH-STRM-LP",
    decimals: 18,
    displayedDecimals: 3,
    pricing: {
      geckoApiId: "",
    },
    picture: ethInst,
  },
  eth: {
    symbol: "ETH",
    decimals: 18,
    displayedDecimals: 3,
    pricing: {
      geckoApiId: "",
    },
    picture: eth,
  },
};

export const tokensArray: Token[] = Object.values(tokens);

export const tokenIdsArray: TokenId[] = Object.keys(tokens) as TokenId[];

export const getToken = (tokenId: TokenId): Token => tokens[tokenId];

export const getTokenIds = (geckoApiId: string): TokenId[] =>
  Object.entries(tokens)
    .filter(([_, v]) => v.pricing?.geckoApiId === geckoApiId)
    .map(([k, _]) => k as TokenId);

export const getTokens = (tokenIds: TokenId[]): Token[] =>
  tokenIds.map((id) => tokens[id]);

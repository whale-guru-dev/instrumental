import { BigNumber, CallOverrides, ethers, Overrides } from "ethers";
import { BigNumber as BN } from "bignumber.js";
import { getToken, TokenId, tokenIdsArray } from "../tokenInfo";

export type TokenInfo = {
  name?: string;
  symbol?: string;
  tokenId: TokenId;
  decimals: number;
  displayedDecimals: number;
  balance: number;
  balanceBN: BN;
  price: number;
  imageUri?: string;
  spenderAllowance?: number;

  approve?: (
    spender: string,
    amount: BigNumber,
    overrides?: Overrides,
  ) => Promise<ethers.providers.TransactionResponse>;

  approveMax?: (
    spender: string,
  ) => Promise<ethers.providers.TransactionResponse>;

  transfer?: (
    recipient: string,
    amount: BigNumber,
    overrides?: Overrides,
  ) => Promise<ethers.providers.TransactionResponse>;

  allowance?: (
    owner: string,
    spender: string,
    overrides?: CallOverrides,
  ) => Promise<BigNumber>;
};

export type TokenStore = {
  [tokenId in TokenId]: TokenInfo;
};

export const initialState: any = tokenIdsArray.reduce((map, tokenId) => {
  const token = getToken(tokenId);
  return {
    ...map,
    [tokenId]: {
      tokenId,
      decimals: token.decimals,
      balance: 0,
      balanceBN: new BN(0),
      price: 0,
      symbol: token.symbol,
    },
  };
}, {} as any);

export function tokensReducer(
  tokens: TokenStore,
  action:
    | {
        type: "addToken";
        payload: { id: TokenId; token: Omit<TokenInfo, "price"> };
      }
    | { type: "resetTokens" }
    | {
        type: "updateTokenBalanceAllowance";
        payload: {
          id: TokenId;
          balance: number;
          spenderAllowance: number;
          balanceBN: BigNumber;
        };
      }
    | {
        type: "updatePrice";
        payload: {
          id: TokenId;
          price: number;
        };
      },
): TokenStore {
  switch (action.type) {
    case "addToken":
      return {
        ...tokens,
        [action.payload.id]: {
          ...action.payload.token,
          price: tokens[action.payload.id].price,
        },
      };
    case "updateTokenBalanceAllowance":
      return {
        ...tokens,
        [action.payload.id]: {
          ...tokens[action.payload.id],
          balance: action.payload.balance,
          balanceBN: action.payload.balanceBN,
          spenderAllowance: action.payload.spenderAllowance,
        },
      };
    case "updatePrice":
      return {
        ...tokens,
        [action.payload.id]: {
          ...tokens[action.payload.id],
          price: action.payload.price,
        },
      };
    case "resetTokens":
      return Object.keys(tokens).reduce((map, tokenId) => {
        return {
          ...map,
          [tokenId as string]: {
            balance: 0,
            balanceBN: new BN(0),
            tokenId,
            decimals: tokens[tokenId as TokenId].decimals,
            displayedDecimals: tokens[tokenId as TokenId].displayedDecimals,
            price: tokens[tokenId as TokenId].price,
            symbol: tokens[tokenId as TokenId].symbol,
          },
        };
      }, {} as any);
    default:
      return tokens;
  }
}

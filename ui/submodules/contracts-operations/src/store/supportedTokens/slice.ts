import { getTokenId, Token as BiLibToken } from "@integrations-lib/core";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { APITokenSupportedAmmsData } from "../../api";
import {
  ammAPINames,
  AmmID,
  AmmName,
  ammNames,
  SupportedNetworkId,
  tokenAddressToSymbolsMapping,
} from "../../defi/constants";
import { UniqueObjectSet } from "../../utils/types";
import { getAmmIconURL, getTokenIconURL } from "./utils";

export type CrossChainId = string;

interface APIToken {
  address: string;
  decimals: string;
  symbol: string;
  crossChainId: CrossChainId;
  minTransferAmount?: string;
  maxTransferAmount?: string;
}

type TokenOmitted =
  | "decimals"
  | "symbol"

export const TokenProviders = {
  native: "Mosaic Native",
  nonNative: "Supported",
  custom: "Custom token",
} as const;

export type TokenProvider = keyof typeof TokenProviders;

export interface Token extends Omit<APIToken, TokenOmitted>, BiLibToken {
  chainId: SupportedNetworkId;
  amms: Array<SupportedAmm>;
  provider: TokenProvider;
}

type CrossChainTokenOmitted =
 | "address"
 | "decimals";

type ChainIdTokenDataPair<T> = Partial<{
  [chainId in SupportedNetworkId]: T;
}>

export interface CrossChainToken extends Omit<Token, CrossChainTokenOmitted> {
  addresses: ChainIdTokenDataPair<string>;
  decimals: ChainIdTokenDataPair<number>;
}

type DistinctCrossChainTokens = {
  crossChainIds: Set<CrossChainId>;
  tokens: Array<CrossChainToken>;
}

interface APILiquidityToken {
  token: APIToken;
  iouToken: APIToken;
  receiptToken: APIToken;
}

type LiquidityTokenOmitted =
 | 'token'
 | 'iouToken'
 | 'receiptToken'

export interface LiquidityToken extends Omit<APILiquidityToken, LiquidityTokenOmitted> {
  token: Token;
  iouToken: Token;
  receiptToken: Token;
}

interface APITransferPair {
  sourceToken: APIToken;
  destinationToken: APIToken;
  destinationChainId: string;
}

type TransferPairOmitted =
  | 'sourceToken'
  | 'destinationToken'
  | 'destinationChainId'

export interface TransferPair extends Omit<APITransferPair, TransferPairOmitted> {
  sourceToken: Token;
  destinationToken: Token;
  destinationChainId: SupportedNetworkId;
}

interface APISupportedAmm {
  ammAddress: string;
  ammId: AmmID;
  name: AmmName;
}

type SupportedAmmOmitted = "name";

export interface SupportedAmm
  extends Omit<APISupportedAmm, SupportedAmmOmitted> {
  apiName: AmmName;
  name: string;
  image: string;
  isRecommended?: boolean; // TODO(Marko): To detect whether an AMM is recomended  from our backend
}

interface APIChainSupportedTokens {
  chainId: number;
  liquidityTokens: Array<APILiquidityToken>;
  transferPairs: Array<APITransferPair>;
  supportedAmms: Array<APISupportedAmm>;
}

type ChainSupportedTokensOmitted =
  | "chainId"
  | "liquidityTokens"
  | "transferPairs"
  | "supportedAmms";

type PartialTokenWithAmmsOmitted =
  | "symbol"
  | "decimals"
  | "image"
  | "crossChainId"
  | "name"

export type PartialTokenWithAmms = Omit<Token, PartialTokenWithAmmsOmitted>

export interface ChainSupportedTokens extends Omit<APIChainSupportedTokens, ChainSupportedTokensOmitted> {
  liquidityTokens: Array<LiquidityToken>;
  mosaicTransferPairs: Array<TransferPair>;
  supportedAmms: Array<SupportedAmm>;
  tokens: Array<PartialTokenWithAmms>;
}

type SupportedAmmsForChains = {
  [chainId: number]: Array<SupportedAmm>;
}

export type APISupportedTokens = Array<APIChainSupportedTokens>

export type SupportedTokens = Partial<{
  [chainId in SupportedNetworkId]: ChainSupportedTokens
}>

export type ReceiptTokens = {
  [key: string]: Token;
}

type SupportedTokensState = {
  crossChainTokens: Array<CrossChainToken>;
  networks: Array<SupportedNetworkId>;
  receiptTokens: ReceiptTokens;
  supportedTokens: SupportedTokens;
  mosaicTokens: Array<Token>;
  liquidityTokens: Array<Token>;
  customTokens: Array<Token>;
}

const initialState: SupportedTokensState = {
  crossChainTokens: [],
  networks: [],
  receiptTokens: {},
  supportedTokens: {},
  mosaicTokens: [],
  liquidityTokens: [],
  customTokens: [],
}

export interface TokenSupportedAmms {
  chainId: SupportedNetworkId;
  ammsPerToken: APITokenSupportedAmmsData;
}

export const supportedTokensSlice = createSlice({
  name: "supportedTokens",
  initialState,
  reducers: {
    updateCustomToken: (
      state,
      action: PayloadAction<Token>
    ) => {
      const token = action.payload;
      const customTokenIndex = state.customTokens.findIndex((currentToken: Token) => getTokenId(currentToken) === getTokenId(token));
      if (customTokenIndex < 0) {
        state.customTokens = [
          ...state.customTokens,
          token,
        ];
      } else {
        const newCustomTokens = [...state.customTokens];
        newCustomTokens[customTokenIndex] = token;
        state.customTokens = [...newCustomTokens];
      }
    },
    updateSupportedAmms: (
      state,
      action: PayloadAction<TokenSupportedAmms>
    ) => {
      const {
        chainId,
        ammsPerToken,
      } = action.payload;

      const tokens : Array<PartialTokenWithAmms> = Object.entries(ammsPerToken).map(([address, supportedAmms] : [string, Array<number>]) => ({
        address,
        amms: supportedAmms.map((ammIdNumber: number) : SupportedAmm => {
          const ammId = ammIdNumber.toString() as AmmID;
          return {
            ammId,
            ammAddress: "", // TODO(Marko): See how to get this
            apiName: ammAPINames[ammId],
            name: ammNames[ammId],
            image: getAmmIconURL(ammId),
          }
        }),
        chainId,
        provider: 'nonNative',
      }));

      state.supportedTokens[chainId] = {
        supportedAmms: state.supportedTokens[chainId]?.supportedAmms || [],
        liquidityTokens: state.supportedTokens[chainId]?.liquidityTokens || [],
        mosaicTransferPairs: state.supportedTokens[chainId]?.mosaicTransferPairs || [],
        tokens,
      }
    },
    updateSupportedTokens: (
      state,
      action: PayloadAction<APISupportedTokens>
    ) => {
      const supportedTokens: SupportedTokens = { ...state.supportedTokens };

      const supportedAmmsForChains = action.payload.reduce(
        (
          result: SupportedAmmsForChains, element: APIChainSupportedTokens
        ) => {
          result = {
            ...result,
            [element.chainId]: element.supportedAmms.map((amm: APISupportedAmm): SupportedAmm => ({
              ...amm,
              apiName: amm.name,
              name: ammNames[amm.ammId],
              image: getAmmIconURL(amm.ammId),
            }))
          }

          return result;
        },
        {}
      );

      action.payload.map((element: APIChainSupportedTokens): ChainSupportedTokens => {
        const supportedAmms = element.supportedAmms.map((amm: APISupportedAmm): SupportedAmm => ({
          ...amm,
          apiName: amm.name,
          name: ammNames[amm.ammId],
          image: getAmmIconURL(amm.ammId),
        }));

        return supportedTokens[element.chainId as SupportedNetworkId] = {
          ...element,
          liquidityTokens: element.liquidityTokens.map((lToken: APILiquidityToken): LiquidityToken => ({
            token: {
              ...lToken.token,
              decimals: Number.parseInt(lToken.token.decimals),
              symbol:
                    tokenAddressToSymbolsMapping?.[lToken.token.address]?.[
                      element.chainId
                    ] || lToken.token.symbol,
              image: getTokenIconURL(
                element.chainId,
                lToken.token.address
              ),
              chainId: element.chainId as SupportedNetworkId,
              amms: supportedAmmsForChains[element.chainId],
              provider: "native",
              name: lToken.token.symbol,
            },
            iouToken: {
              ...lToken.iouToken,
              decimals: Number.parseInt(lToken.iouToken.decimals),
              symbol:
                    tokenAddressToSymbolsMapping?.[lToken.iouToken.address]?.[
                      element.chainId
                    ] || lToken.iouToken.symbol,
              image: getTokenIconURL(
                element.chainId,
                lToken.iouToken.address
              ),
              chainId: element.chainId as SupportedNetworkId,
              amms: [],
              provider: "native",
              name: lToken.iouToken.symbol,
            },
            receiptToken: {
              ...lToken.receiptToken,
              decimals: Number.parseInt(lToken.receiptToken.decimals),
              symbol:
                    tokenAddressToSymbolsMapping?.[lToken.receiptToken.address]?.[
                      element.chainId
                    ] || lToken.receiptToken.symbol,
              image: getTokenIconURL(
                element.chainId,
                lToken.receiptToken.address
              ),
              chainId: element.chainId as SupportedNetworkId,
              amms: [],
              provider: "native",
              name: lToken.receiptToken.symbol,
            },
          })),
          supportedAmms,
          mosaicTransferPairs: element.transferPairs.map((pair: APITransferPair): TransferPair => {
            const destinationChainId = parseInt(pair.destinationChainId) as SupportedNetworkId;

            return {
              ...pair,
              destinationChainId,
              sourceToken: {
                ...pair.sourceToken,
                decimals: Number.parseInt(pair.sourceToken.decimals),
                symbol:
                      tokenAddressToSymbolsMapping?.[pair.sourceToken.address]?.[
                        element.chainId
                      ] || pair.sourceToken.symbol,
                image: getTokenIconURL(
                  element.chainId,
                  pair.sourceToken.address
                ),
                chainId: element.chainId as SupportedNetworkId,
                amms: supportedAmmsForChains[element.chainId],
                provider: "native",
                name: pair.sourceToken.symbol,
              },
              destinationToken: {
                ...pair.destinationToken,
                decimals: Number.parseInt(pair.destinationToken.decimals),
                symbol:
                      tokenAddressToSymbolsMapping?.[
                        pair.destinationToken.address
                      ]?.[element.chainId] || pair.destinationToken.symbol,
                image: getTokenIconURL(
                  destinationChainId,
                  pair.destinationToken.address
                ),
                chainId: destinationChainId,
                amms: supportedAmmsForChains[destinationChainId],
                provider: "native",
                name: pair.destinationToken.symbol,
              },
            }
          }),
          tokens: state.supportedTokens[element.chainId as SupportedNetworkId]?.tokens || [],
        }
      });

      state.supportedTokens = supportedTokens;

      state.networks = action.payload.map((element: APIChainSupportedTokens) => element.chainId as SupportedNetworkId);

      const liquidityTokens = Object.entries(supportedTokens).reduce(
        (
          result: UniqueObjectSet<Token>,
          chainSupportedTokens: [string, ChainSupportedTokens]
        ) =>
          chainSupportedTokens[1].liquidityTokens.reduce(
            (
              chainResult: UniqueObjectSet<Token>,
              liquidityToken: LiquidityToken
            ) =>
              chainResult.addObject(
                chainSupportedTokens[0] +
                  "-" +
                  liquidityToken.token.address,
                liquidityToken.token
              ),
            result
          ),
        new UniqueObjectSet<Token>()
      ).objects;

      state.liquidityTokens = liquidityTokens;

      const mosaicTokens = Object.entries(supportedTokens).reduce(
        (
          result: UniqueObjectSet<Token>,
          chainSupportedTokens: [string, ChainSupportedTokens]
        ) => {
          result = chainSupportedTokens[1].mosaicTransferPairs.reduce(
            (
              chainResult: UniqueObjectSet<Token>,
              mosaicTransferPair: TransferPair
            ) => {
              chainResult.addObject(
                getTokenId(mosaicTransferPair.sourceToken),
                mosaicTransferPair.sourceToken
              );
              chainResult.addObject(
                getTokenId(mosaicTransferPair.destinationToken),
                mosaicTransferPair.destinationToken
              );
              return chainResult;
            },
            result
          );

          return result;
        },
        new UniqueObjectSet<Token>()
      ).objects;

      state.mosaicTokens = mosaicTokens;

      state.receiptTokens = mosaicTokens.reduce(
        (
          result: ReceiptTokens, token: Token
        ) => {
          const receiptToken = supportedTokens[token.chainId]
            ?.liquidityTokens.find((liquidityToken: LiquidityToken) =>
              liquidityToken.token.crossChainId === token.crossChainId)?.receiptToken;

          if (receiptToken) {
            result[getTokenId(token)] = receiptToken;
          }

          return result;
        },
        {}
      );

      const distinctCrossChainTokens: DistinctCrossChainTokens =
      Object.entries(supportedTokens).reduce(
        (
          result: DistinctCrossChainTokens,
          chainSupportedTokens: [string, ChainSupportedTokens]
        ) => {
          const addCrossChainToken = (
            result: DistinctCrossChainTokens,
            chainId: SupportedNetworkId,
            token: Token
          ) => {
            if (!result.crossChainIds.has(token.crossChainId)) {
              result.crossChainIds.add(token.crossChainId);

              const crossChainToken: CrossChainToken = {
                ...token,
                addresses: { [chainId]: token.address },
                decimals: { [chainId]: token.decimals },
              };

              result.tokens.push(crossChainToken);
            } else {
              const crossChainToken = result.tokens.find((presentToken: CrossChainToken) =>
                presentToken.crossChainId === token.crossChainId);

              if (!crossChainToken) {
                throw Error("Supported Tokens - Logic error");
              }

              crossChainToken.addresses[chainId] = token.address;
            }

            return result;
          };

          result = chainSupportedTokens[1].liquidityTokens.reduce(
            (
              chainResult: DistinctCrossChainTokens,
              liquidityToken: LiquidityToken
            ) => {
              return addCrossChainToken(
                chainResult,
                  parseInt(chainSupportedTokens[0]) as SupportedNetworkId,
                  liquidityToken.token
              );
            },
            result
          );

          result = chainSupportedTokens[1].mosaicTransferPairs.reduce(
            (
              chainResult: DistinctCrossChainTokens,
              mosaicTransferPair: TransferPair
            ) => {
              addCrossChainToken(
                chainResult,
                  parseInt(chainSupportedTokens[0]) as SupportedNetworkId,
                  mosaicTransferPair.sourceToken
              );

              addCrossChainToken(
                chainResult,
                mosaicTransferPair.destinationChainId,
                mosaicTransferPair.destinationToken
              );

              return chainResult;
            },
            result
          );

          return result;
        },
        {
          crossChainIds: new Set(),
          tokens: [],
        }
      );

      state.crossChainTokens = distinctCrossChainTokens.tokens;
    },
  },
});

export const {
  updateCustomToken,
  updateSupportedAmms,
  updateSupportedTokens,
} = supportedTokensSlice.actions

export const selectNonnativeTokens = (state: any) =>
  Object.values(state.supportedTokens.supportedTokens as SupportedTokens)
    .reduce(
      (
        result: Array<PartialTokenWithAmms>, chainSupportedToken: ChainSupportedTokens
      ) => result.concat(chainSupportedToken.tokens),
      []
    )

export const selectCustomTokens = (state: any) => state.supportedTokens.customTokens
export const selectMosaicTokens = (state: any) => state.supportedTokens.mosaicTokens
export const selectSupportedTokens = (state: any) => state.supportedTokens.supportedTokens
export const selectReceiptTokens = (state: any) => state.supportedTokens.receiptTokens
export const selectNetworks = (state: any) => state.supportedTokens.networks
export const selectLiquidityTokens = (state: any) => state.supportedTokens.liquidityTokens
export const selectCrossChainTokens = (state: any) => state.supportedTokens.crossChainTokens

export default supportedTokensSlice.reducer

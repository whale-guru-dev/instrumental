export interface TokenCompositeKey {
  chainId: number;
  address: string;
}

export interface Token extends TokenCompositeKey {
  decimals: number;
  symbol: string;
  name: string;
  image: string;
}

export type TokenId = string

export const getTokenId = (token: TokenCompositeKey) : TokenId => token.chainId + '-' + token.address

export const getTokenAddress = (tokenId: TokenId) : string => tokenId.split('-')[1];

export const getChainId = (tokenId: TokenId) : number => parseInt(tokenId.split('-')[0]);

export const unpackTokenId = (tokenId: TokenId) : TokenCompositeKey => {
  const splitted = tokenId.split('-');
  return {
    address: splitted[1],
    chainId: parseInt(splitted[0]),
  }
}

export class Blocks {
  count = 0;
}

export class BlockResultType {
  blocks: Blocks = new Blocks();
}

export class Currency {
  decimals = 1;
  name = '';
  symbol = '';
}

export class SmartContract {
  currency: Currency = new Currency();
}

export class TokenMetadataResultType {
  smartContract: SmartContract = new SmartContract();
}

export type BlockUpdaterFunction = (chainId: number | undefined) => number;
export type BlockNumberSaveFunction = (chainId: number | undefined, blockNumber: number | undefined) => void;

export type TokensMetadataUpdaterFunction = (tokenIds: Array<TokenId>) => Array<Token>;
export type TokensMetadataSaveFunction = (tokens: Array<Token>) => void;

export type TokenPriceUpdaterFunction = (tokenId: TokenId) => number;
export type TokenPriceSaveFunction = (tokenId: TokenId | undefined, price: number | undefined) => void;
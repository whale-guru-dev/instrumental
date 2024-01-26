import { createContext } from 'react';

import { defaultEmptyFunction, TokenId } from '../../utils';
import { TokenMetadata, TokenPrices } from '../updaters';
import { BlockNumbers } from '../updaters/block-number/BlockNumberUpdater';

export type BlockchainDataValues = {
  blockNumbers: BlockNumbers;
  requestBlockNumber: (chainId: number | undefined) => boolean;

  tokenMetadata: TokenMetadata;
  requestTokenMetadata: (tokenIds: Array<TokenId>) => Array<boolean>;
  tokenPrices: TokenPrices;

  addRequestTokenPrice: (tokenId: TokenId | undefined) => boolean;
  removeRequestTokenPrice: (tokenId: TokenId | undefined) => boolean;
  removeAllRequestsTokenPrice: () => void;
  isTokenPriceLoading: (tokenId: TokenId | undefined) => boolean;
}

export const BlockchainDataContext = createContext<BlockchainDataValues>({
  blockNumbers: {},
  requestBlockNumber: () => false,

  tokenMetadata: {},
  requestTokenMetadata: () => [],

  tokenPrices: {},
  addRequestTokenPrice: () => false,
  removeRequestTokenPrice: () => false,
  removeAllRequestsTokenPrice: defaultEmptyFunction,
  isTokenPriceLoading: () => false,
});
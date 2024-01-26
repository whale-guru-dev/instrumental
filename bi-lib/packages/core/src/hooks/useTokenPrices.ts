import { useCallback, useContext } from "react";

import { BlockchainDataContext } from "../data";
import { TokenId } from "../utils/types";

export interface TokenPriceResult {
  price: number | undefined;
  isLoading: boolean;
}

export interface TokenPriceOperations {
  addRequestTokenPrice: (tokenId: TokenId | undefined) => boolean;
  removeRequestTokenPrice: (tokenId: TokenId | undefined) => boolean;
  removeAllRequestsTokenPrice: () => void;
  getTokenPrice: (tokenId: TokenId | undefined) => TokenPriceResult;
}

export const useTokenPrices = () : TokenPriceOperations => {
  const {
    addRequestTokenPrice,
    removeRequestTokenPrice,
    removeAllRequestsTokenPrice,
    isTokenPriceLoading,
    tokenPrices,
  } = useContext(BlockchainDataContext);

  const getTokenPrice = useCallback(
    (tokenId: TokenId | undefined) => ({
      price: tokenId !== undefined && tokenPrices[tokenId] || undefined,
      isLoading: isTokenPriceLoading(tokenId),
    }),
    [tokenPrices, isTokenPriceLoading]
  )

  return {
    addRequestTokenPrice,
    removeRequestTokenPrice,
    removeAllRequestsTokenPrice,
    getTokenPrice,
  }
};
import { useContext } from "react";

import { BlockchainDataContext } from "../data";
import { Token, TokenId } from "../utils/types";

export interface TokenMetaResult {
  tokenMeta: Token | undefined;
  isLoading: boolean;
}

export const useTokenMetadata = (tokenIds: Array<TokenId>) : Array<TokenMetaResult> => {
  const {
    tokenMetadata,
    requestTokenMetadata,
  } = useContext(BlockchainDataContext);

  const tokenMetadatasRequested = requestTokenMetadata(tokenIds);

  const result : Array<TokenMetaResult> = tokenIds.map((
    tokenId: TokenId, index: number
  ) => {
    const isRequested = tokenMetadatasRequested[index];

    const tokenMeta = tokenMetadata[tokenId];
    const isLoading = isRequested && tokenMeta === undefined;

    return {
      tokenMeta,
      isLoading,
    }
  })

  return result;
};
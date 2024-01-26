
import { TokenId, TokensMetadataSaveFunction, TokensMetadataUpdaterFunction } from "../../../../utils/types"

export interface TokenMetadataUpdaterProps {
  tokenIds: Array<TokenId>;
  saveTokensMetadata: TokensMetadataSaveFunction;
  updater: TokensMetadataUpdaterFunction | undefined;
}

export const TokenMetadataUpdater = (props: TokenMetadataUpdaterProps) => {
  const {
    tokenIds,
    saveTokensMetadata,
    updater,
  } = props;

  const tokenMetadata = updater !== undefined ? updater(tokenIds) : [];

  saveTokensMetadata(tokenMetadata)

  return null;
}
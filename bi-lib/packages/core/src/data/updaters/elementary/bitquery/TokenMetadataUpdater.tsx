// import { gql, useQuery } from "@apollo/client";

// import { QueryNetworkChainId } from "../../../../utils/constants";
// import { TOKEN_METADATA } from '../../../../utils/queries';
import { TokenId, TokensMetadataSaveFunction } from "../../../../utils/types"

export interface TokenMetadataUpdaterProps {
  tokenIds: Array<TokenId>;
  saveTokensMetadata: TokensMetadataSaveFunction;
}

export const TokenMetadataUpdater = (props: TokenMetadataUpdaterProps) => {

  console.log(
    "BI-LIB - BITQUERY - TokenMetadataUpdater - Not implemented",
    props
  );

  /*
  TODO(Marko): Adapt to query multiple tokens at once

  const {
    tokenIds,
    saveTokensMetadata,
  } = props;

  const {
    loading, error, data
  } = useQuery(gql(TOKEN_METADATA(
    chainId,
    tokenAddress
  )));

  if (!loading && !error && data) {
    const {
      decimals, name, symbol
    } = data.ethereum.arguments[0].smartContract.currency;

    saveTokensMetadata({
      chainId,
      address: tokenAddress,
      decimals,
      name,
      symbol,
      image: "",
    });
  }

  */

  return null;
}
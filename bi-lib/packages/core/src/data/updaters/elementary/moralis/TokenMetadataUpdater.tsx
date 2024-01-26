import React, { useMemo } from "react";

import { queryNetworkIds } from "../../../../utils/constants";
import { getChainId, getTokenAddress, Token, TokenId, TokensMetadataSaveFunction } from "../../../../utils/types"

export interface TokenMetadataUpdaterProps {
  apiKey: string;
  tokenIds: Array<TokenId>;
  saveTokensMetadata: TokensMetadataSaveFunction;
}

const TokenMetadataUpdater = (props: TokenMetadataUpdaterProps) => {
  const {
    apiKey,
    tokenIds,
    saveTokensMetadata,
  } = props;

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set(
    'Content-Type',
    'application/json'
  );
  requestHeaders.set(
    'X-API-Key',
    apiKey
  );

  queryNetworkIds.forEach((chainId: number) => {
    const tokenAddressesParam: string = tokenIds
      .filter((tokenId: TokenId) => getChainId(tokenId) === chainId)
      .map((tokenId: TokenId) => `&addresses=${getTokenAddress(tokenId)}`)
      .join('');

    if (tokenAddressesParam) {
      const moralisApiEndpoint = `https://deep-index.moralis.io/api/v2/erc20/metadata?chain=0x${chainId.toString(16)}${tokenAddressesParam}`;

      fetch(
        moralisApiEndpoint,
        { headers: requestHeaders }
      ).then(res => res.json()).then(data => {
        console.log(
          "BI-LIB - Token Metadata Updater - Moralis Call success",
          data
        );

        let result: Array<Token> = [];

        if (typeof data === 'object') {
          result = data.map((token: any) => {
            const {
              address, decimals, symbol, name, logo
            } = token;

            return {
              address,
              chainId,
              decimals,
              name,
              symbol,
              image: logo,
            };
          })
        }

        console.log(
          "BI-LIB - Token Metadata Updater - Moralis saveTokensMetadata",
          result
        );

        saveTokensMetadata(result);
      })
    }
  })

  return null;
}

const TokenMetadataUpdaterWrapper = ({
  apiKey,
  tokenIds,
  saveTokensMetadata
} : TokenMetadataUpdaterProps) => {

  const tokenMetaDataUpdater = useMemo(
    () => {
      console.log(
        "BI-LIB Update TokenMetadataUpdater",
        tokenIds
      )
      return <TokenMetadataUpdater apiKey={apiKey} tokenIds={tokenIds} saveTokensMetadata={saveTokensMetadata} />
    },
    [apiKey, tokenIds, saveTokensMetadata]
  )

  return tokenMetaDataUpdater;
}

export { TokenMetadataUpdaterWrapper as TokenMetadataUpdater };
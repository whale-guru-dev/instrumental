import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React, { useCallback, useMemo, useState } from "react";

import { queryNetworkIds } from "../../utils/constants";
import { getTokenId, Token, TokenId } from "../../utils/types";
import { BlockNumbers, BlockNumberUpdater, BlockNumberUpdaterProps, PrivateTokenMetadataUpdaterProps, PrivateTokenPricesUpdaterProps, PublicTokenMetadataUpdaterProps, PublicTokenPricesUpdaterProps, TokenMetadata, TokenMetadataUpdater, TokenPrices, TokenPricesUpdater } from "../updaters";
import { BlockchainDataContext } from "./BlockchainDataContext";

type BlockNumberUpdaterConfigOmitted = 'setBlockNumbers' | 'chains';
export type BlockNumberUpdaterConfig = Omit<BlockNumberUpdaterProps, BlockNumberUpdaterConfigOmitted>

type TokenMetadataUpdaterConfigOmitted = 'saveTokensMetadata' | 'tokenIds';
export type PrivateTokenMetadataUpdaterConfig = Omit<PrivateTokenMetadataUpdaterProps, TokenMetadataUpdaterConfigOmitted>
export type PublicTokenMetadataUpdaterConfig = Omit<PublicTokenMetadataUpdaterProps, TokenMetadataUpdaterConfigOmitted>
export type TokenMetadataUpdaterConfig = PrivateTokenMetadataUpdaterConfig | PublicTokenMetadataUpdaterConfig;

type TokenPricesUpdaterConfigOmitted = 'setTokenPrices' | 'tokens';
export type PrivateTokenPricesUpdaterConfig = Omit<PrivateTokenPricesUpdaterProps, TokenPricesUpdaterConfigOmitted>
export type PublicTokenPricesUpdaterConfig = Omit<PublicTokenPricesUpdaterProps, TokenPricesUpdaterConfigOmitted>
export type TokenPricesUpdaterConfig = PrivateTokenPricesUpdaterConfig | PublicTokenPricesUpdaterConfig;

export interface BlockchainDataProps {
  blockUpdaterConfig: BlockNumberUpdaterConfig;
  tokenMetadataUpdaterConfig: TokenMetadataUpdaterConfig;
  tokenPriceUpdaterConfig: TokenPricesUpdaterConfig;
  children: any;
}

export const BlockchainData = (props: BlockchainDataProps) => {
  const {
    blockUpdaterConfig,
    children,
    tokenMetadataUpdaterConfig,
    tokenPriceUpdaterConfig,
  } = props;

  const bitqueryClient = new ApolloClient({
    uri: 'https://graphql.bitquery.io',
    cache: new InMemoryCache()
  });

  // Block numbers

  const [blockNumbers, setBlockNumbers] = useState<BlockNumbers>({});
  const [selectedBlockNumberChains, setSelectedBlockNumbersChains] = useState<Array<number>>([]);

  const isBlockNumberRequested = useCallback(
    (chainId: number) => !!selectedBlockNumberChains.find((value: number) => value === chainId),
    [selectedBlockNumberChains]
  );

  const requestBlockNumber = useCallback(
    (chainId: number | undefined) => {
      if (chainId === undefined || !queryNetworkIds.includes(chainId)) {
        return false;
      }

      if (isBlockNumberRequested(chainId)) {
        return true;
      }

      setSelectedBlockNumbersChains(selectedChains => [
        ...selectedChains,
        chainId,
      ]);

      return true;
    },
    [isBlockNumberRequested]
  );

  // Prices

  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const [selectedTokensForPrices, setSelectedTokensForPrices] = useState<Array<TokenId>>([]);

  const isTokenPriceRequested = useCallback(
    (tokenId: TokenId | undefined) => tokenId && !!selectedTokensForPrices.find((value: TokenId) => value === tokenId),
    [selectedTokensForPrices]
  );

  const addRequestTokenPrice = useCallback(
    (tokenId: TokenId | undefined) => {
      if (tokenId === undefined) {
        return false;
      }

      if (isTokenPriceRequested(tokenId)) {
        return true;
      }

      setSelectedTokensForPrices(selectedTokenIDs => [
        ...selectedTokenIDs,
        tokenId,
      ]);

      return true;
    },
    [isTokenPriceRequested]
  );

  const removeRequestTokenPrice = useCallback(
    (tokenId: TokenId | undefined) => {
      if (tokenId === undefined) {
        return false;
      }

      setSelectedTokensForPrices(selectedTokenIDs => selectedTokenIDs.filter((currentTokenId: TokenId) => currentTokenId !== tokenId));
      setTokenPrices(tokenPrices => ({
        ...tokenPrices,
        [tokenId]: undefined,
      }));

      return true;
    },
    []
  );

  const removeAllRequestsTokenPrice = useCallback(
    () => {
      setSelectedTokensForPrices([]);
      setTokenPrices({});
    },
    []
  );

  const isTokenPriceLoading = useCallback(
    (tokenId: TokenId | undefined) => tokenId !== undefined && tokenPrices[tokenId] === undefined && !!selectedTokensForPrices.find((value: TokenId) => value === tokenId),
    [selectedTokensForPrices, tokenPrices]
  );

  const tokenPricesUpdater = useMemo(
    () => {
      console.log(
        "BI-LIB BlockchainData Update TokenPricesUpdater",
        {
          selectedTokensForPrices,
          tokenPriceUpdaterConfig
        }
      )

      return <TokenPricesUpdater {...tokenPriceUpdaterConfig} setTokenPrices={setTokenPrices} tokens={selectedTokensForPrices}/>;
    },
    [selectedTokensForPrices, tokenPriceUpdaterConfig]
  )

  // Metadata

  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>({});
  const [selectedTokensForMetadata, setSelectedTokensForMetadata] = useState<Array<TokenId>>([]);

  const saveTokensMetadata = useCallback(
    (data: Array<Token>) => {
      console.log(
        "BI-LIB - BlockchainData - saveTokensMetadata",
        data
      );

      if (data.length > 0) {
        setTokenMetadata(tokenMetadatas => {
          const updatedMetadata = data.reduce(
            (
              result: TokenMetadata, token: Token
            ) => ({
              ...result,
              [getTokenId(token)]: { ...token },
            }),
            { ...tokenMetadatas }
          );

          console.log(
            "BI-LIB - BlockchainData - metadata saved",
            updatedMetadata
          );

          return updatedMetadata;
        })

        setSelectedTokensForMetadata(selectedTokenIDs => {
          const updatedSelectedTokenIDs = selectedTokenIDs.filter((currentId: TokenId) => !data.find((token: Token) => getTokenId(token) === currentId));

          console.log(
            "BI-LIB - BlockchainData - remove requests for tokenmetadata - Leaving requests",
            updatedSelectedTokenIDs
          );

          return updatedSelectedTokenIDs;
        });
      }
    },
    []
  )

  const tokenMetadataUpdater = useMemo(
    () => {
      console.log(
        "BI-LIB BlockchainData Update TokenMetadataUpdater",
        {
          selectedTokensForMetadata,
          tokenMetadataUpdaterConfig
        }
      )

      return <TokenMetadataUpdater {...tokenMetadataUpdaterConfig} saveTokensMetadata={saveTokensMetadata} tokenIds={selectedTokensForMetadata} />;
    },
    [saveTokensMetadata, selectedTokensForMetadata, tokenMetadataUpdaterConfig]
  )

  const isTokenMetaRequested = useCallback(
    (tokenId: TokenId) => tokenMetadata[tokenId] !== undefined || !!selectedTokensForMetadata.find((value: TokenId) => value === tokenId),
    [selectedTokensForMetadata, tokenMetadata]
  );

  const requestTokenMetadata = useCallback(
    (tokenIds: Array<TokenId>) => {
      const tokenMetadataRequested = tokenIds.map((tokenId: TokenId) => !isTokenMetaRequested(tokenId));

      const validTokenIds = tokenIds.filter((tokenId: TokenId) => !isTokenMetaRequested(tokenId));
      if (validTokenIds.length > 0) {
        console.log(
          "BI-LIB - BlockchainData - Request Token Metadata",
          validTokenIds
        );

        setSelectedTokensForMetadata(selectedTokensForMetadata => selectedTokensForMetadata.concat(validTokenIds));
      }

      return tokenMetadataRequested;
    },
    [isTokenMetaRequested]
  );

  return (
    <BlockchainDataContext.Provider
      value={{
        blockNumbers,
        requestBlockNumber,
        tokenMetadata,
        requestTokenMetadata,
        tokenPrices,
        addRequestTokenPrice,
        removeRequestTokenPrice,
        removeAllRequestsTokenPrice,
        isTokenPriceLoading,
      }}
    >
      <ApolloProvider client={bitqueryClient}>
        <BlockNumberUpdater {...blockUpdaterConfig} setBlockNumbers={setBlockNumbers} chains={selectedBlockNumberChains} />
        {tokenMetadataUpdater}
        {tokenPricesUpdater}
      </ApolloProvider>

      {children}
    </BlockchainDataContext.Provider>
  )
}
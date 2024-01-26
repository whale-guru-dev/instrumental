import { providers } from '@0xsequence/multicall'
import { getPriorityConnector } from '@web3-react/core'
import { ethers } from "ethers";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { EagerlyConnect } from '../components';
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";
import { initializeWalletConnectConnector } from "../connectors/walletConnect";
import { BlockchainData, BlockNumberUpdaterConfig, PrivateTokenMetadataUpdaterConfig, PrivateTokenPricesUpdaterConfig, PublicTokenMetadataUpdaterConfig, PublicTokenPricesUpdaterConfig } from '../data';
import { connectorToConnectorType, NonStaticConnectorType, NonStaticConnectorTypeValues } from "../hooks/useConnector";
import { BlockchainProviderContext, Connectors, SupportedBlockchainProviderDescriptor, SupportedBlockchainProvidersDescriptor } from "./BlockchainProviderContext";

export interface Chain {
  chainId: number;
  rpcUrl: string;
}

type BlockNumberPackagePropsOmitted = 'chains';
type BlockNumberPackageProps = Omit<BlockNumberUpdaterConfig, BlockNumberPackagePropsOmitted>

type TokenMetadataPackagePropsOmitted = 'tokens';

type PrivateTokenMetadataPackageProps = Omit<PrivateTokenMetadataUpdaterConfig, TokenMetadataPackagePropsOmitted>
type PublicTokenMetadataPackageProps = Omit<PublicTokenMetadataUpdaterConfig, TokenMetadataPackagePropsOmitted>
type TokenMetadataPackageProps = PrivateTokenMetadataPackageProps | PublicTokenMetadataPackageProps;

type TokenPricePackagePropsOmitted = 'tokens';

type PrivateTokenPricesPackageProps = Omit<PrivateTokenPricesUpdaterConfig, TokenPricePackagePropsOmitted>
type PublicTokenPricesPackageProps = Omit<PublicTokenPricesUpdaterConfig, TokenPricePackagePropsOmitted>
type TokenPricesPackageProps = PrivateTokenPricesPackageProps | PublicTokenPricesPackageProps;

export interface UpdatersConfig {
  blockNumberUpdater: BlockNumberPackageProps;
  tokenMetadataUpdater: TokenMetadataPackageProps;
  tokenPricesUpdater: TokenPricesPackageProps;
}

export interface BlockchainProviderProps {
  children: any;
  supportedChains: Array<Chain>;
  updatersConfig: UpdatersConfig;
}

export type PriorityConnector = ReturnType<typeof getPriorityConnector>;

export const BlockchainProvider = (props: BlockchainProviderProps) => {
  const {
    supportedChains, updatersConfig
  } = props;

  const {
    blockNumberUpdater,
    tokenMetadataUpdater,
    tokenPricesUpdater,
  } = updatersConfig;

  const [blockchainProviders, setBlockchainProviders] = useState<SupportedBlockchainProvidersDescriptor>({});

  const rpcUrls = useMemo(
    () =>
      supportedChains.reduce(
        (
          rpcUrls, current
        ) => ({
          ...rpcUrls,
          [current.chainId]: current.rpcUrl
        }),
        {}
      ),
    [supportedChains]
  )

  const connectors : Connectors = useMemo(
    () => {
      const [hooks, walletConnect] = initializeWalletConnectConnector(rpcUrls);
      return {
        metamask: [metaMask, metaMaskHooks],
        walletConnect: [hooks, walletConnect],
      }
    },
    [rpcUrls]
  )

  const priorityConnector : PriorityConnector = useMemo(
    () => {
      const connectorsArray = Object.values(connectors);
      return getPriorityConnector(...connectorsArray);
    },
    [connectors]
  );

  const {
    usePriorityConnector,
    useSelectedAccount,
    useSelectedChainId,
    useSelectedProvider,
  } = priorityConnector;

  const connector = usePriorityConnector();

  const selectedProvider = useSelectedProvider(connector);
  const selectedChainId = useSelectedChainId(connector);
  const selectedConnectorType = connectorToConnectorType(connector);
  const selectedAccount = useSelectedAccount(connector);

  const createSelectedProvider = useCallback(
    (chain: Chain) : SupportedBlockchainProviderDescriptor => {
      const { rpcUrl } = chain;

      const provider = selectedProvider || new ethers.providers.StaticJsonRpcProvider(rpcUrl);

      return {
        account: selectedAccount,
        chainId: selectedChainId,
        connectorType: selectedConnectorType,
        signer: selectedProvider?.getSigner(),
        provider: new providers.MulticallProvider(provider),
      };
    },
    [selectedAccount, selectedChainId, selectedConnectorType, selectedProvider]
  );

  const createStaticProvider = useCallback(
    (chain: Chain) : SupportedBlockchainProviderDescriptor => {
      const {
        chainId,
        rpcUrl,
      } = chain;

      const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);

      return {
        chainId: chainId,
        connectorType: "static",
        signer: provider.getSigner(),
        provider: new providers.MulticallProvider(provider),
      };
    },
    []
  );

  useEffect(
    () => {
      const providers = supportedChains.reduce(
        (
          providers: SupportedBlockchainProvidersDescriptor, chain: Chain
        ) => {
          providers[chain.chainId] = selectedChainId === chain.chainId ? createSelectedProvider(chain) : createStaticProvider(chain);

          return providers;
        },
        {}
      )

      setBlockchainProviders(providers);
    },
    [supportedChains, createSelectedProvider, createStaticProvider, selectedChainId]
  );

  return (
    <BlockchainProviderContext.Provider
      value={{
        blockchainProviders,
        connectors,
      }}
    >
      {NonStaticConnectorTypeValues.map((connectorType: NonStaticConnectorType) =>
        <EagerlyConnect key={connectorType} connectorType={connectorType}/>)}

      <BlockchainData
        blockUpdaterConfig={blockNumberUpdater}
        tokenMetadataUpdaterConfig={tokenMetadataUpdater}
        tokenPriceUpdaterConfig={tokenPricesUpdater}
      >
        {props.children}
      </BlockchainData>
    </BlockchainProviderContext.Provider>
  );
};

export const blockchainProviderDefaultProps = {
  updatersConfig: {
    blockNumberUpdater: { type: 'etherjs' },
    tokenMetadataUpdater: {
      type: 'moralis',
      apiKey: ''
    },
    tokenPricesUpdater: {
      type: 'moralis',
      apiKey: ''
    }
  }
}

BlockchainProvider.defaultProps = blockchainProviderDefaultProps

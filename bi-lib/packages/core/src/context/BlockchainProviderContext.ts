import { providers } from '@0xsequence/multicall'
import { Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { ethers, Signer } from "ethers";
import { createContext } from "react";

import { ConnectorType, NonStaticConnectorType } from '../hooks';

export type ConnectorData = [Connector, Web3ReactHooks];

export type Connectors = {
  [key in NonStaticConnectorType]: ConnectorData;
}

export type EthersProvider =
  | ethers.providers.StaticJsonRpcProvider
  | ethers.providers.Web3Provider

export interface SupportedBlockchainProviderDescriptor {
  account?: ReturnType<Web3ReactHooks['useAccount']>;
  chainId?: ReturnType<Web3ReactHooks['useChainId']>;
  connectorType?: ConnectorType;
  provider?: providers.MulticallProvider;
  signer?: Signer;
}

export interface SupportedBlockchainProvidersDescriptor {
  [chainId: number]: SupportedBlockchainProviderDescriptor;
}

export type BlockchainProviderValues = {
  blockchainProviders: SupportedBlockchainProvidersDescriptor;
  connectors: Partial<Connectors>;
}

export const BlockchainProviderContext = createContext<BlockchainProviderValues>({
  blockchainProviders: {},
  connectors: {},
});
import { Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask';
import { Connector as Web3ReactConnector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';
import { useContext } from 'react';

import { BlockchainProviderContext, ConnectorData } from '../context/BlockchainProviderContext';
import { Token } from '../utils';

export const NonStaticConnectorTypeValues = [
  "metamask",
  "walletConnect",
] as const;

export type NonStaticConnectorType = typeof NonStaticConnectorTypeValues[number]

export const ConnectorTypeValues = [
  ...NonStaticConnectorTypeValues,
  "static",
] as const;

export type ConnectorType = typeof ConnectorTypeValues[number]

export const connectorToConnectorType = (connector: Web3ReactConnector) => {
  if (connector instanceof MetaMask) {
    return "metamask"
  } else if (connector instanceof WalletConnect) {
    return "walletConnect"
  }

  return "static";
}

export interface Connector {
  account?: ReturnType<Web3ReactHooks['useAccount']>;
  accounts?: ReturnType<Web3ReactHooks['useAccounts']>;
  activate: Web3ReactConnector['activate'],
  chainId?: ReturnType<Web3ReactHooks['useChainId']>;
  deactivate: Web3ReactConnector['deactivate'],
  isActivating?: ReturnType<Web3ReactHooks['useIsActivating']>;
  isActive?: ReturnType<Web3ReactHooks['useIsActive']>;
  watchAsset?: Web3ReactConnector['watchAsset'];
}

export const useConnector = (type: NonStaticConnectorType) : Connector => {
  const { connectors } = useContext(BlockchainProviderContext);

  const [connector, hooks] = connectors[type] as ConnectorData;

  const activate = (chainId?: number) => connector.activate(chainId);
  const deactivate = () => connector.deactivate?.();

  const {
    useAccount,
    useAccounts,
    useChainId,
    useIsActivating,
    useIsActive,
  } = hooks;

  const watchAsset = (token: Token) => {
    if (!connector.watchAsset) {
      return Promise.reject("useConnector - watchAsset undefined for selected connector");
    }

    return connector.watchAsset(token);
  };

  return {
    account: useAccount(),
    accounts: useAccounts(),
    activate,
    chainId: useChainId(),
    deactivate,
    isActivating: useIsActivating(),
    isActive: useIsActive(),
    watchAsset,
  };
};

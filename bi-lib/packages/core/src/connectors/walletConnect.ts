import { initializeConnector } from '@web3-react/core'
import { WalletConnect, WalletConnectConstructorArgs } from '@web3-react/walletconnect'

export type RpcUrls = WalletConnectConstructorArgs['options']['rpc']

export const initializeWalletConnectConnector = (rpc: RpcUrls) => initializeConnector<WalletConnect>((actions) => new WalletConnect({
  actions,
  options: { rpc }
}))
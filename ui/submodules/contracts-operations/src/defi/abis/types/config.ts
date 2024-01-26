import { EthersContractContextV5 } from 'ethereum-abi-types-generator';
import {
  BigNumber,
  BigNumberish,
  ContractTransaction,
} from 'ethers';

export type ContractContext = EthersContractContextV5<
  Config,
  ConfigMethodNames,
  ConfigEventsContext,
  ConfigEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type ConfigEvents =
  | 'AMMAdded'
  | 'AMMRemoved'
  | 'LockupTimeChanged'
  | 'MaxFeeChanged'
  | 'MaxLiquidityBlockChanged'
  | 'MinFeeChanged'
  | 'MinLiquidityBlockChanged'
  | 'OwnershipTransferred'
  | 'PauseNetwork'
  | 'RemoteTokenAdded'
  | 'RemoteTokenRemoved'
  | 'TokenCreated'
  | 'TokenWhitelistRemoved'
  | 'TokenWhitelisted'
  | 'UnpauseNetwork';
export interface ConfigEventsContext {
  AMMAdded(...parameters: any): EventFilter;
  AMMRemoved(...parameters: any): EventFilter;
  LockupTimeChanged(...parameters: any): EventFilter;
  MaxFeeChanged(...parameters: any): EventFilter;
  MaxLiquidityBlockChanged(...parameters: any): EventFilter;
  MinFeeChanged(...parameters: any): EventFilter;
  MinLiquidityBlockChanged(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  PauseNetwork(...parameters: any): EventFilter;
  RemoteTokenAdded(...parameters: any): EventFilter;
  RemoteTokenRemoved(...parameters: any): EventFilter;
  TokenCreated(...parameters: any): EventFilter;
  TokenWhitelistRemoved(...parameters: any): EventFilter;
  TokenWhitelisted(...parameters: any): EventFilter;
  UnpauseNetwork(...parameters: any): EventFilter;
}
export type ConfigMethodNames =
  | 'TOKEN_RATIO'
  | 'ableToPerformSmallBalanceSwap'
  | 'addSupportedAMM'
  | 'addSupportedMosaicNativeSwapper'
  | 'addTokenInNetwork'
  | 'addWhitelistedToken'
  | 'changeRemoteTokenRatio'
  | 'generateId'
  | 'getMosaicHolding'
  | 'getUnderlyingIOUAddress'
  | 'getUnderlyingReceiptAddress'
  | 'inTokenTransferLimits'
  | 'initialize'
  | 'maxFee'
  | 'maxLimitLiquidityBlocks'
  | 'minFee'
  | 'minLimitLiquidityBlocks'
  | 'mosaicHolding'
  | 'owner'
  | 'passiveLiquidityLocktime'
  | 'pauseNetwork'
  | 'pausedNetwork'
  | 'remoteTokenAddress'
  | 'remoteTokenRatio'
  | 'removeSupportedAMM'
  | 'removeSupportedMosaicNativeSwapper'
  | 'removeTokenInNetwork'
  | 'removeWhitelistedToken'
  | 'renounceOwnership'
  | 'setAbleToPerformSmallBalanceSwap'
  | 'setMaxFee'
  | 'setMaxLimitLiquidityBlocks'
  | 'setMinFee'
  | 'setMinLimitLiquidityBlocks'
  | 'setPassiveLiquidityLocktime'
  | 'setTokenFactoryAddress'
  | 'setVault'
  | 'setWethAddress'
  | 'supportedAMMs'
  | 'supportedMosaicNativeSwappers'
  | 'transferOwnership'
  | 'unpauseNetwork'
  | 'vault'
  | 'wethAddress'
  | 'whitelistedTokens';
export interface AMMAddedEventEmittedResponse {
  _id: BigNumberish;
  _address: string;
}
export interface AMMRemovedEventEmittedResponse {
  _id: BigNumberish;
}
export interface LockupTimeChangedEventEmittedResponse {
  owner: string;
  oldVal: BigNumberish;
  newVal: BigNumberish;
  valType: string;
}
export interface MaxFeeChangedEventEmittedResponse {
  newMaxFee: BigNumberish;
}
export interface MaxLiquidityBlockChangedEventEmittedResponse {
  newMaxLimitLiquidityBlocks: BigNumberish;
}
export interface MinFeeChangedEventEmittedResponse {
  newMinFee: BigNumberish;
}
export interface MinLiquidityBlockChangedEventEmittedResponse {
  newMinLimitLiquidityBlocks: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface PauseNetworkEventEmittedResponse {
  admin: string;
  networkID: BigNumberish;
}
export interface RemoteTokenAddedEventEmittedResponse {
  erc20: string;
  remoteErc20: string;
  remoteNetworkID: BigNumberish;
  remoteTokenRatio: BigNumberish;
}
export interface RemoteTokenRemovedEventEmittedResponse {
  erc20: string;
  remoteNetworkID: BigNumberish;
}
export interface TokenCreatedEventEmittedResponse {
  _underlyingToken: string;
}
export interface TokenWhitelistRemovedEventEmittedResponse {
  erc20: string;
}
export interface TokenWhitelistedEventEmittedResponse {
  erc20: string;
  newIou: string;
  newReceipt: string;
}
export interface UnpauseNetworkEventEmittedResponse {
  admin: string;
  networkID: BigNumberish;
}
export interface WhitelistedTokensResponse {
  minTransferAllowed: BigNumber;
  0: BigNumber;
  maxTransferAllowed: BigNumber;
  1: BigNumber;
  underlyingIOUAddress: string;
  2: string;
  underlyingReceiptAddress: string;
  3: string;
  length: 4;
}
export interface Config {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  TOKEN_RATIO(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ableToPerformSmallBalanceSwap(
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _ammID Type: uint256, Indexed: false
   * @param _ammAddress Type: address, Indexed: false
   */
  addSupportedAMM(
    _ammID: BigNumberish,
    _ammAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _mosaicNativeSwapperID Type: uint256, Indexed: false
   * @param _mosaicNativeSwapperAddress Type: address, Indexed: false
   */
  addSupportedMosaicNativeSwapper(
    _mosaicNativeSwapperID: BigNumberish,
    _mosaicNativeSwapperAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _tokenAddressRemote Type: address, Indexed: false
   * @param _remoteNetworkID Type: uint256, Indexed: false
   * @param _remoteTokenRatio Type: uint256, Indexed: false
   */
  addTokenInNetwork(
    _tokenAddress: string,
    _tokenAddressRemote: string,
    _remoteNetworkID: BigNumberish,
    _remoteTokenRatio: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _minTransferAmount Type: uint256, Indexed: false
   * @param _maxTransferAmount Type: uint256, Indexed: false
   */
  addWhitelistedToken(
    _tokenAddress: string,
    _minTransferAmount: BigNumberish,
    _maxTransferAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _remoteNetworkID Type: uint256, Indexed: false
   * @param _remoteTokenRatio Type: uint256, Indexed: false
   */
  changeRemoteTokenRatio(
    _tokenAddress: string,
    _remoteNetworkID: BigNumberish,
    _remoteTokenRatio: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  generateId(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMosaicHolding(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _token Type: address, Indexed: false
   */
  getUnderlyingIOUAddress(
    _token: string,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _token Type: address, Indexed: false
   */
  getUnderlyingReceiptAddress(
    _token: string,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  inTokenTransferLimits(
    _token: string,
    _amount: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _mosaicHolding Type: address, Indexed: false
   */
  initialize(
    _mosaicHolding: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  maxFee(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  maxLimitLiquidityBlocks(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  minFee(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  minLimitLiquidityBlocks(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  mosaicHolding(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  passiveLiquidityLocktime(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _networkID Type: uint256, Indexed: false
   */
  pauseNetwork(
    _networkID: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  pausedNetwork(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   */
  remoteTokenAddress(
    parameter0: BigNumberish,
    parameter1: string,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   */
  remoteTokenRatio(
    parameter0: BigNumberish,
    parameter1: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _ammID Type: uint256, Indexed: false
   */
  removeSupportedAMM(
    _ammID: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _mosaicNativeSwapperID Type: uint256, Indexed: false
   */
  removeSupportedMosaicNativeSwapper(
    _mosaicNativeSwapperID: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _remoteNetworkID Type: uint256, Indexed: false
   */
  removeTokenInNetwork(
    _tokenAddress: string,
    _remoteNetworkID: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   */
  removeWhitelistedToken(
    _tokenAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _flag Type: bool, Indexed: false
   */
  setAbleToPerformSmallBalanceSwap(
    _flag: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newMaxFee Type: uint256, Indexed: false
   */
  setMaxFee(
    _newMaxFee: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newMaxLimitLiquidityBlocks Type: uint256, Indexed: false
   */
  setMaxLimitLiquidityBlocks(
    _newMaxLimitLiquidityBlocks: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newMinFee Type: uint256, Indexed: false
   */
  setMinFee(
    _newMinFee: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newMinLimitLiquidityBlocks Type: uint256, Indexed: false
   */
  setMinLimitLiquidityBlocks(
    _newMinLimitLiquidityBlocks: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _locktime Type: uint256, Indexed: false
   */
  setPassiveLiquidityLocktime(
    _locktime: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenFactoryAddress Type: address, Indexed: false
   */
  setTokenFactoryAddress(
    _tokenFactoryAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _vault Type: address, Indexed: false
   */
  setVault(
    _vault: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _weth Type: address, Indexed: false
   * @param _minTransferAmount Type: uint256, Indexed: false
   * @param _maxTransferAmount Type: uint256, Indexed: false
   */
  setWethAddress(
    _weth: string,
    _minTransferAmount: BigNumberish,
    _maxTransferAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  supportedAMMs(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  supportedMosaicNativeSwappers(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _networkID Type: uint256, Indexed: false
   */
  unpauseNetwork(
    _networkID: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  vault(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  wethAddress(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  whitelistedTokens(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<WhitelistedTokensResponse>;
}

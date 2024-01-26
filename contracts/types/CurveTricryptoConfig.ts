import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  CurveTricryptoConfig,
  CurveTricryptoConfigMethodNames,
  CurveTricryptoConfigEventsContext,
  CurveTricryptoConfigEvents
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
export type CurveTricryptoConfigEvents =
  | 'BridgeManagerSet'
  | 'CrvTokenSet'
  | 'CurrentFeeChanged'
  | 'FeeAddressSet'
  | 'GaugeSet'
  | 'KeeperSet'
  | 'LPVaultSet'
  | 'MaxFeeChanged'
  | 'MinFeeChanged'
  | 'MinterSet'
  | 'OwnershipTransferred'
  | 'RewardTokenSet'
  | 'RewardTokenStatusChange'
  | 'SwapVaultSet'
  | 'TricryptoTokenSet'
  | 'UnderlyingAssetNoChange'
  | 'UnderlyingWhitelistStatusChange'
  | 'WethTokenSet';
export interface CurveTricryptoConfigEventsContext {
  BridgeManagerSet(...parameters: any): EventFilter;
  CrvTokenSet(...parameters: any): EventFilter;
  CurrentFeeChanged(...parameters: any): EventFilter;
  FeeAddressSet(...parameters: any): EventFilter;
  GaugeSet(...parameters: any): EventFilter;
  KeeperSet(...parameters: any): EventFilter;
  LPVaultSet(...parameters: any): EventFilter;
  MaxFeeChanged(...parameters: any): EventFilter;
  MinFeeChanged(...parameters: any): EventFilter;
  MinterSet(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  RewardTokenSet(...parameters: any): EventFilter;
  RewardTokenStatusChange(...parameters: any): EventFilter;
  SwapVaultSet(...parameters: any): EventFilter;
  TricryptoTokenSet(...parameters: any): EventFilter;
  UnderlyingAssetNoChange(...parameters: any): EventFilter;
  UnderlyingWhitelistStatusChange(...parameters: any): EventFilter;
  WethTokenSet(...parameters: any): EventFilter;
}
export type CurveTricryptoConfigMethodNames =
  | 'new'
  | 'addRewardToken'
  | 'bridgeManager'
  | 'crvToken'
  | 'currentFee'
  | 'feeAddress'
  | 'getRewardTokensArray'
  | 'keeper'
  | 'maxFee'
  | 'minFee'
  | 'minter'
  | 'owner'
  | 'removeRewardToken'
  | 'removeUnderlyingFromWhitelist'
  | 'renounceOwnership'
  | 'setBridgeManager'
  | 'setCrvToken'
  | 'setCurrentFee'
  | 'setFeeAddress'
  | 'setGaugeVault'
  | 'setKeeper'
  | 'setLPVault'
  | 'setMaxFee'
  | 'setMinFee'
  | 'setMinter'
  | 'setSwapVault'
  | 'setTricryptoToken'
  | 'setUnderlyingAssetsNumber'
  | 'setWethToken'
  | 'transferOwnership'
  | 'tricryptoGauge'
  | 'tricryptoLPVault'
  | 'tricryptoSwap'
  | 'tricryptoToken'
  | 'underlyingAssets'
  | 'underlyingAssetsNo'
  | 'wethToken'
  | 'whitelistUnderlying'
  | 'whitelistedRewardTokens';
export interface BridgeManagerSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface CrvTokenSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface CurrentFeeChangedEventEmittedResponse {
  newMinFee: BigNumberish;
}
export interface FeeAddressSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface GaugeSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface KeeperSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface LPVaultSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface MaxFeeChangedEventEmittedResponse {
  newMaxFee: BigNumberish;
}
export interface MinFeeChangedEventEmittedResponse {
  newMinFee: BigNumberish;
}
export interface MinterSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface RewardTokenSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface RewardTokenStatusChangeEventEmittedResponse {
  owner: string;
  token: string;
  whitelisted: boolean;
}
export interface SwapVaultSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface TricryptoTokenSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface UnderlyingAssetNoChangeEventEmittedResponse {
  owner: string;
  newNo: BigNumberish;
  previousNo: BigNumberish;
}
export interface UnderlyingWhitelistStatusChangeEventEmittedResponse {
  underlying: string;
  owner: string;
  whitelisted: boolean;
}
export interface WethTokenSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface CurveTricryptoConfig {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _lpVault Type: address, Indexed: false
   * @param _gauge Type: address, Indexed: false
   * @param _minter Type: address, Indexed: false
   * @param _i Type: uint256, Indexed: false
   * @param _weth Type: address, Indexed: false
   */
  'new'(
    _lpVault: string,
    _gauge: string,
    _minter: string,
    _i: BigNumberish,
    _weth: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _addr Type: address, Indexed: false
   */
  addRewardToken(
    _addr: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  bridgeManager(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  crvToken(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  currentFee(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  feeAddress(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getRewardTokensArray(overrides?: ContractCallOverrides): Promise<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  keeper(overrides?: ContractCallOverrides): Promise<string>;
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
  minFee(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  minter(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _addr Type: address, Indexed: false
   */
  removeRewardToken(
    _addr: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _underlying Type: address, Indexed: false
   */
  removeUnderlyingFromWhitelist(
    _underlying: string,
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
   * @param _addr Type: address, Indexed: false
   */
  setBridgeManager(
    _addr: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _crv Type: address, Indexed: false
   */
  setCrvToken(
    _crv: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _fee Type: uint256, Indexed: false
   */
  setCurrentFee(
    _fee: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _addr Type: address, Indexed: false
   */
  setFeeAddress(
    _addr: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _addr Type: address, Indexed: false
   */
  setGaugeVault(
    _addr: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _addr Type: address, Indexed: false
   */
  setKeeper(
    _addr: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _addr Type: address, Indexed: false
   */
  setLPVault(
    _addr: string,
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
   * @param _addr Type: address, Indexed: false
   */
  setMinter(
    _addr: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _addr Type: address, Indexed: false
   */
  setSwapVault(
    _addr: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   */
  setTricryptoToken(
    _token: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param i Type: uint256, Indexed: false
   */
  setUnderlyingAssetsNumber(
    i: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _weth Type: address, Indexed: false
   */
  setWethToken(
    _weth: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  tricryptoGauge(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  tricryptoLPVault(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  tricryptoSwap(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  tricryptoToken(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  underlyingAssets(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  underlyingAssetsNo(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  wethToken(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _underlying Type: address, Indexed: false
   */
  whitelistUnderlying(
    _underlying: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  whitelistedRewardTokens(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
}

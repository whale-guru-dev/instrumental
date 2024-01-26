import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  SushiSlpConfig,
  SushiSlpConfigMethodNames,
  SushiSlpConfigEventsContext,
  SushiSlpConfigEvents
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
export type SushiSlpConfigEvents =
  | 'BridgeManagerAddressSet'
  | 'CurrentFeeChanged'
  | 'FeeAddressSet'
  | 'KeeperSet'
  | 'MasterChefSet'
  | 'MaxFeeChanged'
  | 'MinFeeChanged'
  | 'OwnershipTransferred'
  | 'PidSet'
  | 'RewardTokenSet'
  | 'RewardTokenStatusChange'
  | 'RouterSet'
  | 'SlpTokenSet'
  | 'StrategyAddressSet'
  | 'SushiTokenSet'
  | 'WethTokenSet'
  | 'WithdrawalPaused'
  | 'WithdrawalResumed';
export interface SushiSlpConfigEventsContext {
  BridgeManagerAddressSet(...parameters: any): EventFilter;
  CurrentFeeChanged(...parameters: any): EventFilter;
  FeeAddressSet(...parameters: any): EventFilter;
  KeeperSet(...parameters: any): EventFilter;
  MasterChefSet(...parameters: any): EventFilter;
  MaxFeeChanged(...parameters: any): EventFilter;
  MinFeeChanged(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  PidSet(...parameters: any): EventFilter;
  RewardTokenSet(...parameters: any): EventFilter;
  RewardTokenStatusChange(...parameters: any): EventFilter;
  RouterSet(...parameters: any): EventFilter;
  SlpTokenSet(...parameters: any): EventFilter;
  StrategyAddressSet(...parameters: any): EventFilter;
  SushiTokenSet(...parameters: any): EventFilter;
  WethTokenSet(...parameters: any): EventFilter;
  WithdrawalPaused(...parameters: any): EventFilter;
  WithdrawalResumed(...parameters: any): EventFilter;
}
export type SushiSlpConfigMethodNames =
  | 'new'
  | 'addRewardToken'
  | 'bridgeManager'
  | 'currentFee'
  | 'feeAddress'
  | 'getRewardTokensArray'
  | 'isToken0Weth'
  | 'isToken1Weth'
  | 'isWithdrawalPaused'
  | 'keeper'
  | 'masterChef'
  | 'maxFee'
  | 'minFee'
  | 'owner'
  | 'pauseWithdrawal'
  | 'pid'
  | 'removeRewardToken'
  | 'renounceOwnership'
  | 'resumeWithdrawal'
  | 'router'
  | 'setBridgeManager'
  | 'setCurrentFee'
  | 'setFeeAddress'
  | 'setKeeper'
  | 'setMasterChef'
  | 'setMaxFee'
  | 'setMinFee'
  | 'setPid'
  | 'setRouter'
  | 'setSlpToken'
  | 'setStrategyAddress'
  | 'setSushiToken'
  | 'setWethToken'
  | 'slpToken'
  | 'strategyAddress'
  | 'sushiToken'
  | 'transferOwnership'
  | 'wethToken'
  | 'whitelistedRewardTokens';
export interface BridgeManagerAddressSetEventEmittedResponse {
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
export interface KeeperSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface MasterChefSetEventEmittedResponse {
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
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface PidSetEventEmittedResponse {
  owner: string;
  newVal: BigNumberish;
  oldVal: BigNumberish;
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
export interface RouterSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface SlpTokenSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface StrategyAddressSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface SushiTokenSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface WethTokenSetEventEmittedResponse {
  owner: string;
  newAddr: string;
  oldAddr: string;
}
export interface WithdrawalPausedEventEmittedResponse {
  owner: string;
}
export interface WithdrawalResumedEventEmittedResponse {
  owner: string;
}
export interface SushiSlpConfig {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _masterChef Type: address, Indexed: false
   * @param _router Type: address, Indexed: false
   * @param _pid Type: uint256, Indexed: false
   * @param _weth Type: address, Indexed: false
   */
  'new'(
    _masterChef: string,
    _router: string,
    _pid: BigNumberish,
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
  isToken0Weth(overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  isToken1Weth(overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  isWithdrawalPaused(overrides?: ContractCallOverrides): Promise<boolean>;
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
  masterChef(overrides?: ContractCallOverrides): Promise<string>;
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
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  pauseWithdrawal(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  pid(overrides?: ContractCallOverrides): Promise<BigNumber>;
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
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  resumeWithdrawal(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  router(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _bridgeManager Type: address, Indexed: false
   */
  setBridgeManager(
    _bridgeManager: string,
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
  setKeeper(
    _addr: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _masterChef Type: address, Indexed: false
   */
  setMasterChef(
    _masterChef: string,
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
   * @param _pid Type: uint256, Indexed: false
   */
  setPid(
    _pid: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _router Type: address, Indexed: false
   */
  setRouter(
    _router: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   */
  setSlpToken(
    _token: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _strategy Type: address, Indexed: false
   */
  setStrategyAddress(
    _strategy: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _sushi Type: address, Indexed: false
   */
  setSushiToken(
    _sushi: string,
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  slpToken(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  strategyAddress(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  sushiToken(overrides?: ContractCallOverrides): Promise<string>;
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
  wethToken(overrides?: ContractCallOverrides): Promise<string>;
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

import { EthersContractContextV5 } from 'ethereum-abi-types-generator';
import {
  BigNumber,
  BigNumberish,
  BytesLike as Arrayish,
  ContractTransaction,
} from 'ethers';

export type ContractContext = EthersContractContextV5<
  CurveTricryptoStrategy,
  CurveTricryptoStrategyMethodNames,
  CurveTricryptoStrategyEventsContext,
  CurveTricryptoStrategyEvents
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
export type CurveTricryptoStrategyEvents =
  | 'CRVRewardClaimed'
  | 'Deposit'
  | 'EmergencySaveInitialized'
  | 'EmergencySaveTriggered'
  | 'ExtraRewardClaimed'
  | 'FeeTaken'
  | 'OwnershipTransferred'
  | 'Withdraw'
  | 'WithdrawalPaused'
  | 'WithdrawalResumed';
export interface CurveTricryptoStrategyEventsContext {
  CRVRewardClaimed(...parameters: any): EventFilter;
  Deposit(...parameters: any): EventFilter;
  EmergencySaveInitialized(...parameters: any): EventFilter;
  EmergencySaveTriggered(...parameters: any): EventFilter;
  ExtraRewardClaimed(...parameters: any): EventFilter;
  FeeTaken(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  Withdraw(...parameters: any): EventFilter;
  WithdrawalPaused(...parameters: any): EventFilter;
  WithdrawalResumed(...parameters: any): EventFilter;
}
export type CurveTricryptoStrategyMethodNames =
  | 'new'
  | 'claimOtherRewards'
  | 'deposit'
  | 'emergencySave'
  | 'emergencyTimestamp'
  | 'emergencyWindow'
  | 'getPendingRewards'
  | 'getUserInfo'
  | 'initEmergency'
  | 'isWithdrawalPaused'
  | 'owner'
  | 'pauseWithdrawal'
  | 'receiveBackLPs'
  | 'renounceOwnership'
  | 'resumeWithdrawal'
  | 'rewardsStartime'
  | 'stakeIntoGauge'
  | 'tokenRewards'
  | 'totalAmountOfLPs'
  | 'transferLPs'
  | 'transferOwnership'
  | 'tricryptoConfig'
  | 'updateRewards'
  | 'userHistory'
  | 'userInfo'
  | 'withdraw';
export interface CRVRewardClaimedEventEmittedResponse {
  user: string;
  amount: BigNumberish;
}
export interface DepositEventEmittedResponse {
  user: string;
  asset: string;
  amount: BigNumberish;
  lpAmount: BigNumberish;
}
export interface EmergencySaveInitializedEventEmittedResponse {
  owner: string;
}
export interface EmergencySaveTriggeredEventEmittedResponse {
  owner: string;
}
export interface ExtraRewardClaimedEventEmittedResponse {
  user: string;
  token: string;
  amount: BigNumberish;
}
export interface FeeTakenEventEmittedResponse {
  user: string;
  asset: string;
  amount: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface WithdrawEventEmittedResponse {
  user: string;
  asset: string;
  lpAmount: BigNumberish;
  assetAmount: BigNumberish;
  crvRewards: BigNumberish;
  claimOtherTokens: boolean;
}
export interface WithdrawalPausedEventEmittedResponse {
  owner: string;
}
export interface WithdrawalResumedEventEmittedResponse {
  owner: string;
}
export interface UserinfoResponse {
  lastDepositTimestamp: BigNumber;
  0: BigNumber;
  lastLPAmount: BigNumber;
  1: BigNumber;
  accruedCrvRewards: BigNumber;
  2: BigNumber;
}
export interface UserInfoResponse {
  lastDepositTimestamp: BigNumber;
  0: BigNumber;
  lastLPAmount: BigNumber;
  1: BigNumber;
  accruedCrvRewards: BigNumber;
  2: BigNumber;
  length: 3;
}
export interface WithdrawRequest {
  _assetMinAmount: BigNumberish;
  _claimOtherRewards: boolean;
}
export interface CurveTricryptoStrategy {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _config Type: address, Indexed: false
   */
  'new'(
    _config: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  claimOtherRewards(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _asset Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   * @param _minLpAmount Type: uint256, Indexed: false
   */
  deposit(
    _asset: string,
    _amount: BigNumberish,
    _minLpAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  emergencySave(
    _token: string,
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  emergencyTimestamp(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  emergencyWindow(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _user Type: address, Indexed: false
   */
  getPendingRewards(
    _user: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _user Type: address, Indexed: false
   */
  getUserInfo(
    _user: string,
    overrides?: ContractCallOverrides
  ): Promise<UserinfoResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  initEmergency(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _asset Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   * @param _minLpAmount Type: uint256, Indexed: false
   */
  receiveBackLPs(
    _asset: string,
    _amount: BigNumberish,
    _minLpAmount: BigNumberish,
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
  rewardsStartime(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _lpAmount Type: uint256, Indexed: false
   */
  stakeIntoGauge(
    _lpAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokens Type: address[], Indexed: false
   * @param _user Type: address, Indexed: false
   */
  tokenRewards(
    tokens: string[],
    _user: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalAmountOfLPs(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param bridgeId Type: uint256, Indexed: false
   * @param _destinationNetworkId Type: uint256, Indexed: false
   * @param unwrap Type: bool, Indexed: false
   * @param wethMinAmount Type: uint256, Indexed: false
   * @param lpAmountToTransfer Type: uint256, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  transferLPs(
    bridgeId: BigNumberish,
    _destinationNetworkId: BigNumberish,
    unwrap: boolean,
    wethMinAmount: BigNumberish,
    lpAmountToTransfer: BigNumberish,
    _data: Arrayish,
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
  tricryptoConfig(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  updateRewards(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  userHistory(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  userInfo(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<UserInfoResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _amount Type: uint256, Indexed: false
   * @param _asset Type: address, Indexed: false
   * @param params Type: tuple, Indexed: false
   */
  withdraw(
    _amount: BigNumberish,
    _asset: string,
    params: WithdrawRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}

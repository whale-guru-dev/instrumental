import { EthersContractContextV5 } from 'ethereum-abi-types-generator';
import {
  BigNumber,
  BigNumberish,
  BytesLike as Arrayish,
  ContractTransaction,
} from 'ethers';

export type ContractContext = EthersContractContextV5<
  SushiSlpStrategy,
  SushiSlpStrategyMethodNames,
  SushiSlpStrategyEventsContext,
  SushiSlpStrategyEvents
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
export type SushiSlpStrategyEvents =
  | 'Deposit'
  | 'EmergencySaveTriggered'
  | 'OwnershipTransferred'
  | 'ReceiveBackLPs'
  | 'Withdraw';
export interface SushiSlpStrategyEventsContext {
  Deposit(...parameters: any): EventFilter;
  EmergencySaveTriggered(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  ReceiveBackLPs(...parameters: any): EventFilter;
  Withdraw(...parameters: any): EventFilter;
}
export type SushiSlpStrategyMethodNames =
  | 'new'
  | 'deposit'
  | 'emergencySave'
  | 'getPendingRewards'
  | 'owner'
  | 'receiveBackLPs'
  | 'renounceOwnership'
  | 'sushiConfig'
  | 'totalAmountOfLPs'
  | 'transferLPs'
  | 'transferOwnership'
  | 'userInfo'
  | 'withdraw';
export interface DepositEventEmittedResponse {
  user: string;
  token: string;
  amount: BigNumberish;
  slpAmount: BigNumberish;
}
export interface EmergencySaveTriggeredEventEmittedResponse {
  owner: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface ReceiveBackLPsEventEmittedResponse {
  user: string;
  token: string;
  amount: BigNumberish;
  slpAmount: BigNumberish;
}
export interface WithdrawEventEmittedResponse {
  user: string;
  asset: string;
  slpAmount: BigNumberish;
  assetAmount: BigNumberish;
}
export interface UserInfoResponse {
  sushiRewardDebt: BigNumber;
  0: BigNumber;
  userAccumulatedSushi: BigNumber;
  1: BigNumber;
  slpAmount: BigNumber;
  2: BigNumber;
  length: 3;
}
export interface SushiSlpStrategy {
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
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _amount Type: uint256, Indexed: false
   * @param _asset Type: address, Indexed: false
   * @param _deadline Type: uint256, Indexed: false
   * @param _swapTokenOutMin Type: uint256, Indexed: false
   */
  deposit(
    _amount: BigNumberish,
    _asset: string,
    _deadline: BigNumberish,
    _swapTokenOutMin: BigNumberish,
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
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _amount Type: uint256, Indexed: false
   * @param _asset Type: address, Indexed: false
   * @param _deadline Type: uint256, Indexed: false
   * @param _swapTokenOutMin Type: uint256, Indexed: false
   */
  receiveBackLPs(
    _amount: BigNumberish,
    _asset: string,
    _deadline: BigNumberish,
    _swapTokenOutMin: BigNumberish,
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  sushiConfig(overrides?: ContractCallOverrides): Promise<string>;
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
   * @param amount Type: uint256, Indexed: false
   * @param wethMinAmount Type: uint256, Indexed: false
   * @param _deadline Type: uint256, Indexed: false
   * @param _amountAMin Type: uint256, Indexed: false
   * @param _amountBMin Type: uint256, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  transferLPs(
    bridgeId: BigNumberish,
    _destinationNetworkId: BigNumberish,
    unwrap: boolean,
    amount: BigNumberish,
    wethMinAmount: BigNumberish,
    _deadline: BigNumberish,
    _amountAMin: BigNumberish,
    _amountBMin: BigNumberish,
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
   * @param _deadline Type: uint256, Indexed: false
   * @param _amountAMin Type: uint256, Indexed: false
   * @param _amountBMin Type: uint256, Indexed: false
   * @param _wethMinAmount Type: uint256, Indexed: false
   */
  withdraw(
    _amount: BigNumberish,
    _asset: string,
    _deadline: BigNumberish,
    _amountAMin: BigNumberish,
    _amountBMin: BigNumberish,
    _wethMinAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}

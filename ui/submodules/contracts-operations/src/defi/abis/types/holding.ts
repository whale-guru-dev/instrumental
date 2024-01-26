import { EthersContractContextV5 } from 'ethereum-abi-types-generator';
import {
  BigNumber,
  BigNumberish,
  BytesLike as Arrayish,
  ContractTransaction,
} from 'ethers';

export type ContractContext = EthersContractContextV5<
  Holding,
  HoldingMethodNames,
  HoldingEventsContext,
  HoldingEvents
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
export type HoldingEvents =
  | 'ETHTransfered'
  | 'FoundsInvested'
  | 'InvestmentWithdrawn'
  | 'LiquidityMoved'
  | 'Paused'
  | 'RebalancingInitiated'
  | 'RebalancingThresholdChanged'
  | 'RoleAdminChanged'
  | 'RoleGranted'
  | 'RoleRevoked'
  | 'SaveFundsLockUpTimeSet'
  | 'SaveFundsLockUpTimerStarted'
  | 'SaveFundsStarted'
  | 'TokenClaimed'
  | 'Unpaused';
export interface HoldingEventsContext {
  ETHTransfered(...parameters: any): EventFilter;
  FoundsInvested(...parameters: any): EventFilter;
  InvestmentWithdrawn(...parameters: any): EventFilter;
  LiquidityMoved(...parameters: any): EventFilter;
  Paused(...parameters: any): EventFilter;
  RebalancingInitiated(...parameters: any): EventFilter;
  RebalancingThresholdChanged(...parameters: any): EventFilter;
  RoleAdminChanged(...parameters: any): EventFilter;
  RoleGranted(...parameters: any): EventFilter;
  RoleRevoked(...parameters: any): EventFilter;
  SaveFundsLockUpTimeSet(...parameters: any): EventFilter;
  SaveFundsLockUpTimerStarted(...parameters: any): EventFilter;
  SaveFundsStarted(...parameters: any): EventFilter;
  TokenClaimed(...parameters: any): EventFilter;
  Unpaused(...parameters: any): EventFilter;
}
export type HoldingMethodNames =
  | 'DEFAULT_ADMIN_ROLE'
  | 'MOSAIC_VAULT'
  | 'REBALANCING_BOT'
  | 'addInvestmentStrategy'
  | 'approve'
  | 'claim'
  | 'coverWithdrawRequest'
  | 'durationToChangeTimer'
  | 'executeSaveFunds'
  | 'extractLiquidityForRebalancing'
  | 'getRoleAdmin'
  | 'getRoleMember'
  | 'getRoleMemberCount'
  | 'getTokenLiquidity'
  | 'grantRole'
  | 'hasRole'
  | 'initialize'
  | 'invest'
  | 'investmentStrategies'
  | 'newSaveFundsLockUpTime'
  | 'pause'
  | 'paused'
  | 'rebalancingThresholds'
  | 'renounceRole'
  | 'revokeRole'
  | 'saveFundsLockupTime'
  | 'saveFundsTimer'
  | 'setRebalancingThreshold'
  | 'setSaveFundsLockUpTime'
  | 'setUniqRole'
  | 'startSaveFunds'
  | 'startSaveFundsLockUpTimerChange'
  | 'supportsInterface'
  | 'tokenAddressToSaveFunds'
  | 'transfer'
  | 'transferETH'
  | 'unpause'
  | 'userAddressToSaveFundsTo'
  | 'withdrawInvestment';
export interface ETHTransferedEventEmittedResponse {
  receiver: string;
  amount: BigNumberish;
}
export interface FoundsInvestedEventEmittedResponse {
  strategy: string;
  admin: string;
  cTokensReceived: BigNumberish;
}
export interface InvestmentWithdrawnEventEmittedResponse {
  strategy: string;
  admin: string;
}
export interface LiquidityMovedEventEmittedResponse {
  to: string;
  tokenAddress: string;
  amount: BigNumberish;
}
export interface PausedEventEmittedResponse {
  account: string;
}
export interface RebalancingInitiatedEventEmittedResponse {
  by: string;
  token: string;
  receiver: string;
  amount: BigNumberish;
}
export interface RebalancingThresholdChangedEventEmittedResponse {
  admin: string;
  token: string;
  oldAmount: BigNumberish;
  newAmount: BigNumberish;
}
export interface RoleAdminChangedEventEmittedResponse {
  role: Arrayish;
  previousAdminRole: Arrayish;
  newAdminRole: Arrayish;
}
export interface RoleGrantedEventEmittedResponse {
  role: Arrayish;
  account: string;
  sender: string;
}
export interface RoleRevokedEventEmittedResponse {
  role: Arrayish;
  account: string;
  sender: string;
}
export interface SaveFundsLockUpTimeSetEventEmittedResponse {
  owner: string;
  time: BigNumberish;
  durationToChangeTime: BigNumberish;
}
export interface SaveFundsLockUpTimerStartedEventEmittedResponse {
  owner: string;
  time: BigNumberish;
  durationToChangeTime: BigNumberish;
}
export interface SaveFundsStartedEventEmittedResponse {
  owner: string;
  token: string;
  receiver: string;
}
export interface TokenClaimedEventEmittedResponse {
  strategy: string;
  rewardTokenAddress: string;
}
export interface UnpausedEventEmittedResponse {
  account: string;
}
export interface InvestRequest {
  token: string;
  amount: BigNumberish;
}
export interface WithdrawInvestmentRequest {
  token: string;
  amount: BigNumberish;
}
export interface Holding {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  DEFAULT_ADMIN_ROLE(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  MOSAIC_VAULT(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  REBALANCING_BOT(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _strategyAddress Type: address, Indexed: false
   */
  addInvestmentStrategy(
    _strategyAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _spender Type: address, Indexed: false
   * @param _token Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  approve(
    _spender: string,
    _token: string,
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _investmentStrategy Type: address, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  claim(
    _investmentStrategy: string,
    _data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _investmentStrategies Type: address[], Indexed: false
   * @param _token Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  coverWithdrawRequest(
    _investmentStrategies: string[],
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
  durationToChangeTimer(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  executeSaveFunds(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   * @param _receiver Type: address, Indexed: false
   */
  extractLiquidityForRebalancing(
    _token: string,
    _amount: BigNumberish,
    _receiver: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param role Type: bytes32, Indexed: false
   */
  getRoleAdmin(
    role: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param index Type: uint256, Indexed: false
   */
  getRoleMember(
    role: Arrayish,
    index: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param role Type: bytes32, Indexed: false
   */
  getRoleMemberCount(
    role: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param _investmentStrategies Type: address[], Indexed: false
   */
  getTokenLiquidity(
    _token: string,
    _investmentStrategies: string[],
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param account Type: address, Indexed: false
   */
  grantRole(
    role: Arrayish,
    account: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param account Type: address, Indexed: false
   */
  hasRole(
    role: Arrayish,
    account: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _admin Type: address, Indexed: false
   */
  initialize(
    _admin: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _investments Type: tuple[], Indexed: false
   * @param _investmentStrategy Type: address, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  invest(
    _investments: InvestRequest[],
    _investmentStrategy: string,
    _data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  investmentStrategies(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  newSaveFundsLockUpTime(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  pause(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  paused(overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  rebalancingThresholds(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param account Type: address, Indexed: false
   */
  renounceRole(
    role: Arrayish,
    account: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param account Type: address, Indexed: false
   */
  revokeRole(
    role: Arrayish,
    account: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  saveFundsLockupTime(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  saveFundsTimer(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  setRebalancingThreshold(
    _token: string,
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  setSaveFundsLockUpTime(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _role Type: bytes32, Indexed: false
   * @param _actor Type: address, Indexed: false
   */
  setUniqRole(
    _role: Arrayish,
    _actor: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param _to Type: address, Indexed: false
   */
  startSaveFunds(
    _token: string,
    _to: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _time Type: uint256, Indexed: false
   */
  startSaveFundsLockUpTimerChange(
    _time: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  tokenAddressToSaveFunds(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param _receiver Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  transfer(
    _token: string,
    _receiver: string,
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _receiver Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  transferETH(
    _receiver: string,
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  unpause(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  userAddressToSaveFundsTo(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _investments Type: tuple[], Indexed: false
   * @param _investmentStrategy Type: address, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  withdrawInvestment(
    _investments: WithdrawInvestmentRequest[],
    _investmentStrategy: string,
    _data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}

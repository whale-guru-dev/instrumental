import { EthersContractContextV5 } from 'ethereum-abi-types-generator';
import {
  BigNumber,
  BigNumberish,
  BytesLike as Arrayish,
  ContractTransaction,
} from 'ethers';

export type ContractContext = EthersContractContextV5<
  Vault,
  VaultMethodNames,
  VaultEventsContext,
  VaultEvents
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
export type VaultEvents =
  | 'DepositActiveLiquidity'
  | 'DepositPassiveLiquidity'
  | 'FeeTaken'
  | 'FundsDigested'
  | 'LiquidityRefunded'
  | 'LiquidityWithdrawn'
  | 'OwnershipTransferred'
  | 'Paused'
  | 'TransferFundsRefunded'
  | 'TransferInitiated'
  | 'Unpaused'
  | 'WithdrawRequest'
  | 'WithdrawalCompleted';
export interface VaultEventsContext {
  DepositActiveLiquidity(...parameters: any): EventFilter;
  DepositPassiveLiquidity(...parameters: any): EventFilter;
  FeeTaken(...parameters: any): EventFilter;
  FundsDigested(...parameters: any): EventFilter;
  LiquidityRefunded(...parameters: any): EventFilter;
  LiquidityWithdrawn(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  Paused(...parameters: any): EventFilter;
  TransferFundsRefunded(...parameters: any): EventFilter;
  TransferInitiated(...parameters: any): EventFilter;
  Unpaused(...parameters: any): EventFilter;
  WithdrawRequest(...parameters: any): EventFilter;
  WithdrawalCompleted(...parameters: any): EventFilter;
}
export type VaultMethodNames =
  | 'deposits'
  | 'digestFunds'
  | 'getTransferState'
  | 'hasBeenRefunded'
  | 'hasBeenWithdrawn'
  | 'initialize'
  | 'lastRefundedID'
  | 'lastWithdrawID'
  | 'owner'
  | 'passiveLiquidityAvailableAfterTimestamp'
  | 'pause'
  | 'paused'
  | 'provideActiveLiquidity'
  | 'providePassiveLiquidity'
  | 'refundTransferFunds'
  | 'relayer'
  | 'renounceOwnership'
  | 'revertLiquidityWithdrawalRequest'
  | 'setRelayer'
  | 'setVaultConfig'
  | 'transferERC20ToLayer'
  | 'transferETHToLayer'
  | 'transferOwnership'
  | 'unpause'
  | 'vaultConfig'
  | 'withdrawLiquidity'
  | 'withdrawLiquidityRequest'
  | 'withdrawTo';
export interface DepositActiveLiquidityEventEmittedResponse {
  tokenAddress: string;
  provider: string;
  amount: BigNumberish;
  blocks: BigNumberish;
}
export interface DepositPassiveLiquidityEventEmittedResponse {
  tokenAddress: string;
  provider: string;
  amount: BigNumberish;
}
export interface FeeTakenEventEmittedResponse {
  owner: string;
  user: string;
  token: string;
  amount: BigNumberish;
  fee: BigNumberish;
  baseFee: BigNumberish;
  totalFee: BigNumberish;
  uniqueId: Arrayish;
}
export interface FundsDigestedEventEmittedResponse {
  tokenAddress: string;
  amount: BigNumberish;
}
export interface LiquidityRefundedEventEmittedResponse {
  tokenAddress: string;
  receiptAddress: string;
  user: string;
  amount: BigNumberish;
  uniqueId: Arrayish;
}
export interface LiquidityWithdrawnEventEmittedResponse {
  user: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: BigNumberish;
  requestedAmountIn: BigNumberish;
  amountOut: BigNumberish;
  baseFee: BigNumberish;
  mosaicFee: BigNumberish;
  swapToNative: boolean;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface PausedEventEmittedResponse {
  account: string;
}
export interface TransferFundsRefundedEventEmittedResponse {
  tokenAddress: string;
  user: string;
  amount: BigNumberish;
  fullAmount: BigNumberish;
  uniqueId: Arrayish;
}
export interface TransferInitiatedEventEmittedResponse {
  owner: string;
  erc20: string;
  remoteTokenAddress: string;
  remoteNetworkID: BigNumberish;
  value: BigNumberish;
  remoteDestinationAddress: string;
  uniqueId: Arrayish;
  maxTransferDelay: BigNumberish;
  tokenOut: string;
  ammID: BigNumberish;
  amountOutMin: BigNumberish;
  _swapToNative: boolean;
}
export interface UnpausedEventEmittedResponse {
  account: string;
}
export interface WithdrawRequestEventEmittedResponse {
  user: string;
  receiptToken: string;
  tokenIn: string;
  amountIn: BigNumberish;
  tokenOut: string;
  remoteTokenInAddress: string;
  destinationAddress: string;
  ammId: BigNumberish;
  destinationNetworkID: BigNumberish;
  data: Arrayish;
  uniqueId: Arrayish;
  _withdrawData: string;
}
export interface WithdrawalCompletedEventEmittedResponse {
  accountTo: string;
  amount: BigNumberish;
  netAmount: BigNumberish;
  tokenAddress: string;
  uniqueId: Arrayish;
  swapToNative: boolean;
}
export interface DepositsResponse {
  token: string;
  0: string;
  amount: BigNumber;
  1: BigNumber;
  length: 2;
}
export interface WithdrawLiquidityRequest {
  feePercentage: BigNumberish;
  baseFee: BigNumberish;
  investmentStrategies: string[];
  ammId: BigNumberish;
  id: Arrayish;
  amountToSwapToNative: BigNumberish;
  minAmountOutNative: BigNumberish;
  nativeSwapperId: BigNumberish;
}
export interface WithdrawLiquidityRequestRequest {
  amountOutMin: BigNumberish;
  maxDelay: BigNumberish;
  _swapToNative: boolean;
}
export interface WithdrawToRequest {
  feePercentage: BigNumberish;
  baseFee: BigNumberish;
  investmentStrategies: string[];
  ammId: BigNumberish;
  id: Arrayish;
  amountToSwapToNative: BigNumberish;
  minAmountOutNative: BigNumberish;
  nativeSwapperId: BigNumberish;
}
export interface Vault {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  deposits(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<DepositsResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   */
  digestFunds(
    _token: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _transferId Type: bytes32, Indexed: false
   */
  getTransferState(
    _transferId: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<number>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  hasBeenRefunded(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  hasBeenWithdrawn(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _mosaicVaultConfig Type: address, Indexed: false
   */
  initialize(
    _mosaicVaultConfig: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  lastRefundedID(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  lastWithdrawID(overrides?: ContractCallOverrides): Promise<string>;
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
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   */
  passiveLiquidityAvailableAfterTimestamp(
    parameter0: string,
    parameter1: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
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
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _amount Type: uint256, Indexed: false
   * @param _tokenAddress Type: address, Indexed: false
   * @param _blocksForActiveLiquidity Type: uint256, Indexed: false
   */
  provideActiveLiquidity(
    _amount: BigNumberish,
    _tokenAddress: string,
    _blocksForActiveLiquidity: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _amount Type: uint256, Indexed: false
   * @param _tokenAddress Type: address, Indexed: false
   */
  providePassiveLiquidity(
    _amount: BigNumberish,
    _tokenAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param _user Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   * @param _originalAmount Type: uint256, Indexed: false
   * @param _id Type: bytes32, Indexed: false
   * @param _investmentStrategies Type: address[], Indexed: false
   */
  refundTransferFunds(
    _token: string,
    _user: string,
    _amount: BigNumberish,
    _originalAmount: BigNumberish,
    _id: Arrayish,
    _investmentStrategies: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  relayer(overrides?: ContractCallOverrides): Promise<string>;
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
   * @param _user Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   * @param _receiptToken Type: address, Indexed: false
   * @param _id Type: bytes32, Indexed: false
   */
  revertLiquidityWithdrawalRequest(
    _user: string,
    _amount: BigNumberish,
    _receiptToken: string,
    _id: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _relayer Type: address, Indexed: false
   */
  setRelayer(
    _relayer: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _vaultConfig Type: address, Indexed: false
   */
  setVaultConfig(
    _vaultConfig: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _amount Type: uint256, Indexed: false
   * @param _tokenAddress Type: address, Indexed: false
   * @param _remoteDestinationAddress Type: address, Indexed: false
   * @param _remoteNetworkID Type: uint256, Indexed: false
   * @param _maxTransferDelay Type: uint256, Indexed: false
   * @param _tokenOut Type: address, Indexed: false
   * @param _remoteAmmId Type: uint256, Indexed: false
   * @param _amountOutMin Type: uint256, Indexed: false
   * @param _swapToNative Type: bool, Indexed: false
   */
  transferERC20ToLayer(
    _amount: BigNumberish,
    _tokenAddress: string,
    _remoteDestinationAddress: string,
    _remoteNetworkID: BigNumberish,
    _maxTransferDelay: BigNumberish,
    _tokenOut: string,
    _remoteAmmId: BigNumberish,
    _amountOutMin: BigNumberish,
    _swapToNative: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _remoteDestinationAddress Type: address, Indexed: false
   * @param _remoteNetworkID Type: uint256, Indexed: false
   * @param _maxTransferDelay Type: uint256, Indexed: false
   * @param _tokenOut Type: address, Indexed: false
   * @param _remoteAmmId Type: uint256, Indexed: false
   * @param _amountOutMin Type: uint256, Indexed: false
   * @param _swapToNative Type: bool, Indexed: false
   */
  transferETHToLayer(
    _remoteDestinationAddress: string,
    _remoteNetworkID: BigNumberish,
    _maxTransferDelay: BigNumberish,
    _tokenOut: string,
    _remoteAmmId: BigNumberish,
    _amountOutMin: BigNumberish,
    _swapToNative: boolean,
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
  vaultConfig(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _accountTo Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   * @param _requestedAmount Type: uint256, Indexed: false
   * @param _tokenIn Type: address, Indexed: false
   * @param _tokenOut Type: address, Indexed: false
   * @param _amountOutMin Type: uint256, Indexed: false
   * @param _withdrawData Type: tuple, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  withdrawLiquidity(
    _accountTo: string,
    _amount: BigNumberish,
    _requestedAmount: BigNumberish,
    _tokenIn: string,
    _tokenOut: string,
    _amountOutMin: BigNumberish,
    _withdrawData: WithdrawLiquidityRequest,
    _data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _receiptToken Type: address, Indexed: false
   * @param _amountIn Type: uint256, Indexed: false
   * @param _tokenOut Type: address, Indexed: false
   * @param _destinationAddress Type: address, Indexed: false
   * @param _ammID Type: uint256, Indexed: false
   * @param _data Type: bytes, Indexed: false
   * @param _destinationNetworkId Type: uint256, Indexed: false
   * @param _withdrawRequestData Type: tuple, Indexed: false
   */
  withdrawLiquidityRequest(
    _receiptToken: string,
    _amountIn: BigNumberish,
    _tokenOut: string,
    _destinationAddress: string,
    _ammID: BigNumberish,
    _data: Arrayish,
    _destinationNetworkId: BigNumberish,
    _withdrawRequestData: WithdrawLiquidityRequestRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _accountTo Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   * @param _tokenIn Type: address, Indexed: false
   * @param _tokenOut Type: address, Indexed: false
   * @param _amountOutMin Type: uint256, Indexed: false
   * @param _withdrawData Type: tuple, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  withdrawTo(
    _accountTo: string,
    _amount: BigNumberish,
    _tokenIn: string,
    _tokenOut: string,
    _amountOutMin: BigNumberish,
    _withdrawData: WithdrawToRequest,
    _data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}

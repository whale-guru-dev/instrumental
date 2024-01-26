import { BlockchainProvider, blockchainProviderDefaultProps, BlockchainProviderProps, defaultEmptyFunction, defaultPromiseFunction, getTokenId, TokenId, useConnector, useSupportedProviders } from "@integrations-lib/core";
import { Balance, ERC20ContractsContext, ERC20ContractWrapper, TokenInfoContext, toTokenUnitsBN } from "@integrations-lib/interaction";
import BigNumber from "bignumber.js";
import { ContractTransaction, ethers } from "ethers";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { APITransaction, APITransactions, compareTxByDate, getNativeTokenPrice as getNativeTokenPriceAPI, getTokenPrice as getTokenPriceAPI, getTranscation as getTranscationAPI, getTranscationCount as getTranscationCountAPI, getTranscations as getTranscationsAPI, isOwner, TransactionType } from "../../api";
import { TokenInfo } from "../../defi/components/TokenInfo";
import { addNotification } from "../../store/notifications/slice";
import { ReceiptTokens, selectReceiptTokens, Token } from "../../store/supportedTokens/slice";
import { TokensUpdater } from "../../store/supportedTokens/Updater";
import { UniqueObjectSet } from "../../utils/types";
import { getNetworkUrl, SupportedNetworkId, SwapAmmID, TestSupportedNetworkId } from "../constants";
import { HoldingContractWrapper } from "../contracts/wrappers/HoldingContractWrapper";
import { VaultContractWrapper } from "../contracts/wrappers/VaultContractWrapper";
import { HoldingContractsContext, HoldingContractsProvider } from "./HoldingContractsProvider";
import { VaultContractsContext, VaultContractsProvider } from "./VaultContractsProvider";

export enum TransactionOwner {
  All = 0,
  User = 1,
}

export type Transaction = APITransaction

export interface TransactionsRequest {
  owner: TransactionOwner;
  type: TransactionType;
  count: number;
}

export interface NetworkTokenOperations {
  tokens: UniqueObjectSet<Token>;

  setNetwork: (chainId: TestSupportedNetworkId | undefined) => void;
  setToken: (token: Token | undefined) => void;

  getEthBalance: (chainId: TestSupportedNetworkId | undefined) => BigNumber | undefined;
  getNativeTokenPrice: (chainId: TestSupportedNetworkId | undefined) => number | undefined;
  getNativeTokenAmountDecimals: (chainId: TestSupportedNetworkId | undefined) => number;

  approveFunds: (token: Token | undefined, spender: string) => Promise<ContractTransaction>;
  canApproveFunds: (token: Token | undefined, spender: string) => boolean;
  hasApprovedFunds: (token: Token | undefined, spender: string) => boolean;
  canDepositFunds: (token: Token | undefined, value: BigNumber) => boolean;
  canSwapFunds: (sourceToken: Token | undefined, destinationToken: Token | undefined, amount: BigNumber, destinationAddress: string | undefined, deadlineMinutes: number, amm: SwapAmmID | undefined, amountOutMin: BigNumber) => boolean;
  canWithdrawFunds: (token: Token | undefined, amount: BigNumber, destinationAddress: string | undefined, deadlineMinutes: number, amm: SwapAmmID | undefined, destinationChainId: TestSupportedNetworkId | undefined, amountOutMin: BigNumber) => boolean;
  depositFunds: (token: Token | undefined, value: BigNumber) => Promise<ContractTransaction>;
  getBalance: (token: Token | undefined) => Balance;
  getBalanceSum: (tokens: Array<Token | undefined>) => Balance;
  getDeposited: (token: Token | undefined) => Balance;
  getLiquidity: (token: Token | undefined) => BigNumber | undefined;
  getTokenPrice: (token: Token | undefined) => number | undefined;
  getTokenAmountDecimals: (token: Token | undefined) => number;
  swapFunds: (sourceToken: Token | undefined, destinationToken: Token | undefined, amount: BigNumber, destinationAddress: string, deadlineMinutes: number, amm: SwapAmmID, amountOutMin: BigNumber, swapToNative: boolean) => Promise<ContractTransaction>;
  withdrawFunds: (token: Token | undefined, amount: BigNumber, destinationAddress: string, deadlineMinutes: number, amm: SwapAmmID, destinationChainId: TestSupportedNetworkId, amountOutMin: BigNumber, swapToNative: boolean) => Promise<ContractTransaction>;
  getDepositedSum: (tokens: Array<Token | undefined>) => Balance;
  getLiquiditySum: (tokens: Array<Token | undefined>) => BigNumber | undefined;
  getTransactionCount: (type?: TransactionType, owner?: TransactionOwner) => number;
  getTransactions: (request: TransactionsRequest) => Promise<Array<Transaction>>;
  getTransaction: (type: TransactionType, id: string) => Promise<Transaction>;
}

export const defaultOperations: NetworkTokenOperations = {
  tokens: new UniqueObjectSet<Token>(),
  setNetwork: defaultEmptyFunction,
  setToken: defaultEmptyFunction,
  getTokenPrice: () => undefined,
  getTokenAmountDecimals: () => 2,
  getEthBalance: () => undefined,
  getNativeTokenPrice: () => undefined,
  getNativeTokenAmountDecimals: () => 2,
  getBalanceSum: () => ({
    value: undefined,
    isLoading: false,
  }),
  getBalance: () => ({
    value: undefined,
    isLoading: false,
  }),
  getDeposited: () => ({
    value: undefined,
    isLoading: false,
  }),
  getDepositedSum: () => ({
    value: undefined,
    isLoading: false,
  }),
  getLiquiditySum: () => undefined,
  getLiquidity: () => undefined,
  hasApprovedFunds: () => false,
  canApproveFunds: () => false,
  approveFunds: defaultPromiseFunction,
  canDepositFunds: () => false,
  canSwapFunds: () => false,
  canWithdrawFunds: () => false,
  depositFunds: defaultPromiseFunction,
  swapFunds: defaultPromiseFunction,
  withdrawFunds: defaultPromiseFunction,
  getTransactionCount: () => 0,
  getTransactions: defaultPromiseFunction,
  getTransaction: defaultPromiseFunction,
} as const;

export const NetworkTokenOperationsContext = createContext<NetworkTokenOperations>(defaultOperations);

type TransactionFetchRason = 'REQUESTED' | 'ALIGN';

interface AlignRequest {
  owner: TransactionOwner;
}

export type NumberPerTransactionType = {
  [key in TransactionType]: number;
}

const zeroNumberPerType : NumberPerTransactionType = {
  'all': 0,
  'liquidity-deposit': 0,
  'liquidity-withdrawal': 0,
  'nft': 0,
  'token': 0,
}

export interface ContractAddresses {
  holding?: string;
  config?: string;
  vault?: string;
}

export type ContractAddressesPerChains = Partial<{
  [key in SupportedNetworkId]: ContractAddresses;
}>

export interface NetworkTokenOperationsProviderProps {
  children: any;
  contractAddresses: ContractAddressesPerChains;
}

type NetworkTokenOperationsProviderWrapperProps = BlockchainProviderProps & NetworkTokenOperationsProviderProps

const NetworkTokenOperationsProvider = ({
  children,
  contractAddresses,
}: NetworkTokenOperationsProviderProps) => {
  const tokenPriceUpdateFrequency = 20000;
  const dispatch = useDispatch();

  const onTransactionSubmitted = useCallback(
    (
      chainId: SupportedNetworkId, tx: ContractTransaction
    ) => {
      dispatch(addNotification({
        message: `Transaction submitted.`,
        type: "info",
        url: getNetworkUrl(chainId) + tx.hash,
        timeout: 5000,
      }));
    },
    [dispatch]
  );

  const onTransactionFailed = useCallback(
    (e: any) => {
      dispatch(addNotification({
        message: "Could not submit transaction.",
        type: "error",
      }));

      console.log(
        "NTOPs - Transcation could not be submitted",
        e
      )
    },
    [dispatch]
  );

  const onTransactionSuccessful = useCallback(
    (label?: string) => {
      dispatch(addNotification({
        message: label || "Transaction successfully mined.",
        type: "success",
      }));

      console.log("NTO - Transaction successful")
    },
    [dispatch]
  )

  const receiptTokens: ReceiptTokens = useSelector(selectReceiptTokens);

  const [networks, setNetworks] = useState<Set<SupportedNetworkId>>(new Set());
  const [tokens, setTokens] = useState<UniqueObjectSet<Token>>(new UniqueObjectSet());

  const setNetwork = useCallback(
    (chainId: TestSupportedNetworkId | undefined) => {
      if (!chainId) {
        return;
      }

      setNetworks(networks => new Set(networks.add(chainId)))
    },
    []
  )

  const setToken = useCallback(
    (token: Token | undefined) => {
      if (!token) {
        return;
      }

      setTokens(tokens => new UniqueObjectSet(tokens.addObject(
        getTokenId(token),
        token
      )))
    },
    []
  )

  const {
    hasAllowance, getBalances
  } = useContext(TokenInfoContext);

  const getBalance = useCallback(
    (token: Token | undefined) => {
      if (!token) {
        return {
          value: undefined,
          isLoading: false,
        }
      }

      return getBalances(token)[0];
    },
    [getBalances]
  );

  const getDeposited = useCallback(
    (token: Token | undefined) => {
      const deposited = {
        value: undefined,
        isLoading: false,
      };

      if (!token) {
        return deposited;
      }

      const receiptToken = receiptTokens[getTokenId(token)];

      if (!receiptToken) {
        return deposited;
      }

      return getBalances(receiptToken)[0];
    },
    [getBalances, receiptTokens]
  );

  const getBalanceSum = useCallback(
    (tokens: Array<Token | undefined>) => {
      let balanceSum = {
        value: undefined,
        isLoading: false,
      } as Balance;

      tokens.forEach((token: Token | undefined) => {
        const balance = getBalance(token);

        balanceSum.isLoading ||= balance.isLoading;

        if (balance.value) {
          balanceSum.value = balanceSum.value ? balanceSum.value.plus(balance.value) : balance.value;
        }
      });

      return balanceSum;
    },
    [getBalance]
  );

  const getDepositedSum = useCallback(
    (tokens: Array<Token | undefined>) => {
      let depositedSum = {
        value: undefined,
        isLoading: false,
      } as Balance;

      tokens.forEach((token: Token | undefined) => {
        const balance = getDeposited(token);

        depositedSum.isLoading ||= balance.isLoading;

        if (balance.value) {
          depositedSum.value = depositedSum.value ? depositedSum.value.plus(balance.value) : balance.value;
        }
      });

      return depositedSum;
    },
    [getDeposited]
  );

  const vaultContractAddress = useCallback(
    (network: TestSupportedNetworkId | undefined) => network && contractAddresses[network]?.vault,
    [contractAddresses]
  );

  const hasApprovedFunds = useCallback(
    (
      token: Token | undefined, spender: string
    ) => {
      if (!token) {
        return false;
      }

      if (!spender) {
        return false;
      }

      return hasAllowance(
        token,
        spender
      );
    },
    [hasAllowance]
  );

  const { getContract: getERC20Contract } = useContext(ERC20ContractsContext);

  const erc20Contract = useCallback(
    (token: Token | undefined) => {
      if (!token) {
        return undefined;
      }

      const contractAddress = token.address;

      if (!contractAddress) {
        return undefined;
      }

      return getERC20Contract(
        token.chainId,
        contractAddress
      ) as ERC20ContractWrapper || undefined;
    },
    [getERC20Contract]
  );

  const { account } = useConnector('metamask');
  const providers = useSupportedProviders();

  const canApproveFunds = useCallback(
    (
      token: Token | undefined, spender: string
    ) => {
      return (
        !!token &&
        !!account &&
        !!erc20Contract(token) &&
        !!spender
      );
    },
    [account, erc20Contract, providers]
  );

  const approveFunds = useCallback(
    (
      token: Token | undefined, spender: string
    ) : Promise<ContractTransaction> => {
      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!token || !canApproveFunds(
          token,
          spender
        )) {
          const reason = "Cannot approve funds - Please call canApproveFunds to check whether approveFunds can be called.";
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        const contract = erc20Contract(token);

        if (!contract || !spender) {
          const reason = "Contract or spender not found";
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .approve(spender)
          .then((tx: ContractTransaction) => {
            onTransactionSubmitted(
              token.chainId,
              tx
            );
            resolve(tx);
          })
          .catch((e: any) => {
            onTransactionFailed(e);
            reject(e);
          });
      });
    },
    [
      canApproveFunds,
      erc20Contract,
      onTransactionFailed,
      onTransactionSubmitted,
    ]
  );

  const { getContract: getVaultContract } = useContext(VaultContractsContext);

  const vaultContract = useCallback(
    (network: TestSupportedNetworkId) => {
      const contractAddress = vaultContractAddress(network);

      if (!contractAddress) {
        return undefined;
      }

      return getVaultContract(
        network,
        contractAddress
      ) as VaultContractWrapper || undefined;
    },
    [getVaultContract, vaultContractAddress]
  );

  const canDepositFunds = useCallback(
    (
      token: Token | undefined, value: BigNumber
    ) => {
      return (
        !!token &&
        !!account &&
        !!vaultContract(token.chainId) &&
        !value.isZero()
      );
    },
    [
      account,
      providers,
      vaultContract,
    ]
  );

  const depositFunds = useCallback(
    (
      token: Token | undefined, value: BigNumber
    ) : Promise<ContractTransaction> => {
      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!token || !canDepositFunds(
          token,
          value
        )) {
          const reason = "Cannot deposit funds - Please call canDepositFunds to check whether depositFunds can be called."
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        const contract = vaultContract(token.chainId);

        if (!contract) {
          const reason = "Vault contract not found"
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .providePassiveLiquidity(
            value,
            token.address,
          )
          .then((tx: ContractTransaction) => {
            onTransactionSubmitted(
              token.chainId,
              tx
            );

            const ercContract = erc20Contract(token);
            if (ercContract) {
              const fromEvent = ercContract.readerContract.filters.Transfer(account);
              ercContract.once(
                fromEvent,
                () => onTransactionSuccessful("depositFunds"),
              );
            }

            resolve(tx);
          })
          .catch((e: any) => {
            onTransactionFailed(e);
            reject(e);
          });
      });
    },
    [
      account,
      canDepositFunds,
      erc20Contract,
      vaultContract,
      onTransactionFailed,
      onTransactionSubmitted,
      onTransactionSuccessful,
    ]
  );

  const [tokenPrices, setTokenPrices] = useState<Map<TokenId, number | undefined>>(new Map());
  const [nativeTokenPrices, setNativeTokenPrices] = useState<Map<TestSupportedNetworkId, number | undefined>>(new Map());

  const [tokenAmountDecimals, setTokenAmountDecimals] = useState<Map<TokenId, number | undefined>>(new Map());
  const [nativeTokenAmountDecimals, setNativeTokenAmountDecimals] = useState<Map<TestSupportedNetworkId, number | undefined>>(new Map());

  useEffect(
    () => {
      networks.forEach((chainId: TestSupportedNetworkId) => {
        getNativeTokenPriceAPI(chainId).then((value: number) => {
          setNativeTokenPrices(tokenPrices => new Map(tokenPrices.set(
            chainId,
            value
          )));
          setNativeTokenAmountDecimals(tokenAmountDecimals => new Map(tokenAmountDecimals.set(
            chainId,
            Math.max(
              value?.toString().split(".")?.[0]?.length || 0,
              defaultOperations.getNativeTokenAmountDecimals(chainId)
            )
          )));
        });
      })
    },
    [networks]
  );

  const updateTokenPrices = useCallback(
    () => {
      tokens.objects.forEach((token: Token) => {
        if (token) {
          getTokenPriceAPI(
            token.chainId,
            token.address
          ).then((value: number) => {
            setTokenPrices(tokenPrices => new Map(tokenPrices.set(
              getTokenId(token),
              value
            )));
            setTokenAmountDecimals(tokenAmountDecimals => new Map(tokenAmountDecimals.set(
              getTokenId(token),
              Math.max(
                value?.toString().split(".")?.[0]?.length || 0,
                defaultOperations.getTokenAmountDecimals(token)
              )
            )));
          });
        }
      })
    },
    [tokens]
  )

  useEffect(
    () => {
      updateTokenPrices();

      const handle = setInterval(
        () => {
          updateTokenPrices()
        },
        tokenPriceUpdateFrequency
      )

      return () => clearInterval(handle);
    },
    [updateTokenPrices]
  );

  const getTokenPrice = useCallback(
    (token: Token | undefined) => {
      if (!token) {
        return undefined;
      }

      return tokenPrices.get(getTokenId(token));
    },
    [tokenPrices]
  )

  const getNativeTokenPrice = useCallback(
    (chainId: TestSupportedNetworkId | undefined) => {
      if (!chainId) {
        return undefined;
      }

      return nativeTokenPrices.get(chainId)
    },
    [nativeTokenPrices]
  )

  const getTokenAmountDecimals = useCallback(
    (token: Token | undefined) => {
      if (!token) {
        return defaultOperations.getTokenAmountDecimals(token);
      }

      return tokenAmountDecimals.get(getTokenId(token)) || defaultOperations.getTokenAmountDecimals(token);
    },
    [tokenAmountDecimals]
  )

  const getNativeTokenAmountDecimals = useCallback(
    (chainId: TestSupportedNetworkId | undefined) => {
      if (!chainId) {
        return defaultOperations.getNativeTokenAmountDecimals(chainId);
      }

      return nativeTokenAmountDecimals.get(chainId) || defaultOperations.getNativeTokenAmountDecimals(chainId);
    },
    [nativeTokenAmountDecimals]
  )

  const [ethBalances, setEthBalances] = useState<Map<TestSupportedNetworkId, BigNumber | undefined>>(new Map());

  const getEthBalance = useCallback(
    (chainId: TestSupportedNetworkId | undefined) => {
      if (!chainId) {
        return undefined;
      }

      return ethBalances.get(chainId);
    },
    [ethBalances]
  )

  useEffect(
    () => {
      networks.forEach((chainId: TestSupportedNetworkId) => {
        const blockchainProvider = providers[chainId];
        if (blockchainProvider) {
          const { provider } = blockchainProvider;

          if (account && provider) {
            provider
              ?.getBalance(account)
              .then((value: ethers.BigNumber) =>
                setEthBalances(ethBalances => new Map(ethBalances.set(
                  chainId,
                  toTokenUnitsBN(
                    value.toString(),
                    18
                  )
                ))));
          }
        }
      });
    },
    [account, networks, providers]
  );

  const [liquidities, setLiquidities] = useState<Map<TokenId, BigNumber | undefined>>(new Map());

  const getLiquidity = useCallback(
    (token: Token | undefined) => {
      if (!token) {
        return undefined;
      }

      return liquidities.get(getTokenId(token));
    },
    [liquidities]
  )

  const getLiquiditySum = useCallback(
    (tokens: Array<Token | undefined>) => {
      let liquiditySum = new BigNumber(0);

      tokens.forEach((token: Token | undefined) => {
        const liquidity = getLiquidity(token);

        if (liquidity) {
          liquiditySum = liquiditySum.plus(liquidity);
        }
      });

      return liquiditySum;
    },
    [getLiquidity]
  );

  const { getContract: getHoldingContract } = useContext(HoldingContractsContext);

  const holdingContractAddress = useCallback(
    (network: TestSupportedNetworkId | undefined) => network && contractAddresses[network]?.holding,
    [contractAddresses]
  );

  const holdingContract = useCallback(
    (network: TestSupportedNetworkId) => {
      const contractAddress = holdingContractAddress(network);

      if (!contractAddress) {
        return undefined;
      }

      return getHoldingContract(
        network,
        contractAddress
      ) as HoldingContractWrapper || undefined;
    },
    [
      getHoldingContract,
      holdingContractAddress,
    ]
  );

  useEffect(
    () => {
      tokens.objects.forEach((token: Token) => {
        if (token) {
          holdingContract(token.chainId)
            ?.getTokenLiquidity(token.address)
            .then((value: ethers.BigNumber) => {
              setLiquidities(liquidities => new Map(liquidities.set(
                getTokenId(token),
                new BigNumber(value.toString())
              )));
            });
        }
      })
    },
    [holdingContract, tokens]
  );

  const canSwapFunds = useCallback(
    (
      sourceToken: Token | undefined, destinationToken: Token | undefined, amount: BigNumber, destinationAddress: string | undefined, deadlineMinutes: number, amm: SwapAmmID | undefined, amountOutMin: BigNumber
    ) => {
      return (
        !!sourceToken &&
        !!destinationToken &&
        !amountOutMin.isLessThanOrEqualTo(0) &&
        !!deadlineMinutes &&
        !!destinationAddress &&
        !!account &&
        !!vaultContract(sourceToken.chainId) &&
        !amount.isLessThanOrEqualTo(0) &&
        !!amm
      );
    },
    [
      account,
      providers,
      vaultContract,
    ]
  );

  const swapFunds = useCallback(
    (
      sourceToken: Token | undefined, destinationToken: Token | undefined, amount: BigNumber, destinationAddress: string, deadlineMinutes: number, amm: SwapAmmID, amountOutMin: BigNumber, swapToNative: boolean
    ) => {
      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!sourceToken || !destinationToken || !canSwapFunds(
          sourceToken,
          destinationToken,
          amount,
          destinationAddress,
          deadlineMinutes,
          amm,
          amountOutMin
        )) {
          const reason = "Cannot swap funds - Please call canSwapFunds to check whether swapFunds can be called."
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        const contract = vaultContract(sourceToken.chainId);

        if (!contract) {
          const reason = "Vault contract not found";
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .transferERC20ToLayer(
            amount,
            sourceToken.address,
            destinationAddress,
            destinationToken.chainId,
            deadlineMinutes,
            destinationToken.address,
            amm,
            amountOutMin.toNumber(),
            swapToNative
          )
          .then((tx: ContractTransaction) => {
            onTransactionSubmitted(
              sourceToken.chainId,
              tx
            );

            const ercContract = erc20Contract(sourceToken);
            if (ercContract) {
              const fromEvent = ercContract.readerContract.filters.Transfer(account);
              ercContract.once(
                fromEvent,
                () => onTransactionSuccessful("swapFunds"),
              );
            }

            resolve(tx);
          })
          .catch((e: any) => {
            onTransactionFailed(e);
            reject(e);
          });
      });
    },
    [
      account,
      erc20Contract,
      canSwapFunds,
      vaultContract,
      onTransactionFailed,
      onTransactionSubmitted,
      onTransactionSuccessful,
    ]
  );

  const canWithdrawFunds = useCallback(
    (
      token: Token | undefined, amount: BigNumber, destinationAddress: string | undefined, deadlineMinutes: number, amm: SwapAmmID | undefined, destinationChainId: TestSupportedNetworkId | undefined, amountOutMin: BigNumber
    ) => {
      return (
        !!token &&
        !!destinationChainId &&
        !amountOutMin.isLessThanOrEqualTo(0) &&
        !!deadlineMinutes &&
        !!destinationAddress &&
        !!account &&
        !!vaultContract(token.chainId) &&
        !amount.isLessThanOrEqualTo(0) &&
        !!amm
      );
    },
    [
      account,
      providers,
      vaultContract,
    ]
  );

  const withdrawFunds = useCallback(
    (
      token: Token | undefined, amount: BigNumber, destinationAddress: string, deadlineMinutes: number, amm: SwapAmmID, destinationChainId: TestSupportedNetworkId, amountOutMin: BigNumber, swapToNative: boolean
    ) => {
      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!token || !canWithdrawFunds(
          token,
          amount,
          destinationAddress,
          deadlineMinutes,
          amm,
          destinationChainId,
          amountOutMin
        )) {
          const reason = "Cannot withdraw funds - Please call canWithdrawFunds to check whether withdrawFunds can be called."
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        const receiptToken = receiptTokens[getTokenId(token)];

        if (!receiptToken) {
          const reason = "Receipt token not found"
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        const contract = vaultContract(token.chainId);

        if (!contract) {
          const reason = "Vault contract not found"
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .withdrawPassiveLiquidity(
            receiptToken.address,
            amount,
            token.address,
            destinationAddress,
            amm,
            destinationChainId,
            amountOutMin.toNumber(),
            deadlineMinutes,
            swapToNative
          )
          .then((tx: ContractTransaction) => {
            onTransactionSubmitted(
              token.chainId,
              tx
            );

            const ercContract = erc20Contract(receiptToken);
            if (ercContract) {
              const fromEvent = ercContract.readerContract.filters.Transfer(account);

              ercContract.once(
                fromEvent,
                () => onTransactionSuccessful("withdrawFunds"),
              );
            }

            resolve(tx);
          })
          .catch((e: any) => {
            onTransactionFailed(e);
            reject(e);
          });
      });
    },
    [
      account,
      canWithdrawFunds,
      erc20Contract,
      receiptTokens,
      vaultContract,
      onTransactionFailed,
      onTransactionSubmitted,
      onTransactionSuccessful,
    ]
  );

  const [transactionsCountPerType, setTransactionsCountPerType] = useState<NumberPerTransactionType>(zeroNumberPerType);
  const [userTransactionsCountPerType, setUserTransactionsCountPerType] = useState<NumberPerTransactionType>(zeroNumberPerType);

  const getTransactionCount = useCallback(
    (
      type: TransactionType = 'all', owner: TransactionOwner = TransactionOwner.All
    ) => {
      if (owner === TransactionOwner.All) {
        return transactionsCountPerType[type];
      } else {
        return userTransactionsCountPerType[type];
      }
    },
    [transactionsCountPerType, userTransactionsCountPerType]
  )

  const updateTransactionCount = useCallback(
    (account ?: string) => {
      Object.keys(zeroNumberPerType).forEach((type: string) => {
        getTranscationCountAPI(
          type as TransactionType,
          account
        ).then((count: number) => {
          if (account) {
            setUserTransactionsCountPerType(userTransactionsCountPerType => ({
              ...userTransactionsCountPerType,
              [type]: count
            }));

            console.log(
              'NTOPs - Total user transaction number updated',
              {
                type,
                count,
              }
            );
          } else {
            setTransactionsCountPerType(transactionsCountPerType => ({
              ...transactionsCountPerType,
              [type]: count
            }));

            console.log(
              'NTOPs - Total transaction number updated',
              {
                type,
                count,
              }
            );
          }
        })
      })
    },
    []
  );

  useEffect(
    () => {
      updateTransactionCount(account);

      const handle = setInterval(
        () => updateTransactionCount(account),
        60000
      );

      return () => clearInterval(handle);
    },
    [account, updateTransactionCount]
  )

  useEffect(
    () => {
      updateTransactionCount();

      const handle = setInterval(
        updateTransactionCount,
        60000
      );

      return () => clearInterval(handle);
    },
    [updateTransactionCount]
  )

  const [transactions, setTransactions] = useState<Array<Transaction>>([]);

  const fetchTransaction = useCallback(
    (
      reason: TransactionFetchRason, type: TransactionType, itemsPerPage: number, pageNumber: number, owner: TransactionOwner = TransactionOwner.All
    ) : Promise<Array<Transaction>> => {
      return new Promise<Array<Transaction>>((
        resolve, reject
      ) => {
        const ownerAccount = owner === TransactionOwner.User ? account : undefined;

        console.log(
          `NTOP - Fetch transactions [${reason}] - Initiate API request`,
          {
            type,
            itemsPerPage,
            pageNumber,
            account: ownerAccount,
          }
        )

        getTranscationsAPI(
          type,
          itemsPerPage,
          pageNumber,
          ownerAccount
        ).then((response: APITransactions) => {
          console.log(
            `NTOP - Fetch transactions [${reason}] - API Response`,
            response
          )

          setTransactions(transactions => {
            const newTransactions = response.data.filter((tx: APITransaction) => !transactions.find((currentTx: Transaction) => currentTx.publicId === tx.publicId));

            console.log(
              `NTOP - Fetch transactions [${reason}] - New transactions fetched`,
              newTransactions
            )

            let merged: Array<Transaction>;
            if (newTransactions.length > 0) {
              merged = [
                ...transactions,
                ...newTransactions,
              ]

              merged.sort(compareTxByDate);

              console.log(
                `NTOP - Fetch transactions [${reason}] - Set new state`,
                newTransactions
              )

              if (reason === 'REQUESTED') {
                setAlignRequest({ owner })
              }
            } else {
              merged = transactions;
            }

            resolve(merged);

            return merged;
          });
        }).catch((e: any) => reject(e));
      })
    },
    [account]
  )

  const getTransaction = useCallback(
    (
      type: TransactionType, id: string
    ) : Promise<Transaction> => {
      return new Promise<Transaction>((
        resolve, reject
      ) => {
        const tx = transactions.find((tx: Transaction) => tx.publicId === id)
        if (tx !== undefined) {
          resolve(tx);
        } else {
          getTranscationAPI(
            type,
            id,
          ).then((response: APITransaction) => {
            setTransactions(transactions => !transactions.find((currentTx: Transaction) => currentTx.publicId === response.publicId) ? [
              ...transactions,
              response
            ].sort(compareTxByDate) : transactions);
            resolve(response);
          }).catch((e: any) => {
            reject(e);
          })
        }
      })
    },
    [transactions]
  )

  const [fetchedPerType, setFetchedPerType] = useState<NumberPerTransactionType>(zeroNumberPerType);
  const [userFetchedPerType, setUserFetchedPerType] = useState<NumberPerTransactionType>(zeroNumberPerType);

  useEffect(
    () => {
      const fetchedPerType = { ...zeroNumberPerType };
      const userFetchedPerType = { ...zeroNumberPerType };

      transactions.forEach((tx: APITransaction) => {
        fetchedPerType.all++;
        fetchedPerType[tx.type]++;

        if (isOwner(
          tx,
          account
        )) {
          userFetchedPerType.all++;
          userFetchedPerType[tx.type]++;
        }
      });

      setFetchedPerType(fetchedPerType);
      setUserFetchedPerType(userFetchedPerType);

      console.log(
        "NTOP - Transactions fetched per type",
        fetchedPerType
      )

      console.log(
        "NTOP - User transactions fetched per type",
        userFetchedPerType
      )
    },
    [account, transactions]
  )

  const [alignRequest, setAlignRequest] = useState<AlignRequest | undefined>(undefined);

  useEffect(
    () => {
      if (alignRequest) {
        const txCountPerType = alignRequest.owner === TransactionOwner.All ? transactionsCountPerType : userTransactionsCountPerType;
        const txFetchedPerType = alignRequest.owner === TransactionOwner.All ? fetchedPerType : userFetchedPerType;

        const max = Object.values(txFetchedPerType).reduce(
          (
            result: number, fetchedPerType: number
          ) => Math.max(
            result,
            fetchedPerType
          ),
          0
        );

        const allEqualyOrFullyFetched = Object.entries(txFetchedPerType).reduce(
          (
            result: boolean, [type, fetchedPerType]: [string, number]
          ) => result && (fetchedPerType === txCountPerType[type as TransactionType] || fetchedPerType === max),
          true
        );

        if (max > 0 && !allEqualyOrFullyFetched) {
          fetchTransaction(
            'ALIGN',
            'all',
            max,
            alignRequest.owner
          );
        }

        setAlignRequest(undefined);
      }
    },
    [fetchedPerType, fetchTransaction, alignRequest, transactionsCountPerType, userTransactionsCountPerType, userFetchedPerType]
  )

  useEffect(
    () => {
      if (transactions.length > transactionsCountPerType.all) {
        console.log(
          "NTOPs - More transcations fetched then there are - Either transactionsCount is not updated or there is a logic error in code.",
          {
            fetched: transactions.length,
            total: transactionsCountPerType.all,
          }
        )
      } else {
        const representationLength = 10;
        const ratio = transactionsCountPerType.all > 0 ? transactions.length / transactionsCountPerType.all : 0;
        const fetched = Math.floor(ratio * representationLength);
        const progress = '[' + (fetched > 0 ? new Array(fetched + 1).join('#') : '') + new Array(representationLength - fetched + 1).join('-') + '] ' + Math.floor(ratio * 100) + "%";

        console.log(
          "NTOP - Transactions fetched",
          progress
        )
      }
    },
    [transactions, transactionsCountPerType]
  )

  const filterTransactions = useCallback(
    (
      transactions: Array<Transaction>, owner: TransactionOwner, type: TransactionType
    ) => transactions.filter((tx: Transaction) =>
      (owner === TransactionOwner.All || isOwner(
        tx,
        account
      )) &&
      (type === 'all' || tx.type === type)),
    [account]
  )

  const cropTransactions = useCallback(
    (
      transactions: Array<Transaction>, count: number
    ) => transactions.filter((
      _: Transaction, index: number
    ) => index < count),
    []
  )

  const getTransactions = useCallback(
    (request: TransactionsRequest) => {
      return new Promise<Array<Transaction>>((
        resolve, reject
      ) => {
        const {
          owner,
          type,
          count,
        } = request;

        const filteredTx = filterTransactions(
          transactions,
          owner,
          type
        );

        if (filteredTx.length >= count || transactions.length >= transactionsCountPerType.all) {
          const result = cropTransactions(
            filteredTx,
            count
          );

          console.log(
            "NTOP - Fetch transactions - Already fetched",
            result
          )

          resolve(result);
        } else {
          let itemsToGet = count - filteredTx.length;
          let alreadyFetched = filteredTx.length;

          let pageNumber = 0;
          let itemsPerPage = 0;
          if (alreadyFetched < itemsToGet) {
            itemsPerPage = alreadyFetched + itemsToGet;
            pageNumber = 1;
          } else {
            while (alreadyFetched % itemsToGet !== 0 && alreadyFetched - 1 >= itemsToGet + 1) {
              itemsToGet++;
              alreadyFetched--;
            }

            if (alreadyFetched === itemsToGet + 1) {
              itemsPerPage = alreadyFetched;
            } else {
              itemsPerPage = itemsToGet;
            }

            pageNumber = Math.floor(alreadyFetched / itemsToGet) + 1;
          }

          fetchTransaction(
            'REQUESTED',
            type,
            itemsPerPage,
            pageNumber,
            owner
          ).then((response: Array<Transaction>) => {
            const result = cropTransactions(
              filterTransactions(
                response,
                owner,
                type
              ),
              count
            );

            console.log(
              "NTOP - Fetch transactions - Result",
              result
            )

            resolve(result);
          }).catch((e: any) => {
            reject(e)
          });
        }
      });
    },
    [cropTransactions, fetchTransaction, filterTransactions, transactions, transactionsCountPerType]
  )

  return (
    <NetworkTokenOperationsContext.Provider
      value={{
        tokens,
        getLiquidity,
        getLiquiditySum,
        getNativeTokenPrice,
        getNativeTokenAmountDecimals,
        getTokenPrice,
        getTokenAmountDecimals,
        getEthBalance,
        setNetwork,
        setToken,
        getBalanceSum,
        getBalance,
        getDeposited,
        getDepositedSum,
        hasApprovedFunds,
        canApproveFunds,
        approveFunds,
        canDepositFunds,
        depositFunds,
        canSwapFunds,
        swapFunds,
        canWithdrawFunds,
        withdrawFunds,
        getTransactionCount,
        getTransactions,
        getTransaction,
      }}
    >
      {children}
    </NetworkTokenOperationsContext.Provider>
  );
}

const NetworkTokenOperationsProviderWrapper = (props: NetworkTokenOperationsProviderWrapperProps) =>
  <BlockchainProvider
    supportedChains={props.supportedChains}
    updatersConfig={{
      blockNumberUpdater: { type: 'ethersjs' },
      tokenMetadataUpdater: {
        type: 'moralis',
        apiKey: process.env.MORALIS_API_KEY || "",
      },
      tokenPricesUpdater: {
        type: 'moralis',
        apiKey: process.env.MORALIS_API_KEY || "",
      },
    }}
  >
    <TokenInfo>
      <HoldingContractsProvider>
        <VaultContractsProvider>
          <NetworkTokenOperationsProvider contractAddresses={props.contractAddresses}>
            {props.children}
          </NetworkTokenOperationsProvider>
        </VaultContractsProvider>
      </HoldingContractsProvider>
    </TokenInfo>

    <TokensUpdater supportedChains={props.supportedChains} />
  </BlockchainProvider>

NetworkTokenOperationsProviderWrapper.defaultProps = blockchainProviderDefaultProps;

export { NetworkTokenOperationsProviderWrapper as NetworkTokenOperationsProvider };
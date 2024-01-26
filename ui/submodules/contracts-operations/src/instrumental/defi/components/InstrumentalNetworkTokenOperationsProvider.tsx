import { blockchainProviderDefaultProps, BlockchainProviderProps, defaultPromiseFunction, getTokenId, useConnector, useSupportedProviders } from "@integrations-lib/core";
import { Balance, ERC20ContractsContext, ERC20ContractWrapper, TokenInfoContext } from "@integrations-lib/interaction";
import { BigNumber as EthersBigNumber, ContractTransaction } from "ethers";
import { createContext, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ContractAddresses, defaultOperations, NetworkTokenOperations, NetworkTokenOperationsContext, NetworkTokenOperationsProvider } from "../../../defi/components/NetworkTokenOperationsProvider";
import { getNetworkUrl, SupportedNetworkId, TestSupportedNetworkId } from "../../../defi/constants";
import { addNotification } from "../../../store/notifications/slice";
import { ReceiptTokens, selectReceiptTokens, Token } from "../../../store/supportedTokens/slice";
import { UserInfoResponse as CurveStrategyUserInfoResponse, WithdrawRequest } from "../abis/types/CurveTricryptoStrategy";
import { UserInfoResponse as SushERC20StrategyUserInfoResponse } from "../abis/types/SushiERC20Strategy";
import { UserInfoResponse as SushiSlpStrategyUserInfoResponse } from "../abis/types/SushiSlpStrategy";
import { CurveTricryptoStrategyContractWrapper } from "../contracts/wrappers/CurveTricryptoStrategyContractWrapper";
import { SushiERC20StrategyContractWrapper } from "../contracts/wrappers/SushiERC20StrategyContractWrapper";
import { SushiSlpStrategyContractWrapper } from "../contracts/wrappers/SushiSlpStrategyContractWrapper";
import { CurveTricryptoStrategyContractContext, CurveTricryptoStrategyContractProvider } from "./CurveTricryptoStrategyContractProvider";
import { SushiERC20StrategyContractContext, SushiERC20StrategyContractProvider } from "./SushiERC20StrategyContractProvider";
import { SushiSlpStrategyContractContext, SushiSlpStrategyContractProvider } from "./SushiSlpStrategyContractProvider";

export type StrategyType = 'curve' | 'sushiERC20' | 'sushisLP' | undefined;

export type StrategyUserResponse = CurveStrategyUserInfoResponse | SushERC20StrategyUserInfoResponse | SushiSlpStrategyUserInfoResponse | undefined;

export type StrategyContractWrapper = CurveTricryptoStrategyContractWrapper | SushiERC20StrategyContractWrapper | SushiSlpStrategyContractWrapper;

export type CurveTricryptoStrategyDepositType = {
  assetAddress: string,
  amount: EthersBigNumber,
  lpAmountMinimum: number,
}

export type CurveTricryptoStrategyWithdrawType = {
  amount: EthersBigNumber,
  assetAddress: string,
  params: WithdrawRequest,
}

export type SushiERC20StrategyDepositType = {
  amount1: EthersBigNumber,
  asset1: string,
  amount2: EthersBigNumber,
  asset2: string,
  deadline: EthersBigNumber,
  swapTokenOutMin: EthersBigNumber,
}

export type SushiERC20StrategyWithdrawType = {
  amount: EthersBigNumber,
  asset: string,
  deadline: EthersBigNumber,
  amountAMin: EthersBigNumber,
  amountBMin: EthersBigNumber,
}

export type SushiSlpStrategyDepositType = {
  amount: EthersBigNumber,
  asset: string,
  deadline: EthersBigNumber,
  swapTokenOutMin: EthersBigNumber,
}

export type SushiSlpStrategyWithdrawType = {
  amount: EthersBigNumber,
  asset: string,
  deadline: EthersBigNumber,
  amountAMin: EthersBigNumber,
  amountBMin: EthersBigNumber,
  wethMinAmount: EthersBigNumber
}

export type StrategyDepositType = CurveTricryptoStrategyDepositType | SushiERC20StrategyDepositType | SushiSlpStrategyDepositType;

export type StrategyWithdrawType = CurveTricryptoStrategyWithdrawType | SushiERC20StrategyWithdrawType | SushiSlpStrategyWithdrawType;

export interface InstrumentalNetworkTokenOperations extends NetworkTokenOperations {
  depositFundsCurveStrategy: (token: Token | undefined, params: CurveTricryptoStrategyDepositType) => Promise<ContractTransaction>;
  depositFundsSushiERC20Strategy: (token: Token | undefined, params: SushiERC20StrategyDepositType) => Promise<ContractTransaction>;
  depositFundsSushiSlpStrategy: (token: Token | undefined, params: SushiSlpStrategyDepositType) => Promise<ContractTransaction>;

  canCurveStrategyDepositFunds: (token: Token | undefined, value: EthersBigNumber) => boolean;
  canSushiERC20StrategyDepositFunds: (token: Token | undefined, value: EthersBigNumber, value1: EthersBigNumber) => boolean;
  canSushislpStrategyDepositFunds: (token: Token | undefined, value: EthersBigNumber) => boolean;

  withdrawFundsCurveStrategy: (token: Token | undefined, params: CurveTricryptoStrategyWithdrawType) => Promise<ContractTransaction>;
  withdrawFundsSushiERC20Strategy: (token: Token | undefined, params: SushiERC20StrategyWithdrawType) => Promise<ContractTransaction>;
  withdrawFundsSushiSLpStrategy: (token: Token | undefined, params: SushiSlpStrategyWithdrawType) => Promise<ContractTransaction>;

  canCurveStrategyWithdrawFunds: (token: Token | undefined, amount: EthersBigNumber, destinationAddress: string | undefined) => boolean;
  canSushiERC20StrategyWithdrawFunds: (token: Token | undefined, amount: EthersBigNumber) => boolean;
  canSushiSLpStrategyWithdrawFunds: (token: Token | undefined, amount: EthersBigNumber) => boolean;

  getPendingRewardsCurveStrategy: (address: string, chainId: SupportedNetworkId) => Promise<EthersBigNumber>;
  getPendingRewardsSushiERC20Strategy: (address: string, chainId: SupportedNetworkId) => Promise<EthersBigNumber>;
  getPendingRewardsSushiSLpStrategy: (address: string, chainId: SupportedNetworkId) => Promise<EthersBigNumber>;

  getDeposited: (token: Token | undefined) => Balance;
  getDepositedSum: (tokens: Array<Token | undefined>) => Balance;

  /*
  getLiquidity: (token: Token | undefined) => BigNumber | undefined;
  getLiquiditySum: (tokens: Array<Token | undefined>) => BigNumber | undefined;
  */
}

const instrumentalDefaultOperations: InstrumentalNetworkTokenOperations = {
  ...defaultOperations,
  depositFundsCurveStrategy: defaultPromiseFunction,
  depositFundsSushiERC20Strategy: defaultPromiseFunction,
  depositFundsSushiSlpStrategy: defaultPromiseFunction,

  canCurveStrategyDepositFunds: () => false,
  canSushiERC20StrategyDepositFunds: () => false,
  canSushislpStrategyDepositFunds: () => false,

  withdrawFundsCurveStrategy: defaultPromiseFunction,
  withdrawFundsSushiERC20Strategy: defaultPromiseFunction,
  withdrawFundsSushiSLpStrategy: defaultPromiseFunction,

  canCurveStrategyWithdrawFunds: () => false,
  canSushiERC20StrategyWithdrawFunds: () => false,
  canSushiSLpStrategyWithdrawFunds: () => false,

  getPendingRewardsCurveStrategy: defaultPromiseFunction,
  getPendingRewardsSushiERC20Strategy: defaultPromiseFunction,
  getPendingRewardsSushiSLpStrategy: defaultPromiseFunction,

  getDeposited: () => ({
    value: undefined,
    isLoading: false,
  }),
  getDepositedSum: () => ({
    value: undefined,
    isLoading: false,
  }),

  /*
  getLiquiditySum: () => undefined,
  getLiquidity: () => undefined,
  */
} as const;

export const InstrumentalNetworkTokenOperationsContext = createContext<InstrumentalNetworkTokenOperations>(instrumentalDefaultOperations);

export type InstrumentalContractAddresses = ContractAddresses & {
  curve?: string;
  sushiERC20?: string;
  sushisLP?: string;
}

export type InstrumentalContractAddressesPerChains = Partial<{
  [key in SupportedNetworkId]: InstrumentalContractAddresses;
}>

interface InstrumentalNetworkTokenOperationsProviderProps {
  children: any;
  contractAddresses: InstrumentalContractAddressesPerChains;
}

type InstrumentalNetworkTokenOperationsProviderWrapperProps = BlockchainProviderProps & InstrumentalNetworkTokenOperationsProviderProps

const InstrumentalNetworkTokenOperationsProvider = ({
  children,
  contractAddresses,
}: InstrumentalNetworkTokenOperationsProviderProps) : JSX.Element => {
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
        "INTOPs - Transcation could not be submitted",
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

  const {
    getBalanceSum,
    getBalance,
    getNativeTokenPrice,
    getNativeTokenAmountDecimals,
    getTokenPrice,
    getTokenAmountDecimals,
    getTransactionCount,
    getTransactions,
    getTransaction,
    getEthBalance,
    hasApprovedFunds,
    canApproveFunds,
    approveFunds,
    setNetwork,
    setToken,
    tokens,
    canDepositFunds,
    canSwapFunds,
    canWithdrawFunds,
    depositFunds,
    getLiquidity,
    swapFunds,
    withdrawFunds,
    getLiquiditySum,
  } = useContext(NetworkTokenOperationsContext);


  const { getBalances } = useContext(TokenInfoContext);

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

  const { getContract: getCurveTricryptoStrategyContract } = useContext(CurveTricryptoStrategyContractContext);
  const { getContract: getSushiERC20StrategyContract } = useContext(SushiERC20StrategyContractContext);
  const { getContract: getSushiSlpStrategyContract } = useContext(SushiSlpStrategyContractContext);

  const curveTricryptoStrategyContractAddress = useCallback(
    (network: TestSupportedNetworkId | undefined) => network && contractAddresses[network]?.curve,
    [contractAddresses]
  );

  const sushiERC20StrategyContractAddress = useCallback(
    (network: TestSupportedNetworkId | undefined) => network && contractAddresses[network]?.sushiERC20,
    [contractAddresses]
  );

  const sushiSlpStrategyContractAddress = useCallback(
    (network: TestSupportedNetworkId | undefined) => network && contractAddresses[network]?.sushisLP,
    [contractAddresses]
  );

  const curveTricryptoStrategyContract = useCallback(
    (network: TestSupportedNetworkId) => {
      const contractAddress = curveTricryptoStrategyContractAddress(network);

      if (!contractAddress) {
        return undefined;
      }

      return getCurveTricryptoStrategyContract(
        network,
        contractAddress
      ) as CurveTricryptoStrategyContractWrapper || undefined;
    },
    [getCurveTricryptoStrategyContract, curveTricryptoStrategyContractAddress]
  );

  const sushiERC20StrategyContract = useCallback(
    (network: TestSupportedNetworkId) => {
      const contractAddress = sushiERC20StrategyContractAddress(network);

      if (!contractAddress) {
        return undefined;
      }

      return getSushiERC20StrategyContract(
        network,
        contractAddress
      ) as SushiERC20StrategyContractWrapper || undefined;
    },
    [getSushiERC20StrategyContract, sushiERC20StrategyContractAddress]
  );

  const sushiSlpStrategyContract = useCallback(
    (network: TestSupportedNetworkId) => {
      const contractAddress = sushiSlpStrategyContractAddress(network);

      if (!contractAddress) {
        return undefined;
      }

      return getSushiSlpStrategyContract(
        network,
        contractAddress
      ) as SushiSlpStrategyContractWrapper || undefined;
    },
    [getSushiSlpStrategyContract, sushiSlpStrategyContractAddress]
  );

  const canCurveStrategyDepositFunds = useCallback(
    (
      token: Token | undefined, value: EthersBigNumber
    ) => {
      return (
        !!token &&
        !!account &&
        !!curveTricryptoStrategyContract(token.chainId) &&
        !value.isZero() &&
        providers[token.chainId]?.connectorType === "metamask"
      );
    },
    [
      account,
      providers,
      curveTricryptoStrategyContract,
    ]
  );

  const canSushiERC20StrategyDepositFunds = useCallback(
    (
      token: Token | undefined, value: EthersBigNumber, value1: EthersBigNumber
    ) => {
      return (
        !!token &&
        !!account &&
        !!sushiERC20StrategyContract(token.chainId) &&
        !value.isZero() &&
        !value1.isZero() &&
        providers[token.chainId]?.connectorType === "metamask"
      );
    },
    [
      account,
      providers,
      sushiERC20StrategyContract,
    ]
  );

  const canSushislpStrategyDepositFunds = useCallback(
    (
      token: Token | undefined, value: EthersBigNumber
    ) => {
      return (
        !!token &&
        !!account &&
        !!sushiSlpStrategyContract(token.chainId) &&
        !value.isZero() &&
        providers[token.chainId]?.connectorType === "metamask"
      );
    },
    [
      account,
      providers,
      sushiSlpStrategyContract,
    ]
  );

  const depositFundsCurveStrategy = useCallback(
    (
      token: Token | undefined, params: CurveTricryptoStrategyDepositType
    ) : Promise<ContractTransaction> => {
      const {
        assetAddress, amount, lpAmountMinimum
      } = params;
      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!token || !canCurveStrategyDepositFunds(
          token,
          amount
        )) {
          const reason = "Cannot deposit funds - Please call canDepositFunds to check whether depositFunds can be called."
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        const contract = curveTricryptoStrategyContract(token.chainId);

        if (!contract) {
          const reason = "Curve Tricrypto Strategy contract not found"
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .deposit(
            assetAddress,
            amount,
            lpAmountMinimum
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
      canCurveStrategyDepositFunds,
      erc20Contract,
      curveTricryptoStrategyContract,
      onTransactionFailed,
      onTransactionSubmitted,
      onTransactionSuccessful,
    ]
  );

  const depositFundsSushiERC20Strategy = useCallback(
    (
      token: Token | undefined, params: SushiERC20StrategyDepositType
    ) : Promise<ContractTransaction> => {
      const {
        amount1, amount2, asset1, asset2, deadline, swapTokenOutMin
      } = params;

      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!token || !canSushiERC20StrategyDepositFunds(
          token,
          amount1,
          amount2
        )) {
          const reason = "Cannot deposit funds - Please call canDepositFunds to check whether depositFunds can be called."
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        const contract = sushiERC20StrategyContract(token.chainId);

        if (!contract) {
          const reason = "Sushi ERC20 Strategy contract not found"
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .deposit(
            amount1,
            asset1,
            amount2,
            asset2,
            deadline,
            swapTokenOutMin
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
      canSushiERC20StrategyDepositFunds,
      erc20Contract,
      sushiERC20StrategyContract,
      onTransactionFailed,
      onTransactionSubmitted,
      onTransactionSuccessful,
    ]
  );

  const depositFundsSushiSlpStrategy = useCallback(
    (
      token: Token | undefined, params: SushiSlpStrategyDepositType
    ) : Promise<ContractTransaction> => {
      const {
        amount, asset, deadline, swapTokenOutMin
      } = params;
      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!token || !canSushislpStrategyDepositFunds(
          token,
          amount
        )) {
          const reason = "Cannot deposit funds - Please call canDepositFunds to check whether depositFunds can be called."
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        const contract = sushiSlpStrategyContract(token.chainId);

        if (!contract) {
          const reason = "SushiS LP Strategy contract not found"
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .deposit(
            amount,
            asset,
            deadline,
            swapTokenOutMin
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
      canSushislpStrategyDepositFunds,
      erc20Contract,
      sushiSlpStrategyContract,
      onTransactionFailed,
      onTransactionSubmitted,
      onTransactionSuccessful,
    ]
  );

  /*
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
  */

  const canCurveStrategyWithdrawFunds = useCallback(
    (
      token: Token | undefined, amount: EthersBigNumber, destinationAddress: string | undefined
    ) => {
      return (
        !!token &&
        !!destinationAddress &&
        !!account &&
        !!curveTricryptoStrategyContractAddress(token.chainId) &&
        !amount.lte(0) &&
        providers[token.chainId]?.connectorType === "metamask"
      );
    },
    [
      account,
      providers,
      curveTricryptoStrategyContractAddress,
    ]
  );

  const withdrawFundsCurveStrategy = useCallback(
    (
      token: Token | undefined, curveParams: CurveTricryptoStrategyWithdrawType
    ) => {
      const {
        amount, assetAddress, params
      } = curveParams;
      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!token || !canCurveStrategyWithdrawFunds(
          token,
          amount,
          assetAddress,
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

        const contract = curveTricryptoStrategyContract(token.chainId);

        if (!contract) {
          const reason = "Curve TriCrypto Strategy contract not found"
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .withdraw(
            amount,
            assetAddress,
            params
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
      canCurveStrategyWithdrawFunds,
      erc20Contract,
      receiptTokens,
      curveTricryptoStrategyContract,
      onTransactionFailed,
      onTransactionSubmitted,
      onTransactionSuccessful,
    ]
  );

  const canSushiERC20StrategyWithdrawFunds = useCallback(
    (
      token: Token | undefined, amount: EthersBigNumber
    ) => {
      return (
        !!token &&
        !!account &&
        !!sushiERC20StrategyContract(token.chainId) &&
        !amount.lte(0) &&
        providers[token.chainId]?.connectorType === "metamask"
      );
    },
    [
      account,
      providers,
      sushiERC20StrategyContract,
    ]
  );

  const withdrawFundsSushiERC20Strategy = useCallback(
    (
      token: Token | undefined, sushiParams: SushiERC20StrategyWithdrawType
    ) => {
      const {
        amount, amountAMin, amountBMin, asset, deadline
      } = sushiParams;
      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!token || !canSushiERC20StrategyWithdrawFunds(
          token,
          amount,
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

        const contract = sushiERC20StrategyContract(token.chainId);

        if (!contract) {
          const reason = "Sushi ERC20 Strategy contract not found"
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .withdraw(
            amount,
            asset,
            deadline,
            amountAMin,
            amountBMin
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
      canSushiERC20StrategyWithdrawFunds,
      erc20Contract,
      receiptTokens,
      sushiERC20StrategyContract,
      onTransactionFailed,
      onTransactionSubmitted,
      onTransactionSuccessful,
    ]
  );

  const canSushiSLpStrategyWithdrawFunds = useCallback(
    (
      token: Token | undefined, amount: EthersBigNumber
    ) => {
      return (
        !!token &&
        !!account &&
        !!sushiSlpStrategyContract(token.chainId) &&
        !amount.lte(0) &&
        providers[token.chainId]?.connectorType === "metamask"
      );
    },
    [
      account,
      providers,
      sushiSlpStrategyContract,
    ]
  );

  const withdrawFundsSushiSLpStrategy = useCallback(
    (
      token: Token | undefined, sushiParams: SushiSlpStrategyWithdrawType
    ) => {
      const {
        amount, amountAMin, amountBMin, asset, deadline, wethMinAmount
      } = sushiParams;
      return new Promise<ContractTransaction>((
        resolve, reject
      ) => {
        if (!token || !canSushiSLpStrategyWithdrawFunds(
          token,
          amount,
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

        const contract = sushiSlpStrategyContract(token.chainId);

        if (!contract) {
          const reason = "SushiSLP Strategy contract not found"
          onTransactionFailed(reason);
          reject(reason);
          return;
        }

        contract
          .withdraw(
            amount,
            asset,
            deadline,
            amountAMin,
            amountBMin,
            wethMinAmount
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
      canSushiSLpStrategyWithdrawFunds,
      erc20Contract,
      receiptTokens,
      sushiSlpStrategyContract,
      onTransactionFailed,
      onTransactionSubmitted,
      onTransactionSuccessful,
    ]
  );

  const getPendingRewardsCurveStrategy = useCallback(
    (
      address: string, chainId: SupportedNetworkId
    ) => {
      return new Promise<EthersBigNumber>((
        resolve, reject
      ) => {
        const contract = curveTricryptoStrategyContract(chainId);

        if (!contract) {
          const reason = "Curve Tricrypto Strategy contract not found"
          reject(reason);
          return;
        }

        contract
          .getPendingRewards(address)
          .then((rewards: EthersBigNumber) => {
            resolve(rewards);
          })
          .catch((e: any) => {
            onTransactionFailed(e);
            reject(e);
          });
      });
    },
    [
      curveTricryptoStrategyContract,
      onTransactionFailed,
    ]
  );

  const getPendingRewardsSushiERC20Strategy = useCallback(
    (
      address: string, chainId: SupportedNetworkId
    ) => {
      return new Promise<EthersBigNumber>((
        resolve, reject
      ) => {

        const contract = sushiERC20StrategyContract(chainId);

        if (!contract) {
          const reason = "SushiERC20 Strategy contract not found"
          reject(reason);
          return;
        }

        contract
          .getPendingRewards(address)
          .then((rewards: EthersBigNumber) => {
            resolve(rewards);
          })
          .catch((e: any) => {
            onTransactionFailed(e);
            reject(e);
          });
      });
    },
    [
      sushiERC20StrategyContract,
      onTransactionFailed,
    ]
  );

  const getPendingRewardsSushiSLpStrategy = useCallback(
    (
      address: string, chainId: SupportedNetworkId
    ) => {
      return new Promise<EthersBigNumber>((
        resolve, reject
      ) => {

        const contract = sushiSlpStrategyContract(chainId);

        if (!contract) {
          const reason = "SushiSLp Strategy contract not found"
          reject(reason);
          return;
        }

        contract
          .getPendingRewards(address)
          .then((rewards: EthersBigNumber) => {
            resolve(rewards);
          })
          .catch((e: any) => {
            onTransactionFailed(e);
            reject(e);
          });
      });
    },
    [
      sushiSlpStrategyContract,
      onTransactionFailed,
    ]
  );

  return (
    <InstrumentalNetworkTokenOperationsContext.Provider
      value={{
        tokens,
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
        canCurveStrategyDepositFunds,
        canSushiERC20StrategyDepositFunds,
        canSushislpStrategyDepositFunds,
        depositFundsCurveStrategy,
        depositFundsSushiERC20Strategy,
        depositFundsSushiSlpStrategy,
        canCurveStrategyWithdrawFunds,
        canSushiERC20StrategyWithdrawFunds,
        canSushiSLpStrategyWithdrawFunds,
        withdrawFundsCurveStrategy,
        withdrawFundsSushiERC20Strategy,
        withdrawFundsSushiSLpStrategy,
        getTransactionCount,
        getTransactions,
        getTransaction,
        getPendingRewardsCurveStrategy,
        getPendingRewardsSushiERC20Strategy,
        getPendingRewardsSushiSLpStrategy,
        canDepositFunds,
        canSwapFunds,
        canWithdrawFunds,
        depositFunds,
        getLiquidity,
        swapFunds,
        withdrawFunds,
        getLiquiditySum,
      }}
    >
      {children}
    </InstrumentalNetworkTokenOperationsContext.Provider>
  );
}

const InstrumentalNetworkTokenOperationsProviderWrapper = (props: InstrumentalNetworkTokenOperationsProviderWrapperProps) =>
  <NetworkTokenOperationsProvider supportedChains={props.supportedChains} contractAddresses={props.contractAddresses}>
    <CurveTricryptoStrategyContractProvider>
      <SushiERC20StrategyContractProvider>
        <SushiSlpStrategyContractProvider>
          <InstrumentalNetworkTokenOperationsProvider contractAddresses={props.contractAddresses}>
            {props.children}
          </InstrumentalNetworkTokenOperationsProvider>
        </SushiSlpStrategyContractProvider>
      </SushiERC20StrategyContractProvider>
    </CurveTricryptoStrategyContractProvider>
  </NetworkTokenOperationsProvider>

InstrumentalNetworkTokenOperationsProviderWrapper.defaultProps = blockchainProviderDefaultProps;

export { InstrumentalNetworkTokenOperationsProviderWrapper as InstrumentalNetworkTokenOperationsProviderWrapper };
export type { InstrumentalNetworkTokenOperationsProviderWrapperProps as InstrumentalNetworkTokenOperationsProviderWrapperProps };
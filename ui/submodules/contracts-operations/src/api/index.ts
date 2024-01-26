import { toTokenUnitsBN } from "@integrations-lib/interaction";
import axios from "axios";
import BigNumber from "bignumber.js";

import { AmmID, SUPPORTED_NETWORKS, SupportedNetworkId, SwapAmmID, TestSupportedNetworkId } from "../defi/constants";
import { APISupportedTokens, CrossChainId } from "../store/supportedTokens/slice";

const transfersApi = axios.create({ baseURL: process.env.TRANSFERS_API_URL });

const priceFeedApi = axios.create({ baseURL: process.env.PRICE_FEED_API_URL })

export const logError = (e: any) => {
  if (e.response) {
    /*
    * The request was made and the server responded with a
    * status code that falls out of the range of 2xx
    */
    console.log('Fetch supported tokens: Server responded');
    console.log(
      'Data:',
      e.response.data
    );
    console.log(
      'Status',
      e.response.status
    );
    console.log(
      'Headers',
      e.response.headers
    );
  } else if (e.request) {
    /*
      * The request was made but no response was received, `error.request`
      * is an instance of XMLHttpRequest in the browser and an instance
      * of http.ClientRequest in Node.js
      */
    console.log('Fetch supported tokens: Server did not respond');
    console.log(
      'Request:',
      e.request
    );
  } else {
    // Something happened in setting up the request and triggered an Error
    console.log('Fetch supported tokens: Config error');
    console.log(
      'Message:',
      e.message
    );
  }

  console.log(
    'Config:',
    e.config
  );
}

export const getSupportedTokens = async () => {
  const requestedData = ["liquidityTokens", "supportedAmms", "transferPairs"];
  const path = `/supported?requestedData=${requestedData.join(',')}&chainIds=${Object.keys(SUPPORTED_NETWORKS).join(',')}`;

  try {
    const ret = await transfersApi.get(path);

    return ret.data as APISupportedTokens;
  } catch (e: any) {
    logError(e);
    return [];
  }
};

export interface APIFees {
  baseFee?: BigNumber;
  mosaicFeePercentage?: number;
}

export type FeeType = 'transfer_fee' | 'liquidity_withdrawal_fee'

export const getFees = async (
  feeType: FeeType, ammId: SwapAmmID, amount: BigNumber, tokenAddress: string, chainId: SupportedNetworkId
) => {
  const path = `/withdrawal-fee?feeType=${feeType}&ammId=${ammId}&amount=${amount.toString()}&destinationTokenAddress=${tokenAddress}&destinationChainId=${chainId}`;

  try {
    const ret = await transfersApi.get(path);

    return {
      ...ret.data,
      baseFee: toTokenUnitsBN(
        ret.data.baseFee,
        18
      ), // TODO(Marko): Decimals hardcoded - Should be using decimals of destination chain native token
      mosaicFeePercentage: ret.data.mosaicFeePercentage / 100, // mosaicFeePercentage name is misleading since it is not a percentage but percentage times 100
    } as APIFees;
  } catch (e: any) {
    logError(e);
    return {};
  }
};

export const getTokenPrice = async (
  chainId: SupportedNetworkId, tokenAddress: string
) => {
  const path = `/erc20/prices/current`;

  try {
    const ret = await priceFeedApi.post(
      path,
      {
        chainTokenAddresses: [{
          chainId,
          addresses: [tokenAddress]
        }]
      }
    );

    return ret.data?.[0]?.usdPrice || 1;
  } catch (e: any) {
    logError(e);
    return 1;
  }
};

export const getNativeTokenPrice = async (chainId: SupportedNetworkId) => getTokenPrice(
  chainId,
  "0x0000000000000000000000000000000000000000"
)

export interface APIRewards {
  alreadyClaimed?: BigNumber;
  claimable?: BigNumber;
}

export const getRewards = async (
  crossChainId: CrossChainId, account: string
) => {
  const path = `/rewards?tokenId=${crossChainId}&userAddress=${account}`;

  try {
    const ret = await transfersApi.get(path);

    return {
      ...ret.data,
      alreadyClaimed: toTokenUnitsBN(
        ret.data.alreadyClaimed,
        18
      ), // TODO(Marko): Decimals hardcoded - Should be using decimals of destination chain native token
      claimable: toTokenUnitsBN(
        ret.data.claimable,
        18
      ), // TODO(Marko): Decimals hardcoded - Should be using decimals of destination chain native token
    } as APIRewards;
  } catch (e: any) {
    logError(e);
    return {};
  }
};

export type TransactionType = "all" | "nft" | "token" | "liquidity-withdrawal" | "liquidity-deposit";

export type TransactionStatus = "success" | "error" | "in_progress";

export const TransactionStatusValues: { [key in TransactionStatus]: string } = {
  success: "success",
  error: "error",
  in_progress: "in_progress",
};

export const TransactionStatusLabels: { [key in TransactionStatus]: string } = {
  success: "Done",
  error: "Failed",
  in_progress: "In progress",
};

export type EarnTransactionType = "deposit" | "withdraw";
export const EarnTransactionTypeValues: {
  [key in EarnTransactionType]: string;
} = {
  deposit: "deposit",
  withdraw: "withdraw",
};

export interface APIAtomicTransaction {
  hash: string;
  timestamp: string;
}

export type APIAtomicTransactions = {
  [key: string]: APIAtomicTransaction;
}

export interface APIFeeTaken {
  fee: BigNumber;
  baseFee: BigNumber;
  totalFee: BigNumber;
}

export interface APITransaction {
  amount: BigNumber;
  destinationTokenAddress: string;
  destinationUserAddress: string;
  feeTaken?: APIFeeTaken;
  minimumOutAmount: BigNumber;
  publicId: string;
  remoteAMMId: AmmID;
  remoteNetworkId: TestSupportedNetworkId;
  sourceNetworkId: TestSupportedNetworkId;
  sourceTokenAddress: string;
  sourceUserAddress: string;
  status: TransactionStatus;
  swapToNative: boolean;
  type: TransactionType;
  transactions: APIAtomicTransactions;
}

export const compareTxByDate = (
  tx1: APITransaction, tx2: APITransaction
) => getTxDate(tx2).getTime() - getTxDate(tx1).getTime()

export const isOwner = (
  tx: APITransaction, account: string | undefined
) => tx.sourceUserAddress === account?.toLowerCase() || tx.destinationUserAddress === account?.toLowerCase();

export const getTxDate = (tx: APITransaction) : Date => {
  switch (tx.type) {
    case 'liquidity-withdrawal':
      return new Date(tx.transactions.Withdrawal.timestamp); // TODO(Marko): Decapitalize Withdrawal when fixed on the backend
    default:
      return new Date(tx.transactions.deposit.timestamp);
  }
}

export interface APITransactions {
  count: number;
  data: Array<APITransaction>;
}

type TransactionStatusMapping = {
  [key: string]: TransactionStatus;
}

const txStatusMapping: TransactionStatusMapping = {
  'deposit_confirmed': "in_progress",
  'tranferring-withdrawing': "in_progress",
  'transferring-withdraw_submitted': "in_progress",
  'expired-refunding': "in_progress",
  'expired-refund_submitted': "in_progress",
  'error-withdrawing': "in_progress",
  'error-refunding': "in_progress",
  'expired-done': "error",
  'error-invalid_deposit': "error",
  'error-done': "error",
  'success-done': "success",
}

const extractAmount = (tx: any) => tx.amount !== undefined ? tx.amount : tx.inAmount; // TODO(Marko): Remove this when inconsistency fixed 'liquidity-deposit' (inAmount)
const extractSourceTokenAddress = (tx: any) => tx.type === 'liquidity-withdrawal' ? tx.tokenIn?.toLowerCase() : tx.sourceTokenAddress?.toLowerCase(); // TODO(Marko): Remove workaround when tokenIn renamed on backend
const extractDestinationTokenAddress = (tx: any) => tx.type === 'liquidity-withdrawal' ? tx.tokenOut?.toLowerCase() : tx.destinationTokenAddress?.toLowerCase(); // TODO(Marko): Remove workaround when tokenIn renamed on backend
const extractDestinationNetworkId = (tx: any) => tx.remoteNetworkId !== undefined ? tx.remoteNetworkId : tx.destinationNetworkId; // TODO(Marko): Remove this when inconsistency fixed 'liquidity-deposit' (inAmount)
const extractWithdrawalTransaction = (tx: any) => tx.transactions?.withdrawal !== undefined ? tx.transactions.withdrawal : tx.transactions?.Withdrawal; // TODO(Marko): Remove this when inconsistency fixed 'liquidity-deposit' (inAmount)

const deserializeTransaction = (tx: any) => ({
  ...tx,
  amount: extractAmount(tx) ? toTokenUnitsBN( // TODO(Marko): Remove undefined check when inconsistency fixed for 'liquidity-deposit' (inAmount)
    extractAmount(tx).$numberDecimal,
    18
  ) : undefined,
  minimumOutAmount: tx.minimumOutAmount !== undefined ? toTokenUnitsBN(
    tx.minimumOutAmount.$numberDecimal,
    18
  ) : undefined,
  feeTaken: tx.feeTaken !== undefined ? {
    ...tx.feeTaken,
    fee: toTokenUnitsBN(
      tx.feeTaken.fee,
      18
    ),
    baseFee: toTokenUnitsBN(
      tx.feeTaken.baseFee,
      18
    ),
    totalFee: toTokenUnitsBN(
      tx.feeTaken.totalFee,
      18
    ),
  } : undefined,
  status: txStatusMapping[tx.status],
  sourceNetworkId: tx.sourceNetworkId,
  remoteNetworkId: tx.type === 'liquidity-deposit' ? parseInt(tx.sourceNetworkId) : extractDestinationNetworkId(tx), // TODO(Marko): Remove parseInt workaround when inconsistency fixed for 'liquidity-deposit'
  sourceTokenAddress: extractSourceTokenAddress(tx),
  destinationTokenAddress: extractDestinationTokenAddress(tx),
  sourceUserAddress: tx.sourceUserAddress.toLowerCase(),
  destinationUserAddress: tx.destinationUserAddress.toLowerCase(),
  transactions: {
    ...tx.transactions,
    withdrawal: extractWithdrawalTransaction(tx),
  }
})

export const getTranscations = async (
  type: TransactionType, itemsPerPage: number, pageNumber: number, account?: string
) => {
  const path = `/transfers/latest?type=${type}&perPage=${itemsPerPage}&page=${pageNumber}${account ? `&userAddress=${account}` : ''}`;

  try {
    const ret = await transfersApi.get(path);

    return {
      ...ret.data,
      data: ret.data.data.map((tx: any) => deserializeTransaction(tx) as APITransaction)
    } as APITransactions;
  } catch (e: any) {
    logError(e);
    return {
      count: 0,
      data: [],
    };
  }
};

export const getTranscation = async (
  type: TransactionType, id: string
) : Promise<APITransaction> => {
  return new Promise<APITransaction>((
    resolve, reject
  ) => {
    const path = `/transfers/${id}?type=${type}`;
    transfersApi
      .get(path)
      .then((ret: any) => {
        resolve(deserializeTransaction(ret.data) as APITransaction)
      })
      .catch((e: any) => {
        logError(e);
        reject(e);
      });
  })
};

export const getTranscationCount = async (
  type?: TransactionType, account?: string
) : Promise<number> => {
  const path = `/transfers/count${type ? `?&type=${type}` : ''}${account ? `&userAddress=${account}` : ''}`;

  try {
    const ret = await transfersApi.get(path);

    return ret.data.count;
  } catch (e: any) {
    logError(e);
    return 0;
  }
}

export type APITokenSupportedAmmsData = {
  [address: string]: Array<number>;
}

export type APITokenSupportedAmms = {
  data: APITokenSupportedAmmsData;
}

export const getSupportedAmms = async (chainId: SupportedNetworkId) : Promise<APITokenSupportedAmms> => {
  const path = `/supported/amms?chainId=${chainId}`;

  try {
    const ret = await transfersApi.get(path);

    return ret.data as APITokenSupportedAmms;
  } catch (e: any) {
    logError(e);
    return { data: {} };
  }
};
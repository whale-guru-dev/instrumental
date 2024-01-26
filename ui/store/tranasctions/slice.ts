import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContractAddresses } from "defi/addresses";
import { Contracts } from "defi/ContractsContext";
import { RootState } from "..";

export type TransactionStatus = "pending" | "error" | "completed";

export interface Transaction {
  status: TransactionStatus;
  minedBlock: number;
  createdTimestamp: number;
  lastCheckBlock: number;
  functionName: string;
  label: string;
  contractAddress: string;
  toUpdate?: {
    contractType: Contracts;
    functionName: string;
    data?: (string | number)[];
    contract?: ContractAddresses;
  }[];
}

const initialState: {
  [chainId: number]: { [address: string]: { [txHash: string]: Transaction } };
} = {};

export const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    newTransaction: (
      state,
      action: PayloadAction<{
        txHash: string;
        chainId: number;
        address: string;
        contractAddress: string;
        functionName: string;
        label: string;
        toUpdate?: {
          contractType: Contracts;
          functionName: string;
          data?: (string | number)[];
          contract?: ContractAddresses;
        }[];
      }>,
    ) => {
      const {
        chainId,
        address,
        txHash,
        contractAddress,
        functionName,
        toUpdate,
        label,
      } = action.payload;

      if (!(chainId in state)) {
        state[chainId] = {};
      }
      if (!(address in state[chainId])) {
        state[chainId][address] = {};
      }
      if (txHash in state[chainId][address]) {
        console.error(
          "Can't update the transaction. The transaction is already in the store",
        );
      } else {
        const e = Object.entries(state[chainId][address]);
        if (e.length === 8) {
          const sorted = e.sort(
            ([_a, a], [_b, b]) => b.createdTimestamp - a.createdTimestamp,
          );

          delete state[chainId][address][sorted[sorted.length - 1][0]];
        }
        state[chainId][address][txHash] = {
          status: "pending",
          createdTimestamp: new Date().getTime(),
          lastCheckBlock: 0,
          minedBlock: Number.MAX_SAFE_INTEGER,
          contractAddress,
          functionName,
          label,
          toUpdate,
        };
      }
    },
    errorTransaction: (
      state,
      action: PayloadAction<{
        txHash: string;
        chainId: number;
        address: string;
      }>,
    ) => {
      const { chainId, address, txHash } = action.payload;

      if (txHash in state[chainId][address]) {
        state[chainId][address][txHash].status = "error";
      } else {
        console.error(
          "Can't update the transaction. The transaction does not exist",
        );
      }
    },
    completeTransaction: (
      state,
      action: PayloadAction<{
        txHash: string;
        chainId: number;
        address: string;
        minedBlock: number;
      }>,
    ) => {
      const { chainId, address, txHash, minedBlock } = action.payload;

      if (txHash in state[chainId][address]) {
        state[chainId][address][txHash].status = "completed";
        state[chainId][address][txHash].minedBlock = minedBlock;
      } else {
        console.error(
          "Can't update the transaction. The transaction does not exist",
        );
      }
    },
    removeTransaction: (
      state,
      action: PayloadAction<{
        txHash: string;
        chainId: number;
        address: string;
      }>,
    ) => {
      const { chainId, address, txHash } = action.payload;
      delete state[chainId][address][txHash];
    },
    removeAllTransactions: (
      state,
      action: PayloadAction<{ chainId: number; address: string }>,
    ) => {
      const { chainId, address } = action.payload;
      state[chainId][address] = {};
      /*
      // TODO just temporary
      const list = state[chainId][address]
      state[chainId][address] = Object.entries(list)
        .filter(([_, value]) => value.status === 'pending')
        .reduce((obj, [key, _]) => {
          obj[key] = list[key]
          return obj
        }, {} as { [txHash: string]: Transaction })
        */
    },
    removeAddress: (
      state,
      action: PayloadAction<{ chainId: number; address: string }>,
    ) => {
      const { chainId, address } = action.payload;
      delete state[chainId][address];
    },
  },
});

export const {
  newTransaction,
  completeTransaction,
  errorTransaction,
  removeTransaction,
  removeAllTransactions,
  removeAddress,
} = transactionSlice.actions;

export const selectAllTransactions = (state: RootState) => state.transactions;

export default transactionSlice.reducer;

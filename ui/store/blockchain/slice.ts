import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

export interface Blockchain {
  readonly blockNumber: {
    readonly [chainId: number]: { blockNumber: number; blockTimestamp: number };
  };
}

const initialState: Blockchain = {
  blockNumber: {},
};

export const blockchainSlice = createSlice({
  name: "blockchain",
  initialState,
  reducers: {
    updateBlockNumber: (
      state,
      action: PayloadAction<{
        chainId: number;
        blockNumber: number;
        blockTimestamp: number;
      }>,
    ) => {
      const { chainId, blockNumber, blockTimestamp } = action.payload;
      if (!state.blockNumber[chainId]) {
        state.blockNumber[chainId] = {
          blockNumber,
          blockTimestamp,
        };
      } else {
        state.blockNumber[chainId].blockNumber = Math.max(
          blockNumber,
          state.blockNumber[chainId].blockNumber,
        );
        state.blockNumber[chainId].blockTimestamp = blockTimestamp;
      }
    },
  },
});

export const { updateBlockNumber } = blockchainSlice.actions;

export const selectAllBlockInfos = (state: RootState) =>
  state.blockchain.blockNumber;

export default blockchainSlice.reducer;

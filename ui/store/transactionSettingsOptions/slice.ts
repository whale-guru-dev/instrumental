import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

export interface TransactionSettingsOptions {
  slippage: number;
  deadline: number;
}

const initialState: TransactionSettingsOptions = {
  slippage: 0.5,
  deadline: 30,
};

export const transactionSettingsOptionsSlice = createSlice({
  name: "transactionSettingsOptions",
  initialState,
  reducers: {
    setSlippage: (
      state,
      payload: PayloadAction<TransactionSettingsOptions["slippage"]>,
    ) => {
      state.slippage = payload.payload;
    },
    setDeadline: (
      state,
      payload: PayloadAction<TransactionSettingsOptions["deadline"]>,
    ) => {
      state.deadline = payload.payload;
    },
  },
});

export const selectSlippage = (state: RootState) =>
  state.transactionSettingsOptions.slippage;
export const selectDeadline = (state: RootState) =>
  state.transactionSettingsOptions.deadline;

export const { setSlippage, setDeadline } =
  transactionSettingsOptionsSlice.actions;

export default transactionSettingsOptionsSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export type LockTimePeriod =
  | "oneMonth"
  | "threeMonths"
  | "sixMonths"
  | "oneYear"
  | "twoYear";

export type VEscrowStore = {
  balance: number;
  balanceBN: string;
  totalSupply: number;
  locked: number;
  end: number;
  lockTime: number;
  lockedAmounts: {
    [apyId in LockTimePeriod]: number;
  };
};

export const initialState: VEscrowStore = {
  balance: 0,
  balanceBN: "0",
  totalSupply: 0,
  locked: 0,
  end: 0,
  lockTime: 0,
  lockedAmounts: {
    oneMonth: 0,
    threeMonths: 0,
    sixMonths: 0,
    oneYear: 0,
    twoYear: 0,
  },
};

export const veSTRMSlice = createSlice({
  name: "userdata",
  initialState,
  reducers: {
    veSTRMBalanceUpdate: (
      state,
      action: PayloadAction<{ balance: number; balanceBN: string }>,
    ) => {
      state.balance = action.payload.balance;
      state.balanceBN = action.payload.balanceBN;
    },
    veSTRMtotalSupplyUpdate: (
      state,
      action: PayloadAction<{ totalSupply: number }>,
    ) => {
      state.totalSupply = action.payload.totalSupply;
    },
    veSTRMlockedupdate: (state, action: PayloadAction<{ locked: number }>) => {
      state.locked = action.payload.locked;
    },
    veSTRMEndupdate: (state, action: PayloadAction<{ end: number }>) => {
      state.end = action.payload.end;
    },
    veSTRMUpdateAmountLockedPeriodUpdate: (
      state,
      action: PayloadAction<{ apy: LockTimePeriod; value: number }>,
    ) => {
      state.lockedAmounts[action.payload.apy] = action.payload.value;
    },
    veSTRMaddAmountLockedPeriodUpdate: (
      state,
      action: PayloadAction<{ apy: LockTimePeriod; value: number }>,
    ) => {
      state.lockedAmounts[action.payload.apy] += action.payload.value;
    },
    veSTRMsubAmountLockedPeriod: (
      state,
      action: PayloadAction<{ apy: LockTimePeriod; value: number }>,
    ) => {
      state.lockedAmounts[action.payload.apy] -= action.payload.value;
    },
    veSTRMupdateLockTime: (
      state,
      action: PayloadAction<{ locktime: number }>,
    ) => {
      state.lockTime = action.payload.locktime;
    },
    veSTRMreset: (state) => {
      state.end = 0;
      state.balance = 0;
      state.locked = 0;
      state.balanceBN = "0";
      state.lockTime = 0;
    },
    veSTRMresetLockedAmounts: (state) => {
      state.lockedAmounts.oneMonth = 0;
      state.lockedAmounts.twoYear = 0;
      state.lockedAmounts.threeMonths = 0;
      state.lockedAmounts.sixMonths = 0;
      state.lockedAmounts.oneYear = 0;
    },
  },
});

export const {
  veSTRMBalanceUpdate,
  veSTRMtotalSupplyUpdate,
  veSTRMlockedupdate,
  veSTRMEndupdate,
  veSTRMaddAmountLockedPeriodUpdate,
  veSTRMsubAmountLockedPeriod,
  veSTRMupdateLockTime,
  veSTRMreset,
  veSTRMresetLockedAmounts,
  veSTRMUpdateAmountLockedPeriodUpdate,
} = veSTRMSlice.actions;

export const selectveSTRM = (state: RootState) => state.veSTRM;

export default veSTRMSlice.reducer;

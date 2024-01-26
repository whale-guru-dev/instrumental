import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

export interface LiquidityMiningPool {
  accInstrumentalPerShare: number;
  lastRewardBlock: number;
  end: number;
  locked: boolean;
  instrumentalPerBlock: number;
  supply: number;
  poolId: number;
}

export interface UserLMInfo {
  lockedLPTokens: string;
  rewardDebt: number;
}

export type LMPoolSlice = {
  pools: { [index: number]: LiquidityMiningPool };
  userInfo: { [index: number]: UserLMInfo };
  pendingSTRM: { [index: number]: number };
};

const initialState: LMPoolSlice = {
  pools: {
    0: {
      accInstrumentalPerShare: 0,
      lastRewardBlock: 0,
      end: 0,
      locked: true,
      instrumentalPerBlock: 0,
      supply: 0,
      poolId: 0,
    },
    1: {
      accInstrumentalPerShare: 0,
      lastRewardBlock: 0,
      end: 0,
      locked: true,
      instrumentalPerBlock: 0,
      supply: 0,
      poolId: 0,
    },
  },
  userInfo: {
    0: {
      lockedLPTokens: "0",
      rewardDebt: 0,
    },
    1: {
      lockedLPTokens: "0",
      rewardDebt: 0,
    },
  },
  pendingSTRM: {
    0: 0,
    1: 0,
  },
};

export const liquidityMiningPoolSlice = createSlice({
  name: "liquidityMiningPool",
  initialState,
  reducers: {
    initPool: (
      state,
      action: PayloadAction<{
        data: {
          accInstrumentalPerShare: number;
          lastRewardBlock: number;
          end: number;
          locked: boolean;
          instrumentalPerBlock: number;
          supply: number;
          poolId: number;
        };
      }>,
    ) => {
      const { data } = action.payload;
      state.pools[data.poolId] = {
        ...data,
      };
    },
    updateUserPendingSTRM: (
      state,
      action: PayloadAction<{
        pendingInstrumental: number;
        poolId: number;
      }>,
    ) => {
      let { pendingInstrumental, poolId } = action.payload;
      state.pendingSTRM[poolId] = pendingInstrumental;
    },
    updateLMUserInfo: (
      state,
      action: PayloadAction<{
        locked: string;
        rewardDebt: number;
        poolId: number;
      }>,
    ) => {
      const { locked, poolId } = action.payload;
      state.userInfo[poolId].lockedLPTokens = locked;
    },
    updateOnHarvest: (
      state,
      action: PayloadAction<{
        harvestedAmount: number;
        poolId: number;
      }>,
    ) => {
      const { poolId, harvestedAmount } = action.payload;
      state.pendingSTRM[poolId] -= harvestedAmount;
    },
    resetLiquidityMiningPoolUserData: (state) => {
      for (let pool = 0; pool < Object.keys(state.pools).length; pool++) {
        state.pendingSTRM[pool] = 0;
        state.userInfo[pool].rewardDebt = 0;
        state.userInfo[pool].lockedLPTokens = "0";
      }
    },
  },
});

export const selectLiquidityMiningPools = (state: RootState) =>
  state.liquidityMiningPool.pools;
export const selectLiquidityMiningUserInfo = (state: RootState) =>
  state.liquidityMiningPool.userInfo;

export const selectLMPendingSTRM = (state: RootState) =>
  state.liquidityMiningPool.pendingSTRM;

export const {
  initPool,
  updateLMUserInfo,
  updateUserPendingSTRM,
  updateOnHarvest,
  resetLiquidityMiningPoolUserData,
} = liquidityMiningPoolSlice.actions;

export default liquidityMiningPoolSlice.reducer;

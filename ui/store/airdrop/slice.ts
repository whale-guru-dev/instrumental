import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

export interface AirdropUserInfo {
  proof: {
    [index: number]: string[];
  };
  pendingRewards: {
    [index: number]: number;
  };
  volume: {
    [index: number]: number;
  };
}

export type AirdropSlice = {
  totalVestings: number;
  userInfo: AirdropUserInfo;
};

const initialState: AirdropSlice = {
  totalVestings: 3,
  userInfo: {
    proof: {
      0: [],
      1: [],
      2: [],
    },
    pendingRewards: {
      1: 0,
      2: 0,
      3: 0,
    },
    volume: {
      0: 0,
      1: 0,
      2: 0,
    },
  },
};

export const airdropSlice = createSlice({
  name: "airdrop",
  initialState,
  reducers: {
    updateAirdropUserInfo: (
      state,
      action: PayloadAction<{
        proof: string[];
        volume: number;
        pendingInstrumental: number;
        vestId: number;
      }>,
    ) => {
      let { proof, volume, pendingInstrumental, vestId } = action.payload;
      state.userInfo.pendingRewards[vestId] = pendingInstrumental;
      state.userInfo.volume[vestId] = volume;
      state.userInfo.proof[vestId] = proof;
    },
    onAirdropHarvest: (
      state,
      action: PayloadAction<{
        harvestedAmount: number;
        vestId: number;
      }>,
    ) => {
      const { vestId, harvestedAmount } = action.payload;
      state.userInfo.pendingRewards[vestId] -= harvestedAmount;
    },
    resetAirdropUserInfo: (state) => {
      for (let pool = 0; pool < state.totalVestings; pool++) {
        state.userInfo.pendingRewards[pool] = 0;
        state.userInfo.proof[pool] = [];
        state.userInfo.volume[pool] = 0;
      }
    },
  },
});

export const selectedPendingAirdropRewards = (state: RootState) =>
  state.airdrop.userInfo.pendingRewards;

export const selectAirdropVolume = (state: RootState) => {
  return Object.keys(state.airdrop.userInfo.volume).reduce((net, cur) => {
    return isNaN(state.airdrop.userInfo.volume[+cur])
      ? net
      : [...net, state.airdrop.userInfo.volume[+cur]];
  }, [] as number[]);
};

export const selectVestingIds = (state: RootState) => {
  return Object.keys(state.airdrop.userInfo.volume).reduce((net, cur) => {
    return isNaN(state.airdrop.userInfo.volume[+cur]) ? net : [...net, +cur];
  }, [] as number[]);
};

export const selectAirdropProof = (state: RootState) => {
  return Object.keys(state.airdrop.userInfo.proof).reduce((net, cur) => {
    return state.airdrop.userInfo.proof[+cur].length
      ? [...net, state.airdrop.userInfo.proof[+cur]]
      : net;
  }, [] as string[][]);
};

export const { onAirdropHarvest, resetAirdropUserInfo, updateAirdropUserInfo } =
  airdropSlice.actions;

export default airdropSlice.reducer;

import { TOKENS } from "@/defi/Tokens";
import { Token } from "@/defi/types";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

export type Strategy = {
  asset: Token;
  apy: number;
  tvl: number;
  fees: number;
  type: "picasso" | "strategy";
  address?: string;
  position?: number;
  poolShare?: number;
  earnings?: number;
};

export type StrategyStore = {
  allStratgies: Strategy[];
  activeStrategies: Strategy[];
};

export const initialState: StrategyStore = {
  activeStrategies: [
    {
      asset: TOKENS["avax"],
      apy: 102,
      tvl: 1000,
      fees: 1000,
      type: "strategy",
      address: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
      position: 1000,
      poolShare: 12,
      earnings: 45,
    },
    {
      asset: TOKENS["pica"],
      apy: 102,
      tvl: 1000,
      fees: 1000,
      type: "picasso",
      address: "0xCE2606ff91667Ed9D659D6a92d08b8a7D90799cE",
      position: 1000,
      poolShare: 12,
      earnings: 45,
    },
  ],
  allStratgies: [
    {
      asset: TOKENS["avax"],
      apy: 102,
      tvl: 1000,
      fees: 1000,
      type: "strategy",
      address: "0x2df92a25E405Fc1Db8194D62C70b674E5d95e19b",
    },
    {
      asset: TOKENS["pica"],
      apy: 102,
      tvl: 1000,
      fees: 1000,
      address: "0xCE2606ff91667Ed9D659D6a92d08b8a7D90799cE",
      type: "picasso",
    },
  ],
};

export const strategySlice = createSlice({
  name: "strategies",
  initialState,
  reducers: {},
});

export const selectStrategies = (state: RootState) => state.strategies;
export default strategySlice.reducer;

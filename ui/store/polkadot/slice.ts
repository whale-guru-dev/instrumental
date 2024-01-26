import { TOKENS } from "@/defi/Tokens";
import { Token } from "@/defi/types";
import { liquidityPoolsData } from "@/constants/liquidity";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "store";

export type Account = {
  label: string;
  value: string;
};

export type Asset = {
  token: Token;
  price: number;
  balance: number;
  value: number;
  change_24hr: number;
};

export type LiquidityPoolRow = {
  token1: Token;
  token2: Token;
  tvl: number;
  apr: number;
  rewardsLeft: Array<{
    value: number;
    token: Token;
  }>;
  volume: number;
};

export type PolkaDotStore = {
  connected: boolean;
  connecting: boolean;
  accountName: string;
  accounts: Account[];
  assets: Asset[];
  selectedAccount: Account | null;
  allLiquidityPools: LiquidityPoolRow[];
  yourLiquidityPools: LiquidityPoolRow[];
};

const initialState: PolkaDotStore = {
  connected: false,
  connecting: false,
  accountName: "",
  selectedAccount: null,
  accounts: [
    {
      label: "0xbrainjar",
      value: "0.0",
    },
    {
      label: "Marmite Toast",
      value: "0.0",
    },
  ],
  assets: [
    {
      token: TOKENS["pica"],
      price: 1.43,
      balance: 4534,
      value: 46187,
      change_24hr: 0.34,
    },
    {
      token: TOKENS["ksm"],
      price: 189,
      balance: 42,
      value: 984.98,
      change_24hr: -0.12,
    },
  ],
  allLiquidityPools: [],
  yourLiquidityPools: [
    {
      token1: TOKENS["pica"],
      token2: TOKENS["ksm"],
      tvl: 1500000,
      apr: 5.75,
      rewardsLeft: [
        {
          token: TOKENS["pica"],
          value: 5000,
        },
        {
          token: TOKENS["ksm"],
          value: 5200,
        },
      ],
      volume: 132500000,
    },
    {
      token1: TOKENS["pica"],
      token2: TOKENS["ksm"],
      tvl: 1500000,
      apr: 5.75,
      rewardsLeft: [
        {
          token: TOKENS["pica"],
          value: 3340,
        },
        {
          token: TOKENS["ksm"],
          value: 3453.49,
        },
      ],
      volume: 132500000,
    },
  ],
};

export const polkadotSlice = createSlice({
  name: "polkadot",
  initialState,
  reducers: {
    connectPolkaDotWallet: (state) => {
      state.connecting = true;
      state.accountName = "[account name]";
    },
    disconnectPolkaDotWallet: (state) => {
      state.connected = false;
      state.accountName = "";
    },
    resetPolkadot: (state) => {
      state.connecting = false;
      state.accountName = "";
      state.connected = false;
    },
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
      state.connecting = false;
      state.connected = true;
      state.accountName = action.payload.label;
    },
    addNextDataLiquidityPools: (state, action) => {
      state.allLiquidityPools = [
        ...state.allLiquidityPools,
        ...liquidityPoolsData.slice(
          action.payload.startIndex,
          action.payload.startIndex + 4,
        ),
      ];
    },
  },
});

export const {
  addNextDataLiquidityPools,
  connectPolkaDotWallet,
  disconnectPolkaDotWallet,
  resetPolkadot,
  setSelectedAccount,
} = polkadotSlice.actions;

export const selectPolkaDotWallet = (state: RootState) =>
  state.polkadot.connected;

export default polkadotSlice.reducer;

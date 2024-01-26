import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenId } from "defi/tokenInfo";
import { RootState } from "..";
import { tokenIdsArray } from "defi/tokenInfo";
import { ContractAddresses } from "defi/addresses";

export type UserDataToken = {
  balance: string;
  price: number;
  hasAllowances: ContractAddresses[];
};
export type UserDataTokens = { [tokenId: string]: UserDataToken };

const defaultTokensValue = () => {
  let a: UserDataTokens = {};
  for (let i = 0; i < tokenIdsArray.length; i++) {
    const tokenId = tokenIdsArray[i];
    a[tokenId] = {
      balance: "0",
      price: 0,
      hasAllowances: [],
    };
  }
  return a as UserDataTokens;
};

export interface UserData {
  tokens: UserDataTokens;
}

const initialState: UserData = { tokens: defaultTokensValue() };

export const userdataSlice = createSlice({
  name: "userdata",
  initialState,
  reducers: {
    updateBalance: (
      state,
      action: PayloadAction<{ tokenId: TokenId; balance: string }>,
    ) => {
      const { tokenId, balance } = action.payload;
      state.tokens[tokenId].balance = balance;
    },
    hasAllowance: (
      state,
      action: PayloadAction<{ tokenId: TokenId; address: ContractAddresses }>,
    ) => {
      const { tokenId, address } = action.payload;
      state.tokens[tokenId].hasAllowances = state.tokens[
        tokenId
      ].hasAllowances.filter((x) => x !== address);
      state.tokens[tokenId].hasAllowances.push(address);
    },
    updatePrice: (
      state,
      action: PayloadAction<{ tokenId: TokenId; price: number }>,
    ) => {
      const { tokenId, price } = action.payload;
      state.tokens[tokenId].price = price;
    },
    resetBalances: (state) => {
      for (const key of Object.keys(state.tokens)) {
        state.tokens[key].balance = "0";
        state.tokens[key].hasAllowances = [];
      }
    },
  },
});

export const { updateBalance, resetBalances, updatePrice, hasAllowance } =
  userdataSlice.actions;

export const selectAllTokens = (state: RootState) => state.userdata.tokens;

export default userdataSlice.reducer;

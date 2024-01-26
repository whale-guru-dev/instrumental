import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import userdata from "./userdata/slice";
import blockchainReducer from "./blockchain/slice";
import transactionReducer from "./tranasctions/slice";
import notificationsReducer from "./notifications/slice";
import appsettingsReducer from "./appsettings/slice";
import liquidityMiningReducer from "./liquidityMining/slice";
import veSTRMReducer from "./veSTRM/slice";
import airdropPoolSlice from "./airdrop/slice";
import strategiesReducer from "./strategies/slice";
import polkadotReducer from "./polkadot/slice";
import transactionSettingsReducer from "./transactionSettingsOptions/slice";
import supportedTokens from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { save, load } from "redux-localstorage-simple";

const PERSISTED_KEYS: string[] = [
  "transactions",
  "relayertransfers",
  "transactionSettingsOptions",
  "supportedTokens",
];

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    userdata: userdata,
    blockchain: blockchainReducer,
    appsettings: appsettingsReducer,
    notifications: notificationsReducer,
    liquidityMiningPool: liquidityMiningReducer,
    airdrop: airdropPoolSlice,
    veSTRM: veSTRMReducer,
    polkadot: polkadotReducer,
    strategies: strategiesReducer,
    supportedTokens,
    transactionSettingsOptions: transactionSettingsReducer,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: true }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

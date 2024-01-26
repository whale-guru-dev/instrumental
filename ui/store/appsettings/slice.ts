import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

export interface AppSettings {
  isOpenConfirmationModal: boolean;
  isOpenWalletConnectModal: boolean;
  isPolkadotWalletOpen: boolean;
  isOpenAirdropModal: boolean;
  isOpenTxSettingsModal: boolean;
  isOpenTxConfirmationModal: boolean;
  triedEeager: boolean;
  isTransactionSubmitted: boolean;
}

const initialState: AppSettings = {
  isOpenConfirmationModal: false,
  isOpenWalletConnectModal: false,
  isPolkadotWalletOpen: false,
  isOpenAirdropModal: false,
  isOpenTxSettingsModal: false,
  isOpenTxConfirmationModal: false,
  triedEeager: false,
  isTransactionSubmitted: false,
};

export const appettingsSlice = createSlice({
  name: "appsettings",
  initialState,
  reducers: {
    openConfirmationModal: (state) => {
      state.isOpenConfirmationModal = true;
    },
    closeConfirmationModal: (state) => {
      state.isOpenConfirmationModal = false;
    },
    openWalletConnectModal: (state) => {
      state.isOpenWalletConnectModal = true;
    },
    openPolkadotWalletModal: (state) => {
      state.isPolkadotWalletOpen = true;
    },
    closePolkadotWalletModal: (state) => {
      state.isPolkadotWalletOpen = false;
    },
    closeWalletConnectModal: (state) => {
      state.isOpenWalletConnectModal = false;
    },
    triedEagerConnect: (state) => {
      state.triedEeager = true;
    },
    openAirdropModal: (state) => {
      state.isOpenAirdropModal = true;
    },
    closeAirdropModal: (state) => {
      state.isOpenAirdropModal = false;
    },
    openTxSettingsModal: (state) => {
      state.isOpenTxSettingsModal = true;
    },
    closeTxSettingsModal: (state) => {
      state.isOpenTxSettingsModal = false;
    },
    openTxConfirmationModal: (state) => {
      state.isOpenTxConfirmationModal = true;
    },
    closeTxConfirmationModal: (state) => {
      state.isOpenTxConfirmationModal = false;
    },
  },
});

export const selectIsOpenConfirmation = (state: RootState) =>
  state.appsettings.isOpenConfirmationModal;
export const selectIsOpenWalletConnect = (state: RootState) =>
  state.appsettings.isOpenWalletConnectModal;
export const selectIsPolkadotWalletOpen = (state: RootState) =>
  state.appsettings.isPolkadotWalletOpen;
export const selectHasTriedEeager = (state: RootState) =>
  state.appsettings.triedEeager;
export const selectIsOpenAirdropModal = (state: RootState) =>
  state.appsettings.isOpenAirdropModal;
export const selectIsOpenTxSettingsModal = (state: RootState) =>
  state.appsettings.isOpenTxSettingsModal;
export const selectIsOpenTxConfirmationModal = (state: RootState) =>
  state.appsettings.isOpenTxConfirmationModal;

export const {
  openConfirmationModal,
  closeConfirmationModal,
  openWalletConnectModal,
  openPolkadotWalletModal,
  closePolkadotWalletModal,
  closeWalletConnectModal,
  openAirdropModal,
  closeAirdropModal,
  openTxSettingsModal,
  closeTxSettingsModal,
  openTxConfirmationModal,
  closeTxConfirmationModal,
  triedEagerConnect,
} = appettingsSlice.actions;

export default appettingsSlice.reducer;

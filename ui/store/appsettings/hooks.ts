import { useAppDispatch, useAppSelector } from "store";
import {
  closeConfirmationModal,
  closeWalletConnectModal,
  openConfirmationModal,
  openWalletConnectModal,
  selectIsOpenConfirmation,
  selectIsOpenWalletConnect,
  openAirdropModal,
  closeAirdropModal,
  selectIsOpenAirdropModal,
  selectIsOpenTxSettingsModal,
  closeTxSettingsModal,
  openTxSettingsModal,
  selectIsOpenTxConfirmationModal,
  closeTxConfirmationModal,
  openTxConfirmationModal,
} from "./slice";

export function useConfimationModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpenConfirmation);
  const closeConfirmation = () => dispatch(closeConfirmationModal());
  const openConfirmation = () => dispatch(openConfirmationModal());

  return { isOpen, closeConfirmation, openConfirmation };
}

export function useWalletConnectModalModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpenWalletConnect);
  const closeWalletConnect = () => dispatch(closeWalletConnectModal());
  const openWalletConnect = () => dispatch(openWalletConnectModal());

  return { isOpen, closeWalletConnect, openWalletConnect };
}

export function useAirdropModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpenAirdropModal);
  const closeAirdrop = () => dispatch(closeAirdropModal());
  const openAirdrop = () => dispatch(openAirdropModal());
  return {
    isOpen,
    closeAirdrop,
    openAirdrop,
  };
}

export function useTxSettingsModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpenTxSettingsModal);
  const closeTxSettings = () => dispatch(closeTxSettingsModal());
  const openTxSettings = () => dispatch(openTxSettingsModal());
  return { isOpen, closeTxSettings, openTxSettings };
}

export function useTxConfirmationModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpenTxConfirmationModal);
  const closeTxConfirmation = () => dispatch(closeTxConfirmationModal());
  const openTxConfirmation = () => dispatch(openTxConfirmationModal());
  return { isOpen, closeTxConfirmation, openTxConfirmation };
}

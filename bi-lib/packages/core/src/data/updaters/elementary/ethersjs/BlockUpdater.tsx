import { useCallback, useEffect } from "react";

import { useBlockchainProvider } from "../../../../hooks";
import { BlockNumberSaveFunction } from "../../../../utils/types"
import { UpdaterType } from "..";

export interface BlockUpdaterProps {
  chainId: number;
  saveBlockNumber: BlockNumberSaveFunction;
  selectedUpdaterType: UpdaterType;
}

export const BlockUpdater = (props: BlockUpdaterProps) => {
  const {
    chainId,
    saveBlockNumber,
    selectedUpdaterType,
  } = props;

  const { provider } = useBlockchainProvider(chainId);

  const addListener = useCallback(
    () => {
      provider?.on(
        "block",
        (blockNumber: number) => saveBlockNumber(
          chainId,
          blockNumber
        )
      );
    },
    [chainId, provider, saveBlockNumber]
  )

  const removeListener = useCallback(
    () => {
      provider?.removeAllListeners("block");
    },
    [provider]
  )

  useEffect(
    () => {
      removeListener();

      if (selectedUpdaterType === 'ethersjs') {
        addListener();
      }
    },
    [addListener, removeListener, selectedUpdaterType]
  );

  return null;
}
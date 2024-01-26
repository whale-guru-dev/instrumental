import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "store/index";
import useIsWindowVisible from "hooks/useWindowIsVisible";
import useDebounce from "hooks/useDebounce";

import { SupportedNetworks } from "defi/types";
import { getNetworkRpcUrl } from "defi";
import { ethers } from "ethers";
import { updateBlockNumber } from "./slice";

export default function Updater({
  chainId,
}: {
  chainId: SupportedNetworks;
}): null {
  const dispatch = useAppDispatch();

  const windowVisible = useIsWindowVisible();

  const [state, setState] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
    blockTimestamp: number | null;
  }>({
    chainId,
    blockNumber: null,
    blockTimestamp: null,
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (
            typeof state.blockNumber !== "number" ||
            typeof state.blockTimestamp !== "number"
          )
            return {
              chainId,
              blockNumber,
              blockTimestamp: new Date().getTime(),
            };
          return {
            chainId,
            blockNumber: Math.max(blockNumber, state.blockNumber),
            blockTimestamp: new Date().getTime(),
          };
        }
        return state;
      });
    },
    [chainId, setState],
  );

  // attach/detach listeners
  useEffect(() => {
    const rpcUrl = getNetworkRpcUrl(chainId);
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, chainId);

    if (!provider || !chainId || !windowVisible) return undefined;

    setState({ chainId, blockNumber: null, blockTimestamp: null });

    provider
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) =>
        console.error(
          `Failed to get block number for chainId: ${chainId}`,
          error,
        ),
      );

    provider.on("block", blockNumberCallback);
    return () => {
      provider.removeListener("block", blockNumberCallback);
    };
  }, [dispatch, chainId, blockNumberCallback, windowVisible]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (
      !debouncedState.after.chainId ||
      !debouncedState.after.blockNumber ||
      !windowVisible ||
      !debouncedState.after.blockTimestamp
    )
      return;
    dispatch(
      updateBlockNumber({
        chainId: debouncedState.after.chainId,
        blockNumber: debouncedState.after.blockNumber,
        blockTimestamp: debouncedState.after.blockTimestamp,
      }),
    );
  }, [
    windowVisible,
    dispatch,
    debouncedState.after.blockNumber,
    debouncedState.after.chainId,
  ]);

  return null;
}

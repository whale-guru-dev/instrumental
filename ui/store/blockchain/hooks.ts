import { ContractsContext } from "@/defi/ContractsContext";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

export function useBlockNumber() {
  const { chainId } = useContext(ContractsContext);
  const blockInfo = useSelector(
    (state: RootState) => state.blockchain.blockNumber[chainId ?? 1],
  );

  if (!blockInfo) {
    return {};
  }
  return {
    blockNumber: blockInfo.blockNumber,
    blockTimestamp: blockInfo.blockTimestamp,
  };
}

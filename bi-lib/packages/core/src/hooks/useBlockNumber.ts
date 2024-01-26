import { useContext } from "react";

import { BlockchainDataContext } from "../data";

export interface BlockNumberResult {
  blockNumber: number | undefined;
  isLoading: boolean;
}

export const useBlockNumber = (chainId: number | undefined) : BlockNumberResult => {
  const {
    blockNumbers,
    requestBlockNumber,
  } = useContext(BlockchainDataContext);

  const isRequested = requestBlockNumber(chainId);

  const blockNumber = chainId !== undefined && blockNumbers[chainId] || undefined;
  const isLoading = isRequested && blockNumber === undefined;

  return {
    blockNumber,
    isLoading,
  }
};
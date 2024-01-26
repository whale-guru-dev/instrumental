import { gql, useQuery } from "@apollo/client";

import { QueryNetworkChainId } from "../../../../utils/constants";
import { BLOCK_NUMBER } from "../../../../utils/queries";
import { BlockNumberSaveFunction } from "../../../../utils/types"

export interface BlockUpdaterProps {
  chainId: number;
  saveBlockNumber: BlockNumberSaveFunction;
}

export const BlockUpdater = (props: BlockUpdaterProps) => {
  const {
    chainId,
    saveBlockNumber
  } = props;

  const {
    loading,
    error,
    data,
  } = useQuery(gql(BLOCK_NUMBER(chainId as QueryNetworkChainId)));

  if (!loading && !error && data) {
    const blockNumber = data.ethereum.blocks.count;
    saveBlockNumber(
      chainId,
      blockNumber
    );
  }

  return null;
}
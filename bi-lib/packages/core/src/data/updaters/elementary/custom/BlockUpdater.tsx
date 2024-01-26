import { BlockNumberSaveFunction, BlockUpdaterFunction } from "../../../../utils/types"

export interface BlockUpdaterProps {
  chainId: number;
  saveBlockNumber: BlockNumberSaveFunction;
  updater: BlockUpdaterFunction | undefined;
}

export const BlockUpdater = (props: BlockUpdaterProps) => {
  const {
    chainId,
    saveBlockNumber,
    updater,
  } = props;

  const blockNumber = updater !== undefined ? updater(chainId) : 0;
  saveBlockNumber(
    chainId,
    blockNumber
  )

  return null;
}
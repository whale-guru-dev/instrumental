import React, { useCallback } from "react";

import { useFrequencyUpdater } from "../../../hooks/useFrequencyUpdater";
import { BlockUpdaterFunction } from "../../../utils/types";
import { BitqueryBlockUpdater, CustomBlockUpdater, EthersjsBlockUpdater, UpdaterType } from "../elementary";

export type BlockNumbers = {
  [chainId: number]: number | undefined;
}

export interface BlockNumberUpdaterProps {
  type: UpdaterType;
  updater?: BlockUpdaterFunction;
  frequency?: number;
  chains: Array<number>;
  setBlockNumbers: React.Dispatch<React.SetStateAction<BlockNumbers>>;
}

export const BlockNumberUpdater = (props: BlockNumberUpdaterProps) => {
  const {
    type,
    chains,
    setBlockNumbers,
    updater,
    frequency
  } = props;

  const rerenderSwitch = useFrequencyUpdater(frequency);
  console.log(
    'BI-LIB - Rerendering block number updater',
    rerenderSwitch
  );

  const updateBlockNumber = useCallback(
    (
      chainId: number | undefined, blockNumber: number | undefined
    ) => chainId !== undefined && blockNumber !== undefined && setBlockNumbers(blockNumbers => ({
      ...blockNumbers,
      [chainId]: blockNumber,
    })),
    [setBlockNumbers]
  )

  return (
    <React.Fragment>
      {chains.map((chainId: number) =>
        <EthersjsBlockUpdater
          chainId={chainId}
          saveBlockNumber={updateBlockNumber}
          selectedUpdaterType={type}
        />)}

      {type === 'bitquery' && chains.map((chainId: number) =>
        <BitqueryBlockUpdater
          chainId={chainId}
          saveBlockNumber={updateBlockNumber}
        />)}

      {type === 'custom' && chains.map((chainId: number) =>
        <CustomBlockUpdater
          chainId={chainId}
          saveBlockNumber={updateBlockNumber}
          updater={updater}
        />)
      }
    </React.Fragment>
  )
}
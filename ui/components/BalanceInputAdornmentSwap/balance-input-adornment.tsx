import React from "react";
import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import BigNumber from "bignumber.js";

export interface BalanceInputAdornmentSwapProps {
  token: Token | undefined;
  balance: BigNumber | undefined;
  maxDecimals: number | undefined;
}

export const BalanceInputAdornmentSwap: React.FC<
  BalanceInputAdornmentSwapProps
> = ({ token, balance, maxDecimals = 2 }): JSX.Element => {
  return (
    <>
      {token
        ? `${balance ? balance.toFormat(maxDecimals) : 0} ${token?.symbol}`
        : "-"}
    </>
  );
};

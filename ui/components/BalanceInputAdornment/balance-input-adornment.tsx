import React from "react";
import { TokenInfo } from "@/defi/reducers/tokensReducer";
import BigNumber from "bignumber.js";

export interface BalanceInputAdornmentProps {
  token: TokenInfo;
  balance: BigNumber;
  maxDecimals: number;
}

export const BalanceInputAdornment: React.FC<BalanceInputAdornmentProps> = ({
  token,
  balance,
  maxDecimals = 2,
}): JSX.Element => {
  return <>{`${balance.toFormat(maxDecimals)} ${token.symbol}`}</>;
};

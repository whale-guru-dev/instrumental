import { BigNumber } from "bignumber.js"

/**
 * Convert 10.999 to 10999000
 */
export const toBaseUnitBN = (
  rawAmt: string | number, decimals: number
) => {
  const raw = new BigNumber(rawAmt);
  const base = new BigNumber(10);
  const decimalsBN = new BigNumber(decimals);
  return raw.times(base.pow(decimalsBN)).integerValue();
};

/**
 * Convert 10999000 to 10.999
 */
export const toTokenUnitsBN = (
  tokenAmount: string | number,
  tokenDecimals: number
) => {
  const amt = new BigNumber(tokenAmount);
  const digits = new BigNumber(10).pow(new BigNumber(tokenDecimals));
  return amt.div(digits);
};
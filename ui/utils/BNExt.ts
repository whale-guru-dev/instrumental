import { BigNumber as EthersBN } from "ethers";
import { BigNumber as BN } from "bignumber.js";

export class BNExt {
  private num: BN;
  private decimals: number;

  constructor(
    input: string | number | BN | EthersBN | undefined,
    decimals?: number,
    notRaw?: boolean,
  ) {
    if (!input) {
      this.num = new BN(0);
    } else {
      if (["string", "number"].includes(typeof input) || input instanceof BN) {
        this.num = notRaw
          ? new BN(input as BN)
          : toTokenUnitsBN(input.toString(), decimals ?? 0);
      } else {
        input = input as EthersBN;
        this.num = notRaw
          ? new BN(input.toString())
          : toTokenUnitsBN(input.toString(), decimals ?? 0);
      }
    }
    this.decimals = decimals ?? 0;
  }

  raw() {
    return toBaseUnitBN(this.num, this.decimals);
  }

  get() {
    return this.num;
  }

  toString() {
    return this.num.toString();
  }

  toFixed() {
    return this.num.toFixed(this.decimals);
  }
}

/**
 * Convert 10.999 to 10999000
 */
const toBaseUnitBN = (rawAmt: string | number | BN, decimals: number) => {
  const raw = new BN(rawAmt);
  const base = new BN(10);
  const decimalsBN = new BN(decimals);
  return raw.times(base.pow(decimalsBN)).integerValue();
};

/**
 * Convert 10999000 to 10.999
 */
const toTokenUnitsBN = (
  tokenAmount: string | number | BN,
  tokenDecimals: number,
) => {
  const amt = new BN(tokenAmount);
  const digits = new BN(10).pow(new BN(tokenDecimals));
  return amt.div(digits);
};

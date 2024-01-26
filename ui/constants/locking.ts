import BigNumber from "bignumber.js";

const LOCK_CONTRACT_PERIODS = [
  {
    start: 1639410062 * 1000,
    end: 1640023200 * 1000,
    days: 7,
    reward: 3250000,
  },
  {
    start: 1640023200 * 1000,
    end: 1640628000 * 1000,
    days: 7,
    reward: 1500000,
  },
  {
    start: 1640628000 * 1000,
    end: 1641837600 * 1000,
    days: 14,
    reward: 250000,
  },
];

export type LockPeriods = 4 | 12 | 25 | 51 | 102;

export const LOCK_AIRDROP_APY_WEIGHTS = {
  4: 0.08333,
  12: 0.25,
  25: 0.75,
  51: 0.95,
  102: 1.25,
};

export const LOCK_PERIODS_TO_MONTHS = {
  4: 1,
  12: 3,
  25: 6,
  51: 12,
  102: 24,
};

export const LOCK_PERIODS_TO_DAYS = {
  4: 28,
  12: 91,
  25: 182,
  51: 364,
  102: 728,
};

export const getCurrentLockStrmPeriod = () => {
  const currentDate = new Date();

  return LOCK_CONTRACT_PERIODS.find(
    (x) => new Date(x.start) <= currentDate && currentDate <= new Date(x.end),
  );
};

export const getCurrentLockStrmApyPercentage = (
  tvl: number,
  toString?: boolean,
) => {
  const period = getCurrentLockStrmPeriod();
  if (!period) return 0;
  const apy = (((period.reward / period.days) * 365) / tvl) * 100;

  const a = apy > 10000 ? 10000 : apy;

  if (toString) {
    return (a === 10000 ? ">" : "") + new BigNumber(a).toFormat(0) + "%";
  } else {
    return a;
  }
};

export const getCurrentLockStrmApyPercentageForPeriod = (
  tvl: number,
  period: LockPeriods,
  toString?: boolean,
) => {
  if (tvl === 0) {
    tvl = 1;
  }
  const periodTmp = getCurrentLockStrmPeriod();

  if (!periodTmp) return 0;

  const apy = (((periodTmp.reward / periodTmp.days) * 365) / tvl) * 100;

  const a = apy > 10000 ? 10000 : apy;

  if (toString) {
    return (
      (a === 10000 ? ">" : "") +
      new BigNumber(a * LOCK_AIRDROP_APY_WEIGHTS[period]).toFormat(0) +
      "%"
    );
  } else {
    return a;
  }
};

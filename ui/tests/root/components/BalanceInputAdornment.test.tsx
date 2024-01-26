import { screen, render } from "tests/utils/base";

import BalanceInputAdornment from "@/components/BalanceInputAdornment";
import { BigNumber } from "bignumber.js";

describe("BalanceInputAdornment", () => {
  it("Should mount", () => {
    render(
      <BalanceInputAdornment
        token={{ symbol: "ETH" }}
        balance={new BigNumber(2)}
      />,
    );

    screen.getByText("2.00 ETH");
  });

  it("Should render upto 2 decimals", () => {
    render(
      <BalanceInputAdornment
        token={{ symbol: "ETH" }}
        balance={new BigNumber(0.012345678901234567)}
      />,
    );

    screen.getByText("0.01 ETH");
  });
});

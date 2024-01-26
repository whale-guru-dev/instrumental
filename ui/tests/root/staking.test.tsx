import Staking from "@/pages/index";
import axios from "axios";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import React from "react";
import { AppWrapper, render, screen } from "tests/utils/base";
import { createMockRouter } from "tests/utils/createMockRouter";

describe("Loads the homepage", () => {
  let router: NextRouter;
  beforeEach(() => {
    router = createMockRouter({});
    jest.resetModules();
    const coinGeckoResponseMock = { data: { coinGeckoId: { usd: 1 } } };
    (axios as jest.Mocked<typeof axios>).get.mockReturnValue(
      new Promise((resolve) => resolve(coinGeckoResponseMock)),
    );

    render(
      <AppWrapper>
        <RouterContext.Provider value={router}>
          <Staking />
        </RouterContext.Provider>
      </AppWrapper>,
    );
  });

  it("successfully loads", () => {
    expect(screen.getByText("3 month liquidity program")).toBeTruthy();
  });
});

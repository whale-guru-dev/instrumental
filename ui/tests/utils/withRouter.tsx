import React from "react";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

export const useMockedRouter =
  (router: NextRouter) =>
  (ui: React.ReactElement): React.ReactElement => {
    return <RouterContext.Provider value={router}>{ui}</RouterContext.Provider>;
  };

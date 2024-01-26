import { createClient } from "@urql/core";

export const gqlClient = createClient({
  url: process.env.APY_VESTING_SUBGRAPH_URL!,
});

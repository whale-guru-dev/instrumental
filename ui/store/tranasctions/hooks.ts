// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
import { SupportedNetworks } from "defi/types";

import { useSelector } from "react-redux";
import { RootState } from "store";

export function useTransactions() {
  // const {chainId, account} = useWeb3React();
  const { chainId, account } = useConnector("metamask");

  const t = useSelector((state: RootState) => state.transactions);

  const exists =
    account &&
    (chainId as SupportedNetworks) in t &&
    account in t[chainId as SupportedNetworks];

  return useSelector((state: RootState) =>
    exists ? state.transactions[chainId ?? -1][account ?? ""] : {},
  );
}

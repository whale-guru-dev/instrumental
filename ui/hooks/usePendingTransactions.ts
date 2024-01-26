// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
// import { ethers } from "ethers";
import { useMemo } from "react";
import { useAppSelector } from "store";
import { selectAllTransactions } from "store/tranasctions/slice";

export const usePendingTransactions = (
  contractAddress: string,
  functionNames: string | string[],
): boolean => {
  // const { account, library, chainId } =
  //   useWeb3React<ethers.providers.Web3Provider>();
  const { account, chainId } = useConnector("metamask");

  const txs = useAppSelector(selectAllTransactions);

  const isOngoingTx = () => {
    if (
      !contractAddress ||
      !chainId ||
      !account ||
      !(chainId in txs) ||
      !(account in txs[chainId])
    ) {
      return false;
    }

    return Object.values(txs[chainId][account]).some(
      (x) =>
        x.contractAddress.toLowerCase() === contractAddress.toLowerCase() &&
        (Array.isArray(functionNames)
          ? functionNames.includes(x.functionName)
          : x.functionName === functionNames) &&
        x.status === "pending",
    );
  };

  return useMemo(() => {
    return isOngoingTx();
  }, [txs, contractAddress, functionNames, account, chainId]);
};

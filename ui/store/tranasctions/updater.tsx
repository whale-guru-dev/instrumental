import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/index";
// import { isValidNetwork } from "defi";
import { ContractsContext } from "defi/ContractsContext";
import { useBlockNumber } from "store/blockchain/hooks";
import { useAddresses, useNetworkUrl } from "defi/hooks";
import { addNotification } from "store/notifications/slice";
import {
  completeTransaction,
  errorTransaction,
  selectAllTransactions,
  Transaction,
} from "./slice";
// import { useWeb3React } from "@web3-react/core";
import { useBlockchainProvider } from "@integrations-lib/core";
// import { ethers } from "ethers";

const shouldCheck = (lastBlockNumber: number, tx: Transaction): boolean => {
  if (tx.status !== "pending") return false;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckBlock;
  if (blocksSinceCheck < 1) return false;
  const minutesPending =
    (new Date().getTime() - tx.createdTimestamp) / 1000 / 60;
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9;
  }
  if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2;
  }
  // otherwise every block
  return true;
};

export default function Updater(): null {
  // const { library, account } = useWeb3React<ethers.providers.Web3Provider>();
  const { chainId, contracts, account } = useContext(ContractsContext);
  const { provider: library } = useBlockchainProvider(chainId ?? 0);
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectAllTransactions);
  const currentBlock = useBlockNumber().blockNumber;
  const addresses = useAddresses();
  const urlBase = useNetworkUrl();
  const { isSupported } = useBlockchainProvider(chainId as number);

  useEffect(() => {
    if (
      chainId === undefined ||
      !isSupported ||
      !library ||
      !account ||
      !chainId ||
      !currentBlock
    ) {
      return undefined;
    }

    if (chainId in transactions && account in transactions[chainId]) {
      for (const [txHash, tx] of Object.entries(
        transactions[chainId][account],
      )) {
        if (shouldCheck(currentBlock ?? Number.MAX_SAFE_INTEGER, tx)) {
          library
            .getTransactionReceipt(txHash)
            .then((receipt) => {
              if (receipt) {
                if (tx.toUpdate && contracts) {
                  for (let i = 0; i < tx.toUpdate.length; i++) {
                    const updateCall = tx.toUpdate[i];

                    // TODO fix
                    // @ts-ignore
                    const c = contracts[updateCall.contractType].update({
                      address: updateCall.contract
                        ? addresses[updateCall.contract]
                        : tx.contractAddress,
                    }) as {
                      [k: string]: (a?: any) => any;
                    };

                    if (updateCall.data) {
                      c[updateCall.functionName](...updateCall.data);
                    } else {
                      c[updateCall.functionName]();
                    }
                    //[updateCall.functionName](updateCall.data ? (...(updateCall.data)) : undefined)
                  }
                }

                if (contracts) {
                  contracts.raw.update();
                }

                if (receipt.status === 1) {
                  dispatch(
                    completeTransaction({
                      txHash,
                      chainId,
                      address: account,
                      minedBlock:
                        receipt !== null ? receipt.blockNumber : currentBlock, // temporary ethers.js bugfix when receipt is null
                    }),
                  );

                  dispatch(
                    addNotification({
                      message: `[${tx.label}] completed.`,
                      type: "success",
                      url: urlBase + txHash,
                      timeout: 7000,
                      button:
                        tx.functionName.toLowerCase() === "deposit" ||
                        tx.functionName.toLowerCase() === "withdraw"
                          ? { label: "To Portfolio", path: "/portfolio" }
                          : undefined,
                    }),
                  );
                } else {
                  dispatch(
                    errorTransaction({
                      txHash,
                      chainId,
                      address: account,
                    }),
                  );

                  dispatch(
                    addNotification({
                      message: `[${tx.label}] failed. Please try again.`,
                      type: "error",
                      url: urlBase + txHash,
                      timeout: 7000,
                    }),
                  );
                }
              }
            })
            .catch((e) => {
              console.error(e);
              dispatch(errorTransaction({ txHash, chainId, address: account }));
            });
        }
      }
    }

    return () => {};
  }, [chainId, library, account, chainId, currentBlock]);

  return null;
}

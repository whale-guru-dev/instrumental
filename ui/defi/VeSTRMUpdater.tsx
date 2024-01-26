// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
import { ethers } from "ethers";
import { useContext, useEffect } from "react";

import { isValidNetwork } from ".";
import { useAppDispatch } from "@/store";
import { veSTRMreset } from "@/store/veSTRM/slice";
import { ContractsContext } from "./ContractsContext";
import { VeSTRMService } from "./contracts/veSTRMService";
import { ADDRESSES } from "./addresses";
import { NETWORKS } from "./networks";

export const VeSTRMUpdater = () => {
  const appDispatch = useAppDispatch();
  // const { account } = useWeb3React<ethers.providers.Web3Provider>();
  const { account } = useConnector("metamask");
  const { contracts, chainId, library } = useContext(ContractsContext);

  useEffect(() => {
    if (!isValidNetwork(chainId)) {
      appDispatch(veSTRMreset());
    }
  }, [chainId]);

  useEffect(() => {
    if (!account) {
      appDispatch(veSTRMreset());
    }
  }, [account]);

  useEffect(() => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      NETWORKS[1].rpcUrl,
      1,
    );

    const veStrm = new VeSTRMService(
      ADDRESSES.veSTRM[1],
      provider as any,
      "",
      appDispatch,
    );

    veStrm.getTotalSupply();
  }, []);

  useEffect(() => {
    if (account && contracts) {
      const { votingEscrow } = contracts;
      votingEscrow.balanceOf(account);
      votingEscrow.locked(account);
    }
  }, [account, contracts]);

  useEffect(() => {
    if (library && contracts && account && isValidNetwork(chainId)) {
      const { votingEscrow } = contracts;

      const onBlockNumber = async () => {
        votingEscrow.getTotalSupply();
      };

      library.on("block", onBlockNumber);

      return () => {
        library.removeAllListeners();
      };
    }
    return undefined;
  }, [library, contracts, account, chainId]);

  return null;
};

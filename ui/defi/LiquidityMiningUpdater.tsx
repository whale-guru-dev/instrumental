// import { useWeb3React } from "@web3-react/core";
import { useConnector, useBlockchainProvider } from "@integrations-lib/core";
import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import { useAppDispatch } from "@/store";
import {
  resetLiquidityMiningPoolUserData,
  updateOnHarvest,
} from "@/store/liquidityMining/slice";
import BigNumber from "bignumber.js";

import { toTokenUnitsBN } from "@/utils";
import { isValidNetwork } from ".";
import { tokens } from "./tokenInfo";
import { ContractsContext } from "./ContractsContext";
import { NETWORKS } from "./networks";
import { ADDRESSES } from "./addresses";
import { LiquidityMiningService } from "./contracts/liquidityMiningService";

export const LiquidityMiningUpdater = () => {
  const appDispatch = useAppDispatch();
  // const { library, account } = useWeb3React<ethers.providers.Web3Provider>();
  // const { chainId, contracts } = useContext(ContractsContext);
  const { account } = useConnector("metamask");
  const { chainId, contracts } = useContext(ContractsContext);
  const { provider: library } = useBlockchainProvider(chainId);

  useEffect(() => {
    if (!isValidNetwork(chainId)) {
      appDispatch(resetLiquidityMiningPoolUserData());
    }
  }, [chainId]);

  useEffect(() => {
    if (!account) {
      appDispatch(resetLiquidityMiningPoolUserData());
    }
  }, [account]);

  useEffect(() => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      NETWORKS[1].rpcUrl,
      1,
    );

    const liquidityMining = new LiquidityMiningService(
      ADDRESSES.liquidityMining[1],
      provider as any,
      "",
      appDispatch,
    );

    liquidityMining.getPoolInfo(0);
    liquidityMining.getPoolInfo(1);
  }, []);

  useEffect(() => {
    if (contracts && account) {
      const { liquidityMining } = contracts;
      liquidityMining.userInfo(new BigNumber(0), account);
      liquidityMining.userInfo(new BigNumber(1), account);
    }
  }, [contracts, account]);

  useEffect(() => {
    if (contracts && account) {
      const { liquidityMining } = contracts;
      liquidityMining.pendingInstrumental(new BigNumber(0), account);
      liquidityMining.pendingInstrumental(new BigNumber(1), account);
    }
  }, [contracts, account]);

  useEffect(() => {
    if (library && contracts && account && isValidNetwork(chainId)) {
      const { liquidityMining } = contracts;
      const onBlockNumber = async () => {
        liquidityMining.pendingInstrumental(new BigNumber(0), account);
        liquidityMining.pendingInstrumental(new BigNumber(1), account);

        contracts.liquidityMining.getPoolInfo(0);
        contracts.liquidityMining.getPoolInfo(1);
      };

      library.on("block", onBlockNumber);

      return () => {
        library.removeAllListeners();
      };
    }
    return undefined;
  }, [library, contracts, account, chainId]);

  useEffect(() => {
    if (account && contracts) {
      const { liquidityMining } = contracts;

      const harvestEventCallback = (
        _account: string,
        _poolId: ethers.BigNumber,
        amount: ethers.BigNumber,
      ) => {
        appDispatch(
          updateOnHarvest({
            harvestedAmount: toTokenUnitsBN(
              amount.toString(),
              tokens.eth_strm_lp.decimals,
            ).toNumber(),
            poolId: _poolId.toNumber(),
          }),
        );

        liquidityMining.userInfo(new BigNumber(1), account);
      };

      const harvestFilter = liquidityMining.contract.filters.Harvest(
        account,
        null,
        null,
      );

      liquidityMining.contract.on(harvestFilter, harvestEventCallback);

      const depositEventCallBack = (
        address: string,
        poolId: ethers.BigNumber,
        _amnt: ethers.BigNumber,
        to: string,
      ) => {
        if (address.toLowerCase() === to.toLowerCase()) {
          const poolIdBN = new BigNumber(poolId.toString());
          liquidityMining.userInfo(poolIdBN, address);
        }
      };

      const depositFilter = liquidityMining.contract.filters.Deposit(
        account,
        null,
        null,
        account,
      );

      liquidityMining.contract.on(depositFilter, depositEventCallBack);

      return () => {
        liquidityMining.contract.removeListener(
          harvestFilter,
          harvestEventCallback,
        );
        liquidityMining.contract.removeListener(
          depositFilter,
          depositEventCallBack,
        );
      };
    }
    return undefined;
  }, [contracts, account]);

  return null;
};

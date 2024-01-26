import { useAppDispatch } from "@/store";
import {
  onAirdropHarvest,
  resetAirdropUserInfo,
  updateAirdropUserInfo,
} from "@/store/airdrop/slice";
// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import { isValidNetwork } from ".";
import { ContractsContext } from "./ContractsContext";

import mosaicAidropAddresses from "./constants/mosaic.json";
import bridges from "./constants/bridges.json";
import strategies from "./constants/strategies.json";
import vestrm from "./constants/vestrm.json";
import vestrm_1 from "./constants/vestrm_1.json";
import liquidityMiningRush1Addresses from "./constants/lmRush1.json";

import { merkletree } from "./MerkeTree";
import { solidityKeccak256 } from "ethers/lib/utils";
import BigNumber from "bignumber.js";
import { VestingService } from "./contracts/vestingService";
import { toTokenUnitsBN } from "@/utils";
import { tokens } from "./tokenInfo";

const mosaicLeafs = [
  ...mosaicAidropAddresses.map((a) => ({ account: a, amount: 1 })),
].filter((l) => !!l) as { account: string; amount: number }[];

const mosaicTree = merkletree(mosaicLeafs);

const bridgeLeafs = [
  ...(bridges as string[]).map((a) => ({ account: a, amount: 1 })),
].filter((l) => !!l) as { account: string; amount: number }[];

const bridgeTree = merkletree(bridgeLeafs);

const strategyLeafs = [
  ...Object.keys(strategies).map((a) => ({
    account: a,
    amount: Math.floor(Number((strategies as any)[a])),
  })),
].filter((l) => !!l) as { account: string; amount: number }[];

const strategyTree = merkletree(strategyLeafs);

const veStrmLeafs = [
  ...Object.keys(vestrm).map((a) => ({
    account: a,
    amount: Math.floor(Number((vestrm as any)[a])),
  })),
].filter((l) => !!l) as { account: string; amount: number }[];

const veStrmTree = merkletree(veStrmLeafs);

const lmRush1Leaves = [
  ...Object.keys(liquidityMiningRush1Addresses).map((a) => ({
    account: a,
    amount: Math.floor(Number((liquidityMiningRush1Addresses as any)[a])),
  })),
].filter((l) => !!l) as { account: string; amount: number }[];

const lmRush1Tree = merkletree(lmRush1Leaves);

const veSTRM_1Leaves = [
  ...Object.keys(vestrm_1).map((a) => ({
    account: a,
    amount: (vestrm_1 as any)[a],
  })),
];

const veSTRM_1Tree = merkletree(veSTRM_1Leaves);

type VestingInfo = {
  pendingRewards: BigNumber;
  proof: string[];
  vestingId: number;
  volume: number;
};

export const vestingData = [
  {
    name: "Strategies investor",
    tree: strategyTree,
    leafs: strategyLeafs,
    volume: (account: string) => Math.floor((strategies as any)[account]),
  },
  {
    name: "STRM Claim",
    tree: mosaicTree,
    leafs: mosaicLeafs,
    volume: (_account: string) => 1,
  },
  {
    name: "Bridge master",
    tree: bridgeTree,
    leafs: bridgeLeafs,
    volume: (_account: string) => 1,
  },
  {
    name: "veSTRM locker",
    tree: veStrmTree,
    leafs: veStrmLeafs,
    volume: (account: string) => Math.floor((vestrm as any)[account]),
  },
  {
    name: "Liquidity miner",
    tree: lmRush1Tree,
    leafs: lmRush1Leaves,
    volume: (account: string) =>
      Math.floor(Number((liquidityMiningRush1Addresses as any)[account])),
  },
  {
    name: "veSTRM locker 2",
    tree: veSTRM_1Tree,
    leafs: veSTRM_1Leaves,
    volume: (account: string) => (vestrm_1 as any)[account],
  },
];

const fetchAllVestInfo = async (
  account: string,
  vestingService: VestingService,
) => {
  const vestings: VestingInfo[] = [];

  for (let i = 0; i < vestingData.length; i++) {
    const vestingInfo = vestingData[i];

    try {
      let volume = vestingInfo.volume(account.toLowerCase());

      if (!volume) {
        volume = vestingInfo.volume(account);
      }

      const leaf = Buffer.from(
        solidityKeccak256(["address", "uint256"], [account, volume]).substr(2),
        "hex",
      );
      const proof = vestingInfo.tree.getHexProof(leaf);

      const pendingRewards = await vestingService.pendingInstrumental(
        new BigNumber(i),
        new BigNumber(volume),
        proof,
      );

      vestings.push({ pendingRewards, proof, vestingId: i, volume });
    } catch (e) {
      console.warn(e);
      vestings.push({
        pendingRewards: new BigNumber(0),
        proof: [],
        vestingId: i,
        volume: NaN,
      });
      continue;
    }
  }

  return vestings;
};

export const AirdropUpdater = () => {
  const appDispatch = useAppDispatch();
  // const { account } = useWeb3React<ethers.providers.Web3Provider>();
  const { account } = useConnector("metamask");
  const { chainId, contracts } = useContext(ContractsContext);

  useEffect(() => {
    if (!isValidNetwork(chainId) || !account)
      appDispatch(resetAirdropUserInfo());
  }, [chainId, account]);

  useEffect(() => {
    if (contracts && account) {
      const { vesting } = contracts;

      fetchAllVestInfo(account, vesting).then((vestingArray) => {
        vestingArray.forEach((vesting) => {
          appDispatch(
            updateAirdropUserInfo({
              proof: vesting.proof,
              vestId: vesting.vestingId,
              pendingInstrumental: vesting.pendingRewards.toNumber(),
              volume: vesting.volume,
            }),
          );
        });
      });
    }
  }, [contracts, account]);

  useEffect(() => {
    if (contracts && account) {
      const onClaim = (
        _account: string,
        vestingId: ethers.BigNumber,
        amount: ethers.BigNumber,
      ) => {
        appDispatch(
          onAirdropHarvest({
            vestId: vestingId.toNumber(),
            harvestedAmount: toTokenUnitsBN(
              amount.toString(),
              tokens.strm.decimals,
            ).toNumber(),
          }),
        );
      };

      const { vesting } = contracts;
      const claimEvent = vesting.contract.filters.Claim(account, null, null);

      vesting.contract.on(claimEvent, onClaim);

      return () => {
        vesting.contract.removeListener(claimEvent, onClaim);
      };
    }
    return undefined;
  }, [contracts, account]);

  return null;
};

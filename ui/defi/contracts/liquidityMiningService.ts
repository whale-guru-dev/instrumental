import { Contract, ethers } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import liquidityMiningAbi from "../abi/LiquidityMining.json";
import BigNumber from "bignumber.js";
import { toTokenUnitsBN } from "@/utils";
import {
  initPool,
  updateLMUserInfo,
  updateUserPendingSTRM,
} from "@/store/liquidityMining/slice";
import { tokens } from "../tokenInfo";
import { addNotification } from "@/store/notifications/slice";
import { newTransaction } from "@/store/tranasctions/slice";
import { getNetworkUrl } from "..";

export class LiquidityMiningService {
  contract: Contract;
  dispatch: Dispatch<AnyAction>;
  signerAddress: string;
  chainId: number;

  constructor(
    address: string,
    provider: MulticallProvider,
    signerAddress: string,
    dispatcher: Dispatch<AnyAction>,
    signer?: ethers.Signer,
  ) {
    const contract = new ethers.Contract(address, liquidityMiningAbi, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  async getPoolInfo(index: number): Promise<{
    accInstrumentalPerShare: number;
    lastRewardBlock: number;
    end: number;
    locked: boolean;
    instrumentalPerBlock: number;
    supply: number;
  }> {
    let poolInfoRaw = await this.contract.poolInfo(index);
    let accInstrumentalPerShare = toTokenUnitsBN(
      poolInfoRaw[0].toString(),
      tokens.eth_strm_lp.decimals,
    );
    let instrumentalPerBlock = toTokenUnitsBN(
      poolInfoRaw[4].toString(),
      tokens.eth_strm_lp.decimals,
    );
    let supply = toTokenUnitsBN(
      poolInfoRaw[5].toString(),
      tokens.eth_strm_lp.decimals,
    );
    let poolInfo = {
      accInstrumentalPerShare: accInstrumentalPerShare.toNumber(),
      lastRewardBlock: new BigNumber(+poolInfoRaw[1]).toNumber(),
      end: new BigNumber(+poolInfoRaw[2]).toNumber(),
      locked: poolInfoRaw[3],
      instrumentalPerBlock: instrumentalPerBlock.toNumber(),
      supply: supply.toNumber(),
    };

    this.dispatch(
      initPool({
        data: {
          ...poolInfo,
          poolId: index,
        },
      }),
    );

    return poolInfo;
  }

  async getPoolLength(): Promise<BigNumber> {
    const poolLength = await this.contract.poolLength();
    return new BigNumber(poolLength.toString());
  }

  async getLpTokens(index: number): Promise<string> {
    return await this.contract.lpToken(index);
  }

  async deposit(
    poolId: BigNumber,
    amount: BigNumber,
    depositTo: string,
    label = "Deposit ETH-STRM LP",
  ): Promise<ethers.providers.TransactionResponse> {
    const tx: ethers.providers.TransactionResponse =
      await this.contract.deposit(
        poolId.toFixed(),
        amount.toFixed(),
        depositTo,
      );

    this.dispatch(
      newTransaction({
        txHash: tx.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [],
        label,
        functionName: "deposit",
      }),
    );

    this.dispatch(
      addNotification({
        message: `Transaction [${label}] started.`,
        type: "info",
        url: `${getNetworkUrl(this.chainId)}/${tx.hash}`,
        timeout: 5000,
      }),
    );
    // Dispatch Events here
    return tx;
  }

  async withdrawAndHarvest(
    poolId: BigNumber,
    amount: BigNumber,
    withdrawTo: string,
    label = "Withdraw ETH-STRM LP",
  ): Promise<ethers.providers.TransactionResponse> {
    const tx: ethers.providers.TransactionResponse =
      await this.contract.withdrawAndHarvest(
        poolId.toFixed(),
        amount.toFixed(),
        withdrawTo,
      );

    this.dispatch(
      newTransaction({
        txHash: tx.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [],
        label,
        functionName: this.withdrawAndHarvest.name,
      }),
    );

    this.dispatch(
      addNotification({
        message: `Transaction [${label}] started.`,
        type: "info",
        url: `${getNetworkUrl(this.chainId)}/${tx.hash}`,
        timeout: 5000,
      }),
    );
    // Dispatch Events here
    return tx;
  }

  async pendingInstrumental(
    poolId: BigNumber,
    account: string,
  ): Promise<BigNumber> {
    let pendingInstrumental = await this.contract.pendingInstrumental(
      poolId.toFixed(),
      account,
    );
    pendingInstrumental = toTokenUnitsBN(
      pendingInstrumental.toString(),
      tokens.strm.decimals,
    );

    this.dispatch(
      updateUserPendingSTRM({
        pendingInstrumental: pendingInstrumental.toNumber(),
        poolId: poolId.toNumber(),
      }),
    );

    return pendingInstrumental;
  }

  async harvest(
    poolId: BigNumber,
    to: string,
  ): Promise<ethers.providers.TransactionResponse> {
    const harvestTx = await this.contract.harvest(poolId.toFixed(), to);
    return harvestTx;
  }

  getContractAddress(): string {
    return this.contract.address;
  }

  async userInfo(
    poolId: BigNumber,
    account: string,
  ): Promise<{
    locked: string;
    rewardDebt: string;
  }> {
    let userInfo = await this.contract.userInfo(poolId.toFixed(), account);

    userInfo = {
      locked: toTokenUnitsBN(
        userInfo[0].toString(),
        tokens.eth_strm_lp.decimals,
      ).toString(),
      rewardDebt: toTokenUnitsBN(
        userInfo[1].toString(),
        tokens.strm.decimals,
      ).toNumber(),
      poolId: poolId.toNumber(),
    };

    this.dispatch(updateLMUserInfo(userInfo));

    return userInfo;
  }

  async userInfoBN(
    poolId: BigNumber,
    account: string,
  ): Promise<{
    locked: string;
    rewardDebt: string;
  }> {
    let userInfo = await this.contract.userInfo(poolId.toFixed(), account);

    userInfo = {
      locked: toTokenUnitsBN(
        userInfo[0].toString(),
        tokens.eth_strm_lp.decimals,
      ),
      rewardDebt: toTokenUnitsBN(userInfo[1].toString(), tokens.strm.decimals),
      poolId: poolId.toNumber(),
    };

    return userInfo;
  }
}

import { Contract, ethers } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import VestingAbi from "../abi/Vesting.json";
import BigNumber from "bignumber.js";
import { toTokenUnitsBN } from "@/utils";
import { tokens } from "../tokenInfo";
import { getNetworkUrl } from "..";
import { newTransaction } from "@/store/tranasctions/slice";
import { addNotification } from "@/store/notifications/slice";

export class VestingService {
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
    const contract = new ethers.Contract(address, VestingAbi, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  async claim(
    vestingId: BigNumber,
    address: string,
    merkleProof: string[],
    volume: BigNumber,
    label: string = "Claim Airdrop",
  ): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.claim(
      vestingId.toFixed(),
      address,
      merkleProof,
      volume,
    );

    this.dispatch(
      newTransaction({
        txHash: tx.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [],
        label,
        functionName: this.claim.name,
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

    return tx;
  }

  async pendingInstrumental(
    vestingId: BigNumber,
    volume: BigNumber,
    merkleProof: string[],
  ): Promise<BigNumber> {
    const pendingSTRM = await this.contract.pendingInstrumental(
      vestingId.toFixed(),
      volume.toFixed(),
      merkleProof,
    );

    const pSTRMBN = toTokenUnitsBN(
      pendingSTRM.toString(),
      tokens.strm.decimals,
    );

    return pSTRMBN;
  }

  async claimAll(
    vestingIds: ethers.BigNumber[],
    address: string,
    merkleProof: string[][],
    volumes: ethers.BigNumber[],
    label: string = "Claim Airdrop",
  ): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.claimAll(
      vestingIds,
      address,
      merkleProof,
      volumes,
    );

    this.dispatch(
      newTransaction({
        txHash: tx.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [],
        label,
        functionName: this.claimAll.name,
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

    return tx;
  }
}

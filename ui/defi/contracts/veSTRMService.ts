import { Contract, ethers } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import BigNumber from "bignumber.js";
import { newTransaction } from "@/store/tranasctions/slice";
import { addNotification } from "@/store/notifications/slice";
import { getNetworkUrl } from "..";
import ivotingEscrowAbi from "../abi/IVotingEscrow.json";
import {
  veSTRMBalanceUpdate,
  veSTRMEndupdate,
  veSTRMlockedupdate,
  veSTRMtotalSupplyUpdate,
} from "@/store/veSTRM/slice";
import { toTokenUnitsBN } from "@/utils";
import { tokens } from "../tokenInfo";

/**
 * It is a non standard ERC20
 * That allows voting for DAOs
 */
export class VeSTRMService {
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
    const contract = new ethers.Contract(address, ivotingEscrowAbi, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  getContractAddress(): string {
    return this.contract.address;
  }

  async getTotalSupply(): Promise<ethers.BigNumber> {
    const totalSupply = await this.contract.totalSupply();

    this.dispatch(
      veSTRMtotalSupplyUpdate({
        totalSupply: toTokenUnitsBN(
          totalSupply.toString(),
          tokens.strm.decimals,
        ).toNumber(),
      }),
    );

    return totalSupply;
  }

  async getTotalSupplyAt(blockNumber: BigNumber): Promise<BigNumber> {
    const totalSupplyAtBlockNumber = await this.contract.totalSupplyAt(
      blockNumber,
    );
    return new BigNumber(totalSupplyAtBlockNumber);
  }

  async balanceOf(
    account: string | undefined = undefined,
  ): Promise<ethers.BigNumber> {
    let address = !account ? this.signerAddress : account;
    const balBN = await this.contract.balanceOf(address);

    let balance = toTokenUnitsBN(
      balBN.toString(),
      tokens.strm.decimals,
    ).toNumber();

    this.dispatch(
      veSTRMBalanceUpdate({
        balance,
        balanceBN: balBN.toString(),
      }),
    );

    return balBN;
  }

  async balanceOfAt(
    blockNumber: BigNumber,
    account: string | undefined = undefined,
  ): Promise<BigNumber> {
    let address = !account ? this.signerAddress : account;
    const balanceOfAt = await this.contract.balanceOfAt(address, blockNumber);
    return new BigNumber(balanceOfAt);
  }

  async locked(account: string | undefined = undefined): Promise<{
    amount: ethers.BigNumber;
    end: ethers.BigNumber;
  }> {
    let address = !account ? this.signerAddress : account;
    const locked = await this.contract.locked(address);
    const amount = toTokenUnitsBN(
      locked.amount.toString(),
      tokens.strm.decimals,
    ).toNumber();
    const end = locked.end.toNumber();

    this.dispatch(veSTRMlockedupdate({ locked: amount }));
    this.dispatch(veSTRMEndupdate({ end }));
    return locked;
  }

  async create_lock_days(
    amount: BigNumber,
    unlockTime: ethers.BigNumber,
    label = "Create veSTRM Lock",
  ): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.create_lock_days(
      amount.toFixed(),
      unlockTime,
    );

    this.dispatch(
      newTransaction({
        txHash: tx.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [],
        label,
        functionName: this.create_lock_days.name,
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

  async withdraw(
    label: string = "Withdraw veSTRM",
  ): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.withdraw();

    this.dispatch(
      newTransaction({
        txHash: tx.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [],
        label,
        functionName: this.withdraw.name,
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

  async getToken(): Promise<string> {
    return await this.contract.token();
  }

  async increase_unlock_time_days(
    blockTime: ethers.BigNumber,
    label = "Increase veSTRM Unlock Time",
  ): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.increase_unlock_time_days(blockTime);

    this.dispatch(
      newTransaction({
        txHash: tx.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [],
        label,
        functionName: this.increase_unlock_time_days.name,
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

  async increase_amount(
    amount: BigNumber,
    label = "Increase veSTRM Amount",
  ): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.increase_amount(amount.toFixed());

    this.dispatch(
      newTransaction({
        txHash: tx.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [],
        label,
        functionName: this.increase_amount.name,
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

  async decimals(): Promise<BigNumber> {
    const decimals = await this.contract.decimals();
    return new BigNumber(decimals.toString());
  }

  async symbol(): Promise<string> {
    return await this.contract.symbol();
  }

  async name(): Promise<string> {
    return await this.contract.name();
  }
}

import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { Contract, ContractsWrapper } from "@integrations-lib/interaction";
import {
  BigNumber as EthersBigNumber,
  ContractInterface,
  ContractTransaction,
  ethers,
  Signer,
} from "ethers";

import { SushiERC20Strategy, UserInfoResponse } from "../../abis/types/SushiERC20Strategy";

export class SushiERC20StrategyContractWrapper
implements ContractsWrapper<SushiERC20Strategy> {
  readerContract: Contract<SushiERC20Strategy>;
  writerContract: Contract<SushiERC20Strategy> | undefined;

  chainId: number;

  constructor(
    address: string,
    abi: ContractInterface,
    chainId: number,
    provider: MulticallProvider,
    signer: Signer | undefined,
  ) {
    this.writerContract =
      signer &&
        new ethers.Contract(
          address,
          abi,
          signer
        ) as Contract<
          SushiERC20Strategy
        > ||
      undefined;
    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider,
    ) as Contract<SushiERC20Strategy>;

    this.chainId = chainId;
  }

  update = (
    chainId: number,
    signer: Signer | undefined,
    provider: MulticallProvider,
  ) => {
    const address = this.readerContract.address;
    const abi = this.readerContract.interface;

    this.writerContract =
      signer &&
        new ethers.Contract(
          address,
          abi,
          signer
        ) as Contract<
          SushiERC20Strategy
        > ||
      undefined;

    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider,
    ) as Contract<SushiERC20Strategy>;

    this.chainId = chainId;
  };

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (
    owner: string,
    spender: string,
  ): Promise<EthersBigNumber> => {
    return this.readerContract.allowance(
      owner,
      spender
    );
  };

  /**
   * Approve `spender` to transfer an "unlimited" amount of tokens on behalf of the connected user.
   */
  approveUnlimited(spender: string) {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("Vault Contract Wrapper - Write Contract Undefined");
        return;
      }

      this.writerContract
        .approve(
          spender,
          ethers.constants.MaxUint256
        )
        .then((value: ContractTransaction) => resolve(value))
        .catch((e: any) => reject(e));
    });
  }

  approve(
    spender: string, amount: EthersBigNumber
  ) {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("Vault Contract Wrapper - Write Contract Undefined");
        return;
      }

      this.writerContract
        .approve(
          spender,
          amount
        )
        .then((value: ContractTransaction) => resolve(value))
        .catch((e: any) => reject(e));
    });
  }

  deposit = (
    amount1: EthersBigNumber,
    asset1: string,
    amount2: EthersBigNumber,
    asset2: string,
    deadline: EthersBigNumber,
    swapTokenOutMin: EthersBigNumber,
  ) => {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("Sushi ERC20 Strategy Contract Wrapper - Writer contract undefined",);
        return;
      }

      this.writerContract
        .deposit(
          ethers.utils.parseEther(amount1.toString()),
          asset1,
          ethers.utils.parseEther(amount2.toString()),
          asset2,
          deadline,
          ethers.utils.parseEther(swapTokenOutMin.toString()),
        )
        .then((value: ContractTransaction) => resolve(value))
        .catch((e: any) => reject(e));
    });
  };

  withdraw = (
    amount: EthersBigNumber,
    asset: string,
    deadline: EthersBigNumber,
    amountAMin: EthersBigNumber,
    amountBMin: EthersBigNumber,
  ) => {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("Sushi ERC20 Strategy Contract Wrapper - Writer contract undefined",);
        return;
      }

      this.writerContract
        .withdraw(
          ethers.utils.parseEther(amount.toString()),
          asset,
          deadline,
          ethers.utils.parseEther(amountAMin.toString()),
          ethers.utils.parseEther(amountBMin.toString()),
        )
        .then((value: ContractTransaction) => resolve(value))
        .catch((e: any) => reject(e));
    });
  }

  getPendingRewards = async (address: string): Promise<EthersBigNumber> => {
    return this.readerContract.getPendingRewards(address);
  };

  userInfo = async (address: string): Promise<UserInfoResponse> => {
    return this.readerContract.userInfo(address);
  };
}

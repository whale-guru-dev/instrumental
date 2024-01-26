import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { Contract, ContractsWrapper } from "@integrations-lib/interaction";
import {
  BigNumber as EthersBigNumber,
  ContractInterface,
  ContractTransaction,
  ethers,
  Signer,
} from "ethers";

import {
  CurveTricryptoStrategy,
  UserInfoResponse,
  WithdrawRequest,
} from "../../abis/types/CurveTricryptoStrategy";

export class CurveTricryptoStrategyContractWrapper
implements ContractsWrapper<CurveTricryptoStrategy> {
  readerContract: Contract<CurveTricryptoStrategy>;
  writerContract: Contract<CurveTricryptoStrategy> | undefined;

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
          CurveTricryptoStrategy
        > ||
      undefined;
    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider,
    ) as Contract<CurveTricryptoStrategy>;

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
          CurveTricryptoStrategy
        > ||
      undefined;

    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider,
    ) as Contract<CurveTricryptoStrategy>;

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
    assetAddress: string,
    amount: EthersBigNumber,
    lpAmountMinimum: number,
  ) => {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("Curve Tricrypto Strategy Contract Wrapper - Writer contract undefined",);
        return;
      }

      this.writerContract
        .deposit(
          assetAddress,
          ethers.utils.parseEther(amount.toString()),
          ethers.utils.parseEther(lpAmountMinimum.toString()),
        )
        .then((value: ContractTransaction) => resolve(value))
        .catch((e: any) => reject(e));
    });
  };

  withdraw = (
    amount: EthersBigNumber,
    assetAddress: string,
    params: WithdrawRequest,
  ) => {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("Curve Tricrypto Strategy Contract Wrapper - Writer contract undefined",);
        return;
      }

      this.writerContract
        .withdraw(
          ethers.utils.parseEther(amount.toString()),
          assetAddress,
          params,
        )
        .then((value: ContractTransaction) => resolve(value))
        .catch((e: any) => reject(e));
    });
  };

  getPendingRewards = async (address: string): Promise<EthersBigNumber> => {
    return this.readerContract.getPendingRewards(address);
  };

  userHistory = async (address: string): Promise<EthersBigNumber> => {
    return this.readerContract.userHistory(address);
  };

  totalAmountOfLPs = async (): Promise<EthersBigNumber> => {
    return this.readerContract.totalAmountOfLPs();
  };

  userInfo = async (address: string): Promise<UserInfoResponse> => {
    return this.readerContract.userInfo(address);
  };

  isWithdrawalPaused = async (): Promise<boolean> => {
    return this.readerContract.isWithdrawalPaused();
  };
}

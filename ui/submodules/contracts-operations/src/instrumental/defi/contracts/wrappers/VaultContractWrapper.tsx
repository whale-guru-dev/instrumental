import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { Contract, ContractsWrapper } from "@integrations-lib/interaction";
import BigNumber from "bignumber.js";
import { BigNumber as EthersBigNumber, ContractInterface, ContractTransaction, ethers, Signer } from "ethers";

import { SupportedNetworkId, SwapAmmID } from "../../../../defi/constants";
import { Vault } from "../../abis/types/vault";

export class VaultContractWrapper implements ContractsWrapper<Vault> {
  readerContract: Contract<Vault>;
  writerContract: Contract<Vault> | undefined;

  chainId: number;

  constructor(
    address: string,
    abi: ContractInterface,
    chainId: number,
    provider: MulticallProvider,
    signer: Signer | undefined,
  ) {
    this.writerContract = signer && new ethers.Contract(
      address,
      abi,
      signer
    ) as Contract<Vault> || undefined;
    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Vault>;

    this.chainId = chainId;
  }

  update = (
    chainId: number, signer: Signer | undefined, provider: MulticallProvider
  ) => {
    const address = this.readerContract.address;
    const abi = this.readerContract.interface;

    this.writerContract = signer && new ethers.Contract(
      address,
      abi,
      signer
    ) as Contract<Vault> || undefined;

    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Vault>;

    this.chainId = chainId;
  }

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (
    owner: string, spender: string
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

  transferERC20ToLayer = (
    amount: BigNumber,
    fromTokenAddress: string,
    destinationAddress: string,
    toChain: SupportedNetworkId,
    deadlineMinutes: number,
    toTokenAddress: string,
    amm: SwapAmmID,
    amountOutMinimum: number,
    swapToNative: boolean,
  ) => {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("Vault Contract Wrapper - Writer contract undefined")
        return;
      }

      this.writerContract
        .transferERC20ToLayer(
          ethers.utils.parseEther(amount.toString()),
          fromTokenAddress,
          destinationAddress,
          toChain,
          deadlineMinutes * 60,
          toTokenAddress,
          amm,
          ethers.utils.parseEther(amountOutMinimum.toString()),
          swapToNative
        )
        .then((value: ContractTransaction) => resolve(value))
        .catch((e: any) => reject(e));
    });
  }

  providePassiveLiquidity(
    amount: BigNumber,
    tokenAddress: string,
  ) {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("Vault Contract Wrapper - Writer contract undefined")
        return;
      }

      this.writerContract
        .providePassiveLiquidity(
          ethers.utils.parseEther(amount.toString()),
          tokenAddress
        )
        .then((value: ContractTransaction) => resolve(value))
        .catch((e: any) => reject(e));
    });
  }

  withdrawPassiveLiquidity(
    receiptTokenAddress: string,
    amount: BigNumber,
    tokenAddress: string,
    destinationAddress: string,
    amm: SwapAmmID,
    toChain: SupportedNetworkId,
    amountOutMinimum: number,
    deadlineMinutes: number,
    swapToNative: boolean,
  ) {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("Vault Contract Wrapper - Writer contract undefined")
        return;
      }

      this.writerContract
        .withdrawLiquidityRequest(
          receiptTokenAddress,
          ethers.utils.parseEther(amount.toString()),
          tokenAddress,
          destinationAddress,
          amm,
          ethers.utils.formatBytes32String(""),
          toChain,
          {
            amountOutMin: ethers.utils.parseEther(amountOutMinimum.toString()),
            maxDelay: deadlineMinutes.toString(),
            _swapToNative: swapToNative,
          }
        )
        .then((value: ContractTransaction) => resolve(value))
        .catch((e: any) => reject(e));
    });
  }
}
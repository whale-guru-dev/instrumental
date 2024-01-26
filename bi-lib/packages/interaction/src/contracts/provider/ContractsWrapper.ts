import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import ethers, { ContractInterface, Signer } from "ethers";

export type Contract<Type> = ethers.Contract & Type

export interface ContractsWrapper<Type> {
  readerContract: Contract<Type>;
  writerContract: Contract<Type> | undefined;

  update: (
    chainId: number,
    signer: Signer | undefined,
    provider: MulticallProvider
  ) => void;
}

export interface ContractsWrapperConstructor<Type> {
  new (
    address: string,
    abi: ContractInterface,
    chainId: number,
    provider: MulticallProvider,
    signer: Signer | undefined,
  ): ContractsWrapper<Type>;
}
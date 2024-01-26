import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { Contract, ContractsWrapper } from "@integrations-lib/interaction";
import { BigNumber, ContractInterface, ethers, Signer } from "ethers";

import { Holding } from "../../abis/types/holding";

export class HoldingContractWrapper implements ContractsWrapper<Holding> {
  readerContract: Contract<Holding>;
  writerContract: Contract<Holding> | undefined;

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
    ) as Contract<Holding> || undefined;
    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Holding>;

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
    ) as Contract<Holding> || undefined;

    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Holding>;

    this.chainId = chainId;
  }

  getTokenLiquidity = async (tokenAddress: string): Promise<BigNumber> => {
    return await this.readerContract.getTokenLiquidity(
      tokenAddress,
      []
    );
  }
}
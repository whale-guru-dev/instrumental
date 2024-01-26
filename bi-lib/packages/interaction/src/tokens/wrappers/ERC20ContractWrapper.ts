import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { BigNumber, ContractInterface, ContractTransaction, ethers, EventFilter, Signer } from "ethers";

import { Contract, ContractsWrapper } from "../../contracts"
import { Erc20 } from "../abis/types/erc20";

export class ERC20ContractWrapper implements ContractsWrapper<Erc20> {
  readerContract: Contract<Erc20>;
  writerContract: Contract<Erc20> | undefined;

  chainId: number;
  provider: MulticallProvider;

  events: Array<EventFilter> = [];

  constructor(
    address: string,
    abi: ContractInterface,
    chainId: number,
    provider: MulticallProvider,
    signer: Signer | undefined,
  ) {
    console.log(
      "Token Balances - Create contract",
      {
        chainId,
        signer,
        provider,
      }
    );

    this.writerContract = signer && new ethers.Contract(
      address,
      abi,
      signer
    ) as Contract<Erc20> || undefined;

    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Erc20>;

    this.chainId = chainId;
    this.provider = provider;
  }

  update = (
    chainId: number, signer: Signer | undefined, provider: MulticallProvider
  ) => {
    console.log(
      "Token Balances - Update contract",
      {
        chainId,
        signer,
        provider,
      }
    );

    const address = this.readerContract.address;
    const abi = this.readerContract.interface;

    this.writerContract = signer && new ethers.Contract(
      address,
      abi,
      signer
    ) as Contract<Erc20> || undefined;

    console.log("Token Balances - ERC20ContractWrapper - Trying to transfer listeners")

    this.events.forEach((event: EventFilter) => {
      console.log(
        "Token Balances - ERC20ContractWrapper - Event",
        event
      )

      this.provider.listeners(event).forEach((listener: ethers.providers.Listener) => {
        console.log(
          "Token Balances - ERC20ContractWrapper - Listener",
          listener
        )

        provider.addListener(
          event,
          listener
        );
      })
    });

    console.log(
      "Token Balances - ERC20ContractWrapper - New Listeners",
      provider.listeners()
    )

    this.provider.removeAllListeners();

    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Erc20>;

    this.chainId = chainId;

    this.provider = provider;
  }

  async balanceOf(owner: string): Promise<BigNumber> {
    return await this.readerContract.balanceOf(owner);
  }

  on(
    event: EventFilter, listener: ethers.providers.Listener
  ): this {
    if (!this.provider) {
      throw Error("ERC20ContractWrapper - Provider undefined")
    }

    this.events.push(event);

    this.provider.addListener(
      event,
      listener
    );

    return this;
  }

  once(
    event: EventFilter, listener: ethers.providers.Listener
  ): this {
    if (!this.provider) {
      throw Error("ERC20ContractWrapper - Provider undefined")
    }

    this.writerContract?.once( // TODO(Marko): Using provider fails - Maybe a multicall provider issue
      event,
      listener
    );

    return this;
  }

  hasEnoughAllowance = async (
    owner: string,
    spender: string
  ): Promise<boolean> => {
    const allowance: BigNumber = await this.readerContract.allowance(
      owner,
      spender
    );
    return allowance.gte(BigNumber.from("0xffffffffffffffffffffffff"));
  };

  approve = (spender: string) => {
    return new Promise<ContractTransaction>((
      resolve, reject
    ) => {
      if (!this.writerContract) {
        reject("ERC20ContractWrapper - Writer contract undefined")
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
}

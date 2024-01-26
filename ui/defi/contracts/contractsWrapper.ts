import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { ethers } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { ERC20Service } from "./erc20";
import { LiquidityMiningService } from "./liquidityMiningService";
import { VestingService } from "./vestingService";
import { VeSTRMService } from "./veSTRMService";
export class ContractsWrapper {
  provider: MulticallProvider;
  signer?: ethers.Signer;
  signerAddress: string;
  dispatcher: Dispatch<AnyAction>;

  constructor(
    account: string,
    provider: MulticallProvider,
    dispatcher: Dispatch<AnyAction>,
    signer?: ethers.Signer,
  ) {
    this.provider = provider;
    this.signer = signer; // TODO handle if signer is not there
    this.signerAddress = account;
    this.dispatcher = dispatcher;
  }

  erc20 = (address: string) => {
    return new ERC20Service(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer,
    );
  };

  liquidityMining = (address: string) => {
    return new LiquidityMiningService(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer,
    );
  };

  votingEscrow = (address: string) => {
    return new VeSTRMService(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer,
    );
  };

  vesting = (address: string) => {
    return new VestingService(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer,
    );
  };
}

import { Contract, ethers } from "ethers";
import { BigNumber } from "ethers";
import { BNExt } from "utils/BNExt";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { newTransaction } from "store/tranasctions/slice";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { addNotification } from "store/notifications/slice";
import { getNetworkUrl } from "defi";

const erc20Abi = [
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address marketMaker) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)",
  "function transfer(address to, uint256 value) public returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export class ERC20Service {
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
    const contract = new ethers.Contract(address, erc20Abi, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return this.contract.allowance(owner, spender);
  };
  /**
   * Approve `spender` to transfer an "unlimited" amount of tokens on behalf of the connected user.
   */
  async approveUnlimited(spender: string, label: string) {
    const txR: ethers.providers.TransactionResponse =
      await this.contract.approve(spender, ethers.constants.MaxUint256); // todo add type here
    this.dispatch(
      newTransaction({
        txHash: txR.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [
          { contractType: "erc20", functionName: "allowance", data: [spender] },
        ],
        label,
        functionName: this.approveUnlimited.name,
      }),
    );

    this.dispatch(
      addNotification({
        message: `Transaction [${label}] started.`,
        type: "info",
        url: getNetworkUrl(this.chainId) + txR.hash,
        timeout: 5000,
      }),
    );
  }

  async transfer(to: string, value: BNExt, label: string) {
    const txR: ethers.providers.TransactionResponse =
      await this.contract.transfer(to, value.raw().toFixed());

    this.dispatch(
      newTransaction({
        txHash: txR.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        functionName: this.transfer.name,
        label,
        toUpdate: [{ contractType: "erc20", functionName: "balance" }],
      }),
    );
  }

  async balanceOf(owner: string): Promise<BigNumber> {
    return await this.contract.balanceOf(owner);
  }

  hasEnoughAllowance = async (
    owner: string,
    spender: string,
  ): Promise<boolean> => {
    const allowance: BigNumber = await this.contract.allowance(owner, spender);
    return allowance.gte(BigNumber.from("0xffffffffffffffffffffffff"));
  };
}

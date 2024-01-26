// import { useWeb3React } from "@web3-react/core";
import { useBlockchainProvider } from "@integrations-lib/core";
import { isValidNetwork } from "defi";
import { ethers } from "ethers";
import React, { useState, useEffect, createContext, Dispatch } from "react";
import { AnyAction } from "redux";
import { useAppDispatch } from "store";
import { ContractsWrapper } from "./contracts/contractsWrapper";
import {
  ContractAddresses,
  getAddressesByChainId,
  ERC20Addresses,
} from "./addresses";
import { SupportedNetworks } from "./types";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { providers as multicallProviders } from "@0xsequence/multicall";
import { hasAllowance, updateBalance } from "store/userdata/slice";
import { BNExt } from "utils/BNExt";
import { getToken } from "./tokenInfo";
import { handleErr } from "./errorHandling";
// import { useEagerConnect, useInactiveListener } from "./hooks";
import { NETWORKS } from "./networks";

export type Contracts = "erc20" | "raw";

const createContractsStore = (
  account: string,
  addresses: { [name in ContractAddresses]: string },
  multicallProvider: MulticallProvider,
  dispatcher: Dispatch<AnyAction>,
  signer?: ethers.Signer,
) => {
  return {
    erc20: {
      contract: (
        address: RequireAtLeastOne<
          { contract?: ERC20Addresses; address?: string },
          "contract" | "address"
        >,
      ) =>
        new ContractsWrapper(
          account,
          multicallProvider,
          dispatcher,
          signer,
        ).erc20(
          address.contract ? addresses[address.contract] : address.address,
        ),
      update: (
        address: RequireAtLeastOne<
          { contract?: ERC20Addresses; address?: string },
          "contract" | "address"
        >,
      ) => {
        // make this return ERC20Service.prototype function names
        const erc20Contract = new ContractsWrapper(
          account,
          multicallProvider,
          dispatcher,
          signer,
        ).erc20(
          address.contract ? addresses[address.contract] : address.address,
        );

        let erc20 = address.contract as ERC20Addresses;
        if (!erc20) {
          const erc20tmp = Object.entries(addresses).find(
            ([_, v]) => v === address.address,
          );
          if (erc20tmp) {
            erc20 = erc20tmp[0] as ERC20Addresses;
          } else {
            console.error("Could not find address ID by address");
          }
        }
        return {
          balance: (ownerAddress?: string) => {
            handleErr(function () {
              return erc20Contract.balanceOf(ownerAddress ?? account);
            })
              .then((x) =>
                dispatcher(
                  updateBalance({
                    tokenId: erc20,
                    balance: new BNExt(x, getToken(erc20).decimals).toFixed(),
                  }),
                ),
              )
              .catch((e) => console.error(e));
          },
          allowance: (
            spenderAddress: ContractAddresses | string,
            ownerAddress?: string,
          ) => {
            const address = Object.entries(addresses).find(
              ([k, v]) => v === spenderAddress || k === spenderAddress,
            );

            if (!address) {
              console.error("contract not found");
              return;
            }
            handleErr(function () {
              return erc20Contract.hasEnoughAllowance(
                ownerAddress ?? account,
                address[1],
              );
            })
              .then((x) => {
                x
                  ? dispatcher(
                      hasAllowance({
                        tokenId: erc20,
                        address: address[0] as ContractAddresses,
                      }),
                    )
                  : null;
              })
              .catch((e) => console.error(e));
          },
        };
      },
    },
    raw: {
      update: () => {
        return {
          balance: (ownerAddress?: string) => {
            handleErr(function () {
              return multicallProvider.getBalance(ownerAddress ?? account);
            })
              .then((x) => {
                dispatcher(
                  updateBalance({
                    tokenId: "eth",
                    balance: new BNExt(x, getToken("eth").decimals).toFixed(),
                  }),
                );
              })
              .catch((e) => console.error(e));
          },
        };
      },
    },
    liquidityMining: new ContractsWrapper(
      account,
      multicallProvider,
      dispatcher,
      signer,
    ).liquidityMining(addresses.liquidityMining),
    vesting: new ContractsWrapper(
      account,
      multicallProvider,
      dispatcher,
      signer,
    ).vesting(addresses.vesting),
    votingEscrow: new ContractsWrapper(
      account,
      multicallProvider,
      dispatcher,
      signer,
    ).votingEscrow(addresses.veSTRM),
  };
};

export const ContractsContext = createContext({
  contracts: undefined as ReturnType<typeof createContractsStore> | undefined,
  multicallProvider: undefined as MulticallProvider | undefined,
  chainId: undefined as number | undefined,
  account: undefined as string | undefined,
  library: undefined as ethers.providers.Web3Provider | undefined,
});

const ContractsContextProvider = (props: any) => {
  const dispatch = useAppDispatch();

  const { account, chainId, provider, signer } = useBlockchainProvider(1);

  const [g, s] = useState<{
    contracts: ReturnType<typeof createContractsStore> | undefined;
    multicallProvider: MulticallProvider | undefined;
    chainId: number | undefined;
    account: string | undefined;
    library: ethers.providers.Web3Provider | undefined;
  }>({
    contracts: undefined,
    multicallProvider: undefined,
    chainId: undefined,
    account: undefined,
    library: undefined,
  });

  const updateContracts = () => {
    s({
      contracts: undefined,
      multicallProvider: undefined,
      chainId: undefined,
      account: undefined,
      library: undefined,
    });

    if (!isValidNetwork(chainId) && !signer && !account) {
      const library = new ethers.providers.AlchemyProvider(
        1,
        NETWORKS[1].rpcUrl,
      );
      const multicallProvider = new multicallProviders.MulticallProvider(
        library,
      );

      multicallProvider.ready.then(() => {
        const addresses = getAddressesByChainId(1 as SupportedNetworks);
        s({
          contracts: createContractsStore(
            "",
            addresses,
            multicallProvider,
            dispatch,
          ),
          account: undefined,
          chainId,
          multicallProvider,
          library: undefined,
        });
      });
    }

    if (!isValidNetwork(chainId) || !signer || !provider || !account) {
      s({
        contracts: undefined,
        multicallProvider: undefined,
        chainId: undefined,
        account: undefined,
        library: undefined,
      });
    } else {
      provider.ready.then(() => {
        const addresses = getAddressesByChainId(chainId as SupportedNetworks);
        s({
          contracts: createContractsStore(
            account,
            addresses,
            provider,
            dispatch,
            signer,
          ),
          account,
          chainId,
          multicallProvider: provider,
          library: undefined,
        });
      });
    }
  };

  useEffect(() => {
    updateContracts();
  }, [account, signer, chainId]);

  return (
    <ContractsContext.Provider value={g}>
      {props.children}
    </ContractsContext.Provider>
  );
};

export default ContractsContextProvider;

import { useAppDispatch } from "@/store";
import { addNotification } from "@/store/notifications/slice";
import { newTransaction } from "@/store/tranasctions/slice";
import { toTokenUnitsBN } from "@/utils";
// import { useWeb3React } from "@web3-react/core";
import { useBlockchainProvider } from "@integrations-lib/core";
import axios from "axios";
import BigNumber from "bignumber.js";
import { ethers, utils } from "ethers";
import React, { useContext, useEffect, useReducer } from "react";
import { isValidNetwork } from ".";
import {
  initialState,
  TokenInfo,
  tokensReducer,
  TokenStore,
} from "./reducers/tokensReducer";
import { TokenId } from "./tokenInfo";
import { SupportedNetworks } from "./types";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const fetchCoinGeckoPrice = async (tokenIds: string): Promise<any> => {
  try {
    const coinGeckoPricesResponse = await axios.get(
      `${COINGECKO_BASE_URL}/simple/price?`,
      {
        params: {
          ids: tokenIds,
          vs_currencies: "usd",
        },
      },
    );

    return coinGeckoPricesResponse.data;
  } catch (err) {
    console.error(err);
  }
};

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
  "event Approval(address indexed owner, address indexed spender, uint256 amount)",
];

export type SupportedToken = {
  name: string;
  address: {
    [netId in SupportedNetworks]?: string;
  };
  symbol: string;
  decimals: number;
  coingeckoId?: string;
  tokenId: TokenId;
  staticPrice?: number;
};

const Erc20Context = React.createContext<any>(undefined);
export const Erc20ContextProvider = ({
  children,
  tokensToWatch,
}: {
  children: React.ReactNode;
  tokensToWatch: SupportedToken[];
}) => {
  const appDispatch = useAppDispatch();
  // const { library, account, chainId } =
  //   useWeb3React<ethers.providers.Web3Provider>();
  // const {account, chainId} = useConnector("metamask");
  const { account, chainId, signer } = useBlockchainProvider(1);
  const [tokens, tokensDispatch] = useReducer(tokensReducer, initialState);

  useEffect(() => {
    if (account || chainId) {
      tokensDispatch({
        type: "resetTokens",
      });
    }
  }, [account, chainId]);

  useEffect(() => {
    if (chainId && isValidNetwork(chainId) && signer) {
      const checkBalanceAndAllowance = async (
        token: ethers.Contract,
        tokenId: TokenId,
        decimals: number,
      ) => {
        try {
          if (account) {
            const bal = await token.balanceOf(account);
            const balance = Number(utils.formatUnits(bal, decimals));
            const balanceBN = toTokenUnitsBN(bal.toString(), decimals);

            tokensDispatch({
              type: "updateTokenBalanceAllowance",
              payload: {
                id: tokenId,
                spenderAllowance: 0,
                balance: balance,
                balanceBN: balanceBN as any,
              },
            });
          }
        } catch (e) {
          console.log("err: ", e);
        }
      };

      let tokenContracts: Array<ethers.Contract> = [];

      if (
        signer &&
        chainId &&
        account &&
        tokensToWatch.length > 0 &&
        isValidNetwork(chainId)
      ) {
        // const signer = library.getSigner();
        tokensToWatch.forEach(async (token) => {
          if (token.address[chainId as SupportedNetworks]) {
            const tokenContract = new ethers.Contract(
              token.address[chainId as SupportedNetworks] as string,
              erc20Abi,
              signer,
            );

            const transfer = async (
              spender: string,
              amount: ethers.BigNumber,
            ): Promise<ethers.providers.TransactionResponse> => {
              const label = `Transfer ${amount.toString()} ${token.name}`;
              const tx = await tokenContract.transfer(spender, amount);

              appDispatch(
                newTransaction({
                  txHash: tx.hash,
                  chainId: chainId,
                  address: account,
                  contractAddress:
                    token.address[chainId as SupportedNetworks] ?? "",
                  toUpdate: [],
                  label,
                  functionName: "transfer",
                }),
              );

              appDispatch(
                addNotification({
                  message: `Transaction [${label}] started.`,
                  type: "info",
                  url: ``,
                  timeout: 5000,
                }),
              );

              return tx;
            };

            const approve = async (
              spender: string,
              amount: ethers.BigNumber,
            ): Promise<ethers.providers.TransactionResponse> => {
              const label = `Approve ${amount.toString()} ${token.name}`;
              const tx = await tokenContract.approve(spender, amount);

              appDispatch(
                newTransaction({
                  txHash: tx.hash,
                  chainId: chainId,
                  address: account,
                  contractAddress:
                    token.address[chainId as SupportedNetworks] ?? "",
                  toUpdate: [],
                  label,
                  functionName: "approve",
                }),
              );

              appDispatch(
                addNotification({
                  message: `Transaction [${label}] started.`,
                  type: "info",
                  url: ``,
                  timeout: 5000,
                }),
              );

              return tx;
            };

            const approveMax = async (
              spender: string,
            ): Promise<ethers.providers.TransactionResponse> => {
              return await approve(spender, ethers.constants.MaxUint256);
            };

            const newTokenInfo: Omit<TokenInfo, "price"> = {
              decimals: token.decimals,
              balance: 0,
              balanceBN: new BigNumber(0),
              imageUri: "",
              tokenId: token.tokenId,
              name: token.name,
              symbol: token.symbol,
              spenderAllowance: 0,
              displayedDecimals: 2,
              approve,
              approveMax,
              allowance: tokenContract.allowance,
              transfer,
            };

            try {
              const tokenName = await tokenContract.name();
              newTokenInfo.name = tokenName;
            } catch (error) {
              console.log(
                "There was an error getting the token name. Does this contract implement ERC20Detailed?",
              );
            }

            if (!token.symbol) {
              try {
                const tokenSymbol = await tokenContract.symbol();
                newTokenInfo.symbol = tokenSymbol;
              } catch (error) {
                console.error(
                  "There was an error getting the token symbol. Does this contract implement ERC20Detailed?",
                );
              }
            }

            if (!token.decimals) {
              try {
                const tokenDecimals = await tokenContract.decimals();
                newTokenInfo.decimals = tokenDecimals;
              } catch (error) {
                console.error(
                  "There was an error getting the token decimals. Does this contract implement ERC20Detailed?",
                );
              }
            }

            tokensDispatch({
              type: "addToken",
              payload: {
                id: token.tokenId,
                token: newTokenInfo,
              },
            });

            checkBalanceAndAllowance(
              tokenContract,
              token.tokenId,
              newTokenInfo.decimals,
            );

            // This filter is intentionally left quite loose.
            const filterTokenApproval = tokenContract.filters.Approval(
              account,
              null,
              null,
            );
            const filterTokenTransferFrom = tokenContract.filters.Transfer(
              account,
              null,
              null,
            );
            const filterTokenTransferTo = tokenContract.filters.Transfer(
              null,
              account,
              null,
            );

            tokenContract.on(filterTokenApproval, () =>
              checkBalanceAndAllowance(
                tokenContract,
                token.tokenId,
                newTokenInfo.decimals,
              ),
            );
            tokenContract.on(filterTokenTransferFrom, () =>
              checkBalanceAndAllowance(
                tokenContract,
                token.tokenId,
                newTokenInfo.decimals,
              ),
            );
            tokenContract.on(filterTokenTransferTo, () =>
              checkBalanceAndAllowance(
                tokenContract,
                token.tokenId,
                newTokenInfo.decimals,
              ),
            );
            tokenContracts.push(tokenContract);
          }
        });
      } else {
        tokensDispatch({
          type: "resetTokens",
        });
      }
      return () => {
        if (tokenContracts.length > 0)
          tokenContracts.forEach((tc) => {
            tc.removeAllListeners();
          });
      };
    } else {
      tokensDispatch({
        type: "resetTokens",
      });
      return undefined;
    }
  }, [chainId, signer, account]);

  useEffect(() => {
    tokensToWatch
      .filter((x) => x.staticPrice)
      .map((token) => {
        tokensDispatch({
          type: "updatePrice",
          payload: {
            id: token.tokenId,
            price: token.staticPrice ?? 0,
          },
        });
      });

    const cGeckoIds = tokensToWatch
      .filter((x) => x.coingeckoId)
      .map((x) => x.coingeckoId)
      .join(",");

    const priceUpdater = () => {
      fetchCoinGeckoPrice(cGeckoIds).then(
        (data: { [coinGeckoId: string]: { usd: number } }) => {
          Object.entries(data).forEach(([coinGeckoId, priceObj]: any[]) => {
            const token = tokensToWatch
              .filter((x) => x.tokenId)
              .find((x) => x.coingeckoId === coinGeckoId);

            if (token) {
              tokensDispatch({
                type: "updatePrice",
                payload: {
                  id: token.tokenId,
                  price: priceObj.usd,
                },
              });
            }
          });
        },
      );
    };

    priceUpdater();

    let interval = setInterval(priceUpdater, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Erc20Context.Provider value={{ tokens }}>{children}</Erc20Context.Provider>
  );
};

export const useErc20Context = (): { tokens: TokenStore } => {
  return useContext(Erc20Context);
};

import { Token, useConnector } from "@integrations-lib/core";
import BigNumber from "bignumber.js";
import React, { createContext, useCallback, useContext, useState } from "react";

import { toTokenUnitsBN } from "../utils";
import { ERC20ContractWrapper } from "../wrappers";
import { ERC20ContractsContext } from "./TokenInfoWrapper";

export interface Balance {
  value: BigNumber | undefined;
  isLoading: boolean;
}

interface TokenInfo {
  balance?: Balance;
  allowances?: Set<string>;
}

type TokenAddressToInfoMapping = {
  [key: string]: TokenInfo;
}

type TokenInfoPerChain = Partial<{
  [key: number]: TokenAddressToInfoMapping
}>

type TokenInfoPerAccount = {
  [key: string]: TokenInfoPerChain
}

export interface TokenInfoValues {
  getBalances: (...tokens: Array<Token>) => Array<Balance>;
  hasAllowance: (token: Token, spender: string) => boolean;
}

export const TokenInfoContext = createContext<TokenInfoValues>({
  getBalances: () => [],
  hasAllowance: () => false,
});

export interface TokenInfoProps {
  children: any;
}

export const TokenInfo = (props: TokenInfoProps) => {
  const [info, setInfo] = useState<TokenInfoPerAccount>({});

  const { getContract } = useContext(ERC20ContractsContext);

  const { account } = useConnector("metamask");

  const updateAllowance = useCallback(
    async (
      token: Token, spender: string
    ) => {
      if (!account) {
        throw Error("Token Info - Account undefined")
      }

      let contract = getContract(
        token.chainId,
        token.address
      ) as ERC20ContractWrapper;

      if (!contract) {
        console.warn("Token Info - updateAllowance - Contract undefined")
        return;
      }

      try {
        const hasAllowance = await contract.hasEnoughAllowance(
          account,
          spender
        );

        setInfo(info => {
          const allowances = info[account]?.[token.chainId]?.[token.address]?.allowances || new Set();
          const hadAllowance = allowances.has(spender);

          if (hadAllowance && !hasAllowance) {
            allowances.delete(spender);

            console.log(
              "Token Info - Allowance updated - Disallowed",
              {
                token,
                hadAllowance,
                hasAllowance,
                spender,
              }
            )
          } else if (!hadAllowance && hasAllowance) {
            allowances.add(spender);

            console.log(
              "Token Info - Allowance updated - Allowed",
              {
                token,
                hadAllowance,
                hasAllowance,
                spender,
              }
            )
          }

          return {
            ...info,
            [account]: {
              ...info[account],
              [token.chainId]: {
                ...info[account]?.[token.chainId],
                [token.address]: {
                  ...info[account]?.[token.chainId]?.[token.address],
                  allowances,
                }
              }
            }
          }
        });
      } catch {
        console.log(
          "Token Info - Could not update allowance",
          token
        );
      }
    },
    [account, getContract]
  )

  const updateBalance = useCallback(
    async (token: Token) => {
      if (!account) {
        throw Error("Token Info - Account undefined")
      }

      let contract = getContract(
        token.chainId,
        token.address
      );

      if (!contract) {
        console.warn("Token Info - updateBalance - Contract undefined")
        return;
      }

      try {
        setInfo(info => ({
          ...info,
          [account]: {
            ...info[account],
            [token.chainId]: {
              ...info[account]?.[token.chainId],
              [token.address]: {
                ...info[account]?.[token.chainId]?.[token.address],
                balance: {
                  value: info[account]?.[token.chainId]?.[token.address]?.balance?.value,
                  isLoading: true,
                }
              }
            }
          }
        }));

        const balance = await contract.readerContract.balanceOf(account);

        const balanceBN = toTokenUnitsBN(
          balance.toString(),
          token.decimals
        );

        setInfo(info => ({
          ...info,
          [account]: {
            ...info[account],
            [token.chainId]: {
              ...info[account]?.[token.chainId],
              [token.address]: {
                ...info[account]?.[token.chainId]?.[token.address],
                balance: {
                  value: balanceBN,
                  isLoading: false,
                }
              }
            }
          }
        }));

        console.log(
          "Token Info- Balance updated",
          {
            token,
            balanceBN,
          }
        )
      } catch {
        console.log(
          "Token Info- Could not update balance",
          token
        );
      }
    },
    [account, getContract]
  )

  const addAllowanceListeners = useCallback(
    (
      token: Token, spender: string
    ) => {
      if (!account) {
        throw Error("Token Info - Account undefined")
      }

      let contract = getContract(
        token.chainId,
        token.address
      ) as ERC20ContractWrapper;

      if (!contract) {
        console.warn("Token Info - addAllowanceListeners - Contract undefined")
        return;
      }

      const approvalEvent = contract.readerContract.filters.Approval(
        account,
        spender
      );

      contract.on(
        approvalEvent,
        () => {
          console.log(
            "Token Info - Listener executing - Tokens approved",
            { token }
          )

          updateAllowance(
            token,
            spender
          );
        }
      );

      console.log(
        "Token Info - Added allowance listener",
        { token }
      )
    },
    [account, getContract, updateAllowance]
  );

  const addBalanceListeners = useCallback(
    (token: Token) => {
      if (!account) {
        throw Error("Token Info - Account undefined")
      }

      let contract = getContract(
        token.chainId,
        token.address
      ) as ERC20ContractWrapper;

      if (!contract) {
        console.warn("Token Info - addBalanceListeners - Contract undefined")
        return;
      }

      const fromEvent = contract.readerContract.filters.Transfer(account);

      contract.on(
        fromEvent,
        () => {
          console.log(
            "Token Info - Listener executing - Tokens sent",
            { token }
          )

          updateBalance(token);
        }
      );

      const toEvent = contract.readerContract.filters.Transfer(
        null,
        account
      );

      contract.on(
        toEvent,
        () => {
          console.log(
            "Token Info - Listener executing - Tokens received",
            { token }
          )

          updateBalance(token);
        }
      );

      console.log(
        "Token Info - Added balance listener",
        { token }
      )
    },
    [account, getContract, updateBalance]
  );

  const getBalances = useCallback(
    (...tokens: Array<Token>) : Array<Balance> => {
      const result = tokens.map((token: Token) => {
        let balance = account && info[account]?.[token.chainId]?.[token.address]?.balance || undefined;

        if (balance === undefined) {
          if (account) {
            addBalanceListeners(token);
            updateBalance(token);
          }

          balance = {
            value: undefined,
            isLoading: !!account,
          }
        }

        return balance;
      });

      return result;
    },
    [account, addBalanceListeners, info, updateBalance]
  )

  const hasAllowance = useCallback(
    (
      token: Token, spender: string
    ) : boolean => {
      let allowances = account && info[account]?.[token.chainId]?.[token.address]?.allowances || undefined;

      if (allowances === undefined) {
        if (account) {
          addAllowanceListeners(
            token,
            spender
          );
          updateAllowance(
            token,
            spender
          );
        }

        allowances = new Set();
      }

      const value = allowances.has(spender);

      console.log(
        "Token Info - Get Allowance",
        {
          token,
          spender,
          value,
        }
      );

      return value;
    },
    [account, addAllowanceListeners, info, updateAllowance]
  )

  return (
    <TokenInfoContext.Provider
      value={{
        getBalances,
        hasAllowance,
      }}
    >
      {props.children}
    </TokenInfoContext.Provider>
  );
};
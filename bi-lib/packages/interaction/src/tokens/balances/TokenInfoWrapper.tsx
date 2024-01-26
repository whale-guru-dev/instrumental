import React, { Dispatch } from 'react';
import { AnyAction } from "redux";

import { createContractsContext, createContractsProvider } from '../../contracts';
import erc20Abi from "../abis/raw/erc20.json";
import { Erc20 } from '../abis/types/erc20';
import { ERC20ContractWrapper } from '../wrappers';
import { TokenInfo } from './TokenInfo';

export const ERC20ContractsContext = createContractsContext<Erc20>();
const ERC20ConctractsProvider = createContractsProvider<Erc20>();

export interface TokenBalancesWrapperProps {
  children: any;
  dispatch: Dispatch<AnyAction>;
}

export const TokenInfoWrapper = (props: TokenBalancesWrapperProps) =>
  <ERC20ConctractsProvider
    abi={erc20Abi}
    ContractsContext={ERC20ContractsContext}
    ContractsWrapperImplementation={ERC20ContractWrapper}
  >
    <TokenInfo>
      {props.children}
    </TokenInfo>
  </ERC20ConctractsProvider>
import { createContractsContext, createContractsProvider } from "@integrations-lib/interaction";

import sushiERC20Strategy from "../abis/raw/SushiERC20Strategy.json";
import { SushiERC20Strategy } from "../abis/types/SushiERC20Strategy";
import { SushiERC20StrategyContractWrapper } from "../contracts/wrappers/SushiERC20StrategyContractWrapper";

export const SushiERC20StrategyContractContext = createContractsContext<SushiERC20Strategy>();
const SushiERC20StrategyConctractsProvider = createContractsProvider<SushiERC20Strategy>();

export interface SushiERC20StrategyContractProviderProps {
  children: any;
}

export const SushiERC20StrategyContractProvider = (props: SushiERC20StrategyContractProviderProps) => {
  return (
    <SushiERC20StrategyConctractsProvider
      abi={sushiERC20Strategy}
      ContractsContext={SushiERC20StrategyContractContext}
      ContractsWrapperImplementation={SushiERC20StrategyContractWrapper}
    >
      {props.children}
    </SushiERC20StrategyConctractsProvider>
  );
}

import { createContractsContext, createContractsProvider } from "@integrations-lib/interaction";

import sushiSlpStrategy from "../abis/raw/SushiSlpStrategy.json";
import { SushiSlpStrategy } from "../abis/types/SushiSlpStrategy";
import { SushiSlpStrategyContractWrapper } from "../contracts/wrappers/SushiSlpStrategyContractWrapper";

export const SushiSlpStrategyContractContext = createContractsContext<SushiSlpStrategy>();
const SushiSlpStrategyConctractsProvider = createContractsProvider<SushiSlpStrategy>();

export interface SushiSlpStrategyContractProviderProps {
  children: any;
}

export const SushiSlpStrategyContractProvider = (props: SushiSlpStrategyContractProviderProps) => {
  return (
    <SushiSlpStrategyConctractsProvider
      abi={sushiSlpStrategy}
      ContractsContext={SushiSlpStrategyContractContext}
      ContractsWrapperImplementation={SushiSlpStrategyContractWrapper}
    >
      {props.children}
    </SushiSlpStrategyConctractsProvider>
  );
}

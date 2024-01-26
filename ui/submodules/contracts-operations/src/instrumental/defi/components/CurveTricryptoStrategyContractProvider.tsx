import { createContractsContext, createContractsProvider } from "@integrations-lib/interaction";

import curveTricryptoStrategyAbi from "../abis/raw/CurveTricryptoStrategy.json";
import { CurveTricryptoStrategy } from "../abis/types/CurveTricryptoStrategy";
import { CurveTricryptoStrategyContractWrapper } from "../contracts/wrappers/CurveTricryptoStrategyContractWrapper";

export const CurveTricryptoStrategyContractContext = createContractsContext<CurveTricryptoStrategy>();
const CurveTricryptoStrategyConctractsProvider = createContractsProvider<CurveTricryptoStrategy>();

export interface CurveTricryptoStrategyContractProviderProps {
  children: any;
}

export const CurveTricryptoStrategyContractProvider = (props: CurveTricryptoStrategyContractProviderProps) => {
  return (
    <CurveTricryptoStrategyConctractsProvider
      abi={curveTricryptoStrategyAbi}
      ContractsContext={CurveTricryptoStrategyContractContext}
      ContractsWrapperImplementation={CurveTricryptoStrategyContractWrapper}
    >
      {props.children}
    </CurveTricryptoStrategyConctractsProvider>
  );
}

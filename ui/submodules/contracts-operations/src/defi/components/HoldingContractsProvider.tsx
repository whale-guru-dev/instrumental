import { createContractsContext, createContractsProvider } from "@integrations-lib/interaction";

import holdingAbi from "../abis/raw/holding.json";
import { Holding } from "../abis/types/holding";
import { HoldingContractWrapper } from "../contracts/wrappers/HoldingContractWrapper";

export const HoldingContractsContext = createContractsContext<Holding>();
const HoldingConctractsProvider = createContractsProvider<Holding>();

export interface HoldingContractsProviderProps {
  children: any;
}

export const HoldingContractsProvider = (props: HoldingContractsProviderProps) => {
  return (
    <HoldingConctractsProvider
      abi={holdingAbi}
      ContractsContext={HoldingContractsContext}
      ContractsWrapperImplementation={HoldingContractWrapper}
    >
      {props.children}
    </HoldingConctractsProvider>
  );
}

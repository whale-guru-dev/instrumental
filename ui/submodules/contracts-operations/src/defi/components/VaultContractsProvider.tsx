import { createContractsContext, createContractsProvider } from "@integrations-lib/interaction";

import vaultAbi from "../abis/raw/vault.json";
import { Vault } from '../abis/types/vault';
import { VaultContractWrapper } from '../contracts/wrappers/VaultContractWrapper';

export const VaultContractsContext = createContractsContext<Vault>();
const VaultConctractsProvider = createContractsProvider<Vault>();

export interface VaultContractsProviderProps {
  children: any;
}

export const VaultContractsProvider = (props: VaultContractsProviderProps) => {
  return (
    <VaultConctractsProvider
      abi={vaultAbi}
      ContractsContext={VaultContractsContext}
      ContractsWrapperImplementation={VaultContractWrapper}
    >
      {props.children}
    </VaultConctractsProvider>
  );
}
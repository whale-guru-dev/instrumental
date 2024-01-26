import { useContext } from "react";

import { BlockchainProviderContext, SupportedBlockchainProvidersDescriptor } from "../context/BlockchainProviderContext";

export const useSupportedProviders = () : SupportedBlockchainProvidersDescriptor => {
  const { blockchainProviders } = useContext(BlockchainProviderContext);
  return blockchainProviders;
};
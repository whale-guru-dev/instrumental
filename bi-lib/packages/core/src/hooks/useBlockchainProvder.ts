import { useContext, useMemo } from "react";

import { BlockchainProviderContext, SupportedBlockchainProviderDescriptor } from "../context/BlockchainProviderContext";

export interface BlockchainProviderDescriptor extends SupportedBlockchainProviderDescriptor {
  isSupported: boolean;
}

export const useBlockchainProvider = (chainId: number | undefined) : BlockchainProviderDescriptor => {
  const { blockchainProviders } = useContext(BlockchainProviderContext);

  const provider : SupportedBlockchainProviderDescriptor | undefined = useMemo(
    () => chainId !== undefined && chainId in blockchainProviders && blockchainProviders[chainId] || undefined,
    [chainId, blockchainProviders]
  );

  return provider === undefined ? { isSupported: false } : {
    ...provider,
    isSupported: true
  };
};
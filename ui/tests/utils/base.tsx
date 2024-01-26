import React from "react";
import { Provider } from "react-redux";
import { Erc20ContextProvider } from "@/defi/Erc20Context";
import { store } from "@/store";
// import { getDefaultWeb3Library } from "@/defi";
// import { Web3ReactProvider } from "@web3-react/core";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "@/styles/theme";
import { ThemeProvider } from "@mui/material";
import { Chain } from "@integrations-lib/core";
import { InstrumentalNetworkTokenOperationsProviderWrapper } from "@/submodules/contracts-operations/src/instrumental";
import { SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";
import { contractAddresses } from "@/phase2/constants";

const myCache = createCache({
  key: "jest-environment",
  stylisPlugins: [],
});

export const AppWrapper: React.FC<{}> = ({ children }) => {
  const supportedChains = Object.values(
    SUPPORTED_NETWORKS,
  ) as unknown as Chain[];
  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={myCache}>
        <Provider store={store}>
          <InstrumentalNetworkTokenOperationsProviderWrapper
            supportedChains={supportedChains}
            contractAddresses={contractAddresses}
          >
            <Erc20ContextProvider
              tokensToWatch={[
                {
                  name: "STRM",
                  address: { 1: "0x00" },
                  symbol: "STRM",
                  decimals: 18,
                  staticPrice: 0.9,
                  tokenId: "strm",
                  coingeckoId: "instrumental-finance",
                },
                {
                  name: "ETH-STRM",
                  address: { 1: "0x00" },
                  symbol: "ETH-STRM",
                  decimals: 18,
                  staticPrice: 115,
                  tokenId: "eth_strm_lp",
                },
              ]}
            >
              {children}
            </Erc20ContextProvider>
          </InstrumentalNetworkTokenOperationsProviderWrapper>
        </Provider>
      </CacheProvider>
    </ThemeProvider>
  );
};
export * from "@testing-library/react";

import "@/assets/global.css";
import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "utils/createEmotionCache";
import { motion } from "framer-motion";
import { Provider } from "react-redux";
// import { Web3ReactProvider } from "@web3-react/core";
import { Chain } from "@integrations-lib/core";
import { store } from "store";
import { useRouter } from "next/router";
// import { getDefaultWeb3Library } from "@/defi";
import theme from "../styles/theme";
import { ConnectorSelection } from "@/defi/components/ConnectorSelection";
import { ConfirmationModal } from "@/defi/components/ConfirmationModal";
import { Erc20ContextProvider } from "@/defi/Erc20Context";
//import {VestingEsrowUpdater} from "@/defi/VestingEscrowUpdater";
//import Updater from "@/store/blockchain/updater";
import { ADDRESSES } from "@/defi/addresses";
//import {AirdropUpdater} from "@/defi/Airdrop";
import Updaters from "@/store/updaters";
import { AirdropModal } from "@/defi/components/AirdropModal";
import { TxSettingsModal } from "@/defi/components/TxSettingsModal";
import { TxConfirmationModal } from "@/defi/components/TxConfirmationModal";
import ContractsContextProvider from "@/defi/ContractsContext";

import { InstrumentalNetworkTokenOperationsProviderWrapper } from "@/submodules/contracts-operations/src/instrumental";
import { SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";
import { contractAddresses } from "@/phase2/constants";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const router = useRouter();
  const supportedChains = Object.values(
    SUPPORTED_NETWORKS,
  ) as unknown as Chain[];
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Instrumental Finance</title>
        <meta name="title" content="Instrumental Finance" />
        <meta
          name="description"
          content="Cross-layer arbitrage powering new opportunities in the DeFi space."
        />
        <meta
          name="keywords"
          content="defi, instruemtal, finance, crosschain"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Provider store={store}>
          <InstrumentalNetworkTokenOperationsProviderWrapper
            supportedChains={supportedChains}
            contractAddresses={contractAddresses}
          >
            <Erc20ContextProvider
              tokensToWatch={[
                {
                  name: "STRM",
                  address: ADDRESSES.strm,
                  symbol: "STRM",
                  decimals: 18,
                  staticPrice: 0.9,
                  tokenId: "strm",
                  coingeckoId: "instrumental-finance",
                },
                {
                  name: "ETH-STRM",
                  address: ADDRESSES.eth_strm_lp,
                  symbol: "ETH-STRM",
                  decimals: 18,
                  staticPrice: 115,
                  tokenId: "eth_strm_lp",
                },
              ]}
            >
              <ContractsContextProvider>
                <Updaters />
                <motion.div
                  key={router.route}
                  initial="pageInitial"
                  animate="pageAnimate"
                  variants={{
                    pageInitial: {
                      opacity: 0,
                    },
                    pageAnimate: {
                      opacity: 1,
                    },
                  }}
                >
                  <Component {...pageProps} />
                </motion.div>
                <ConnectorSelection />
                <ConfirmationModal />
                <AirdropModal />
                <TxSettingsModal />
                <TxConfirmationModal />
              </ContractsContextProvider>
            </Erc20ContextProvider>

            {/* <NotificationWrapper /> */}
          </InstrumentalNetworkTokenOperationsProviderWrapper>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

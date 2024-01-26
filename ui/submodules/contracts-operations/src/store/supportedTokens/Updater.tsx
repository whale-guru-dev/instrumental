import { Chain } from "@integrations-lib/core";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { APITokenSupportedAmms, getSupportedAmms, getSupportedTokens } from "../../api";
import { SupportedNetworkId } from "../../defi/constants";
import { updateSupportedAmms, updateSupportedTokens } from "./slice";

export interface TokensUpdaterProps {
  supportedChains: Array<Chain>;
}

export const TokensUpdater = (props: TokensUpdaterProps) => {
  const { supportedChains } = props;

  const dispatch = useDispatch();

  useEffect(
    () => {
      getSupportedTokens().then((supportedTokens: any) => {
        if (supportedTokens) {
          dispatch(updateSupportedTokens(supportedTokens));
        }
      });
    },
    [dispatch]
  );

  useEffect(
    () => {
      supportedChains.forEach((chain: Chain) => getSupportedAmms(chain.chainId as SupportedNetworkId).then((supportedAmms: APITokenSupportedAmms) => {
        if (supportedAmms) {
          dispatch(updateSupportedAmms({
            chainId: chain.chainId as SupportedNetworkId,
            ammsPerToken: supportedAmms.data
          }));
        }
      }))
    },
    [dispatch, supportedChains]
  );

  return null;
}

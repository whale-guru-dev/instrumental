import React, { useCallback } from "react";

import { useFrequencyUpdater } from "../../../hooks/useFrequencyUpdater";
import { TokenId, TokenPriceUpdaterFunction } from "../../../utils/types";
import { CustomTokenPriceUpdater, MoralisTokenPriceUpdater, UpdaterType } from "../elementary";

export type TokenPrices = {
  [tokenId: TokenId]: number | undefined;
}

interface CommonTokenPricesUpdaterProps {
  updater?: TokenPriceUpdaterFunction;
  frequency?: number;
  tokens: Array<TokenId>;
  setTokenPrices: React.Dispatch<React.SetStateAction<TokenPrices>>;
}

export interface PrivateTokenPricesUpdaterProps extends CommonTokenPricesUpdaterProps {
  apiKey: string;
  type: "moralis";
}

export interface PublicTokenPricesUpdaterProps extends CommonTokenPricesUpdaterProps {
  apiKey: never;
  type: Omit<UpdaterType, "moralis">;
}

export type TokenPricesUpdaterProps = PrivateTokenPricesUpdaterProps | PublicTokenPricesUpdaterProps;

export const TokenPricesUpdater = (props: TokenPricesUpdaterProps) => {
  const {
    apiKey,
    type,
    tokens,
    setTokenPrices,
    updater,
    frequency
  } = props;

  const rerenderSwitch = useFrequencyUpdater(frequency);
  console.log(
    'BI-LIB - Rerendering token price updater',
    rerenderSwitch
  );

  const updateTokenPrice = useCallback(
    (
      tokenId: TokenId | undefined, usdPrice: number | undefined
    ) => tokenId !== undefined && usdPrice !== undefined && setTokenPrices(tokenPrices => ({
      ...tokenPrices,
      [tokenId]: usdPrice,
    })),
    [setTokenPrices]
  )

  return (
    <React.Fragment>
      {type === 'moralis' && tokens.map((tokenId: TokenId) =>
        <MoralisTokenPriceUpdater
          apiKey={apiKey}
          tokenId={tokenId}
          saveTokenPrice={updateTokenPrice}
        />)}

      {type === 'custom' && tokens.map((tokenId: TokenId) =>
        <CustomTokenPriceUpdater
          tokenId={tokenId}
          saveTokenPrice={updateTokenPrice}
          updater={updater}
        />)
      }
    </React.Fragment>
  )
}
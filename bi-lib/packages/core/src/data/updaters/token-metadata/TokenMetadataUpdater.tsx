import React from "react";

import { useFrequencyUpdater } from "../../../hooks/useFrequencyUpdater";
import { Token, TokenId, TokensMetadataSaveFunction, TokensMetadataUpdaterFunction } from "../../../utils/types";
import { BitqueryTokenMetadataUpdater, CustomTokenMetadataUpdater, MoralisTokenMetadataUpdater, UpdaterType } from "../elementary";

export type TokenMetadata = {
  [tokenId: TokenId]: Token | undefined;
}

interface CommonTokenMetadataUpdaterProps {
  updater?: TokensMetadataUpdaterFunction;
  frequency?: number;
  tokenIds: Array<TokenId>;
  saveTokensMetadata: TokensMetadataSaveFunction;
}

export interface PrivateTokenMetadataUpdaterProps extends CommonTokenMetadataUpdaterProps {
  apiKey: string;
  type: "moralis";
}

export interface PublicTokenMetadataUpdaterProps extends CommonTokenMetadataUpdaterProps {
  apiKey: never;
  type: Omit<UpdaterType, "moralis">;
}

export type TokenMetadataUpdaterProps = PrivateTokenMetadataUpdaterProps | PublicTokenMetadataUpdaterProps;

export const TokenMetadataUpdater = (props: TokenMetadataUpdaterProps) => {
  const {
    apiKey,
    type,
    tokenIds,
    saveTokensMetadata,
    updater,
    frequency,
  } = props;

  const rerenderSwitch = useFrequencyUpdater(frequency);
  console.log(
    'BI-LIB - Rerendering token metadata updater',
    rerenderSwitch
  );

  return (
    <React.Fragment>
      {type === 'bitquery' &&
      <BitqueryTokenMetadataUpdater
        tokenIds={tokenIds}
        saveTokensMetadata={saveTokensMetadata}
      />
      }

      {type === 'custom' &&
      <CustomTokenMetadataUpdater
        tokenIds={tokenIds}
        saveTokensMetadata={saveTokensMetadata}
        updater={updater}
      />
      }

      {type === 'moralis' &&
      <MoralisTokenMetadataUpdater
        apiKey={apiKey}
        tokenIds={tokenIds}
        saveTokensMetadata={saveTokensMetadata}
      />
      }
    </React.Fragment>
  )
}
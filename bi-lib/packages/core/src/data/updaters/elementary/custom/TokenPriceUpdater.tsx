import { TokenId, TokenPriceSaveFunction, TokenPriceUpdaterFunction } from "../../../../utils/types"

export interface TokenPriceUpdaterProps {
    tokenId: TokenId;
    saveTokenPrice: TokenPriceSaveFunction;
    updater: TokenPriceUpdaterFunction | undefined;
}

export const TokenPriceUpdater = (props: TokenPriceUpdaterProps) => {
  const {
    tokenId,
    saveTokenPrice,
    updater,
  } = props;

  const tokenPrice = updater !== undefined ? updater(tokenId) : undefined;

  saveTokenPrice(
    tokenId,
    tokenPrice
  )

  return null;
}
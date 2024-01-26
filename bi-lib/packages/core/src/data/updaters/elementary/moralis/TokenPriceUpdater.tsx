import {
  TokenId,
  TokenPriceSaveFunction,
  unpackTokenId
} from "../../../../utils"

export interface TokenPriceUpdaterProps {
  apiKey: string;
  tokenId: TokenId;
  saveTokenPrice: TokenPriceSaveFunction;
}

export const TokenPriceUpdater = (props: TokenPriceUpdaterProps) => {
  const {
    apiKey,
    tokenId,
    saveTokenPrice,
  } = props;

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set(
    'Content-Type',
    'application/json'
  );
  requestHeaders.set(
    'X-API-Key',
    apiKey
  );

  const {
    address,
    chainId,
  } = unpackTokenId(tokenId);

  const moralisApiEndpoint = `https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=0x${chainId.toString(16)}`;

  fetch(
    moralisApiEndpoint,
    { headers: requestHeaders }
  ).then(res => res.json()).then(data => {
    const { usdPrice } = data;

    saveTokenPrice(
      tokenId,
      usdPrice
    );
  })

  return null;
}
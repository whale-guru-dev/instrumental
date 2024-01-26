import { Dispatch, useContext, useEffect, useState } from "react";
import { useAppDispatch } from "store/index";
import {
  getToken,
  getTokenIds,
  tokenIdsArray,
  tokensArray,
} from "defi/tokenInfo";
import { ContractsContext } from "defi/ContractsContext";
import axios from "axios";
import { AnyAction } from "redux";
import { getAllowances } from "defi/allowances";
import { useBlockNumber } from "store/blockchain/hooks";
import { ADDRESSES, ERC20Addresses } from "defi/addresses";
import { SupportedNetworks } from "defi/types";
import { isValidNetwork } from "defi";
import { resetBalances, updatePrice } from "./slice";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const getPricesFromGecko = (dispatch: Dispatch<AnyAction>) => {
  const tokenIds = [...new Set(tokensArray)]
    .filter((x) => x.pricing && x.pricing.geckoApiId)
    .map((x) => x.pricing!.geckoApiId)
    .join(",");

  tokenIdsArray.forEach((tokenId) => {
    const token = getToken(tokenId);
    if (token.pricing && token.pricing.static) {
      dispatch(
        updatePrice({
          tokenId,
          price: token.pricing.static,
        }),
      );
    }
  });

  axios
    .get(`${COINGECKO_BASE_URL}/simple/price?`, {
      params: {
        ids: tokenIds,
        vs_currencies: "usd",
      },
    })
    .then((prices) => {
      const arr = Object.entries(prices.data).map((x) => x);
      const geckoPrices = (
        [...new Set(arr)] as [string, { usd: number }][]
      ).map((x) => {
        return { geckoApiId: x[0], price: x[1].usd, tokenSymbol: "" };
      });

      for (let i = 0; i < geckoPrices.length; i++) {
        const geckoPrice = geckoPrices[i];
        const foundTokens = getTokenIds(geckoPrice.geckoApiId);
        if (foundTokens.length) {
          foundTokens.forEach((token) => {
            dispatch(
              updatePrice({
                tokenId: token,
                price: getToken(token).isSc ? 1 : geckoPrice.price,
              }),
            );
          });
        }
      }
    });
};

export default function Updater(): null {
  const dispatch = useAppDispatch();
  const { contracts, account, chainId } = useContext(ContractsContext);
  const currentBlock = useBlockNumber().blockNumber;
  const [lastUpdateBlock, setLastUpdateBlock] = useState(0);

  useEffect(() => {
    getPricesFromGecko(dispatch);

    const priceUpdaterTimer = setInterval(() => {
      getPricesFromGecko(dispatch);
    }, 120000);

    const intervalId: number = parseInt(priceUpdaterTimer.toString());

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!currentBlock || !contracts || !chainId || !isValidNetwork(chainId)) {
      dispatch(resetBalances());
      setLastUpdateBlock(0);
      return undefined;
    }
    if (lastUpdateBlock + 3 <= currentBlock) {
      setLastUpdateBlock(currentBlock);
      for (let i = 0; i < tokenIdsArray.length; i++) {
        const tokenId = tokenIdsArray[i];
        if (getToken(tokenId).noBalance) {
          continue;
        }

        if (tokenId === "eth") {
          contracts.raw.update().balance();
        } else {
          if (
            !ADDRESSES[tokenId as ERC20Addresses][chainId as SupportedNetworks]
              .length
          ) {
            continue;
          }
          const c = contracts.erc20.update({
            contract: tokenId as ERC20Addresses,
          });

          c.balance();
          getAllowances(tokenId, chainId as SupportedNetworks).forEach(
            (allowance) => c.allowance(allowance),
          );
        }
      }
    }

    return () => {};
  }, [contracts, account, currentBlock]);

  return null;
}

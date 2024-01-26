import { TokenId } from "defi/tokenInfo";
import { useAppSelector } from "store";
import { selectAllTokens, UserDataToken } from "store/userdata/slice";
import { BigNumber as BN } from "bignumber.js";

type PartialRecord<K extends string | number | symbol, T> = { [P in K]?: T };

export const useTokenData = (tokenId: TokenId | TokenId[]) => {
  //const { account, library, chainId } = useContext(ContractsContext)

  const tokens = useAppSelector(selectAllTokens);

  const selectedTokens = () => {
    let r: PartialRecord<TokenId, UserDataToken> = {};

    if (!Array.isArray(tokenId)) {
      tokenId = [tokenId];
    }

    tokenId.forEach((token) => {
      if (token in tokens) {
        r[token] = tokens[token];
      }
    });

    return r;
  };

  return selectedTokens();
};

export const useTokenDataSingle = (tokenId: TokenId) => {
  const tokens = useAppSelector(selectAllTokens);
  return tokens[tokenId];
};

// PORTFOLIO

export const useBalanceUsdMultiple = (tokenIds: TokenId[]): number => {
  const tokens = useAppSelector(selectAllTokens);

  const selectedTokens = () => {
    let r = 0;

    tokenIds.forEach((token) => {
      if (token in tokens) {
        r += new BN(tokens[token].balance)
          .multipliedBy(tokens[token].price)
          .toNumber();
      }
    });

    return parseFloat(r.toFixed(2));
  };

  return selectedTokens();
};

import { SpacedCardHeader } from "../../shared/SpacedCardHeader";
import { SELECT_TOKEN_LABEL } from "../constants";
import { SearchInput } from "../Partials/SearchInput";
import { PinnedListItem } from "../Partials/PinnedListItem";
import { Box, Card, debounce, List } from "@mui/material";
import { SelectableListItem } from "../Partials/SelectableListItem";
import React, { FC, useCallback, useMemo, useState } from "react";
import { ControlledProps, UIStates } from "../../shared/types";
import { ListItemsSkeletonLoader } from "../Partials/ListItemsSkeletonLoader";
import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { tokenContractAddressLength } from "@/phase2/constants";
import { getTokenId } from "@integrations-lib/core";

const nativeTokenFilter = (s: string, t: Token) =>
  s.length === 0 ||
  t.symbol?.toLowerCase().startsWith(s.toLowerCase()) ||
  t.address?.toLowerCase().startsWith(s.toLowerCase());

export type NativeTokenSelectorProps = ControlledProps<Token> & {
  value: Token | undefined;
  tokens: Token[];
  getTokens: (s: string) => Promise<Token[]>;
  closeDialog: () => void;
  onCustomTokenModification: (token: Token) => void;
};

export const NativeTokenSelector: FC<NativeTokenSelectorProps> = ({
  value,
  onChange,
  onCustomTokenModification,
  tokens,
  getTokens,
  closeDialog,
}) => {
  const [keyword, setKeyword] = useState("");
  const [apiResult, setAPIResult] = useState<Token[]>([]);

  const isSelectedTokenFilter = useCallback(
    (t: Token) => value && getTokenId(t) === getTokenId(value),
    [value],
  );

  const availableToSelectTokens = useMemo(
    () =>
      tokens.reduce<Token[]>(
        (tempList, t) =>
          nativeTokenFilter(keyword, t) && !isSelectedTokenFilter(t)
            ? [...tempList, t]
            : tempList,
        [],
      ),
    [tokens, keyword, isSelectedTokenFilter],
  );

  const tokenOptions = [...apiResult, ...availableToSelectTokens];
  const [currentUI, setCurrentUI] = useState<UIStates>(UIStates.Idle);

  const handleReset = useCallback(() => {
    setCurrentUI(UIStates.Idle);
    setAPIResult([]);
    setKeyword("");
  }, []);

  const fetchTokens = useCallback(
    async (value: string) => {
      if (
        value.length !== tokenContractAddressLength ||
        value.substring(0, 2) !== "0x"
      )
        return;
      setCurrentUI(UIStates.Loading);
      let addressFound = tokens.find((t) => t.address === value);
      if (addressFound) {
        setAPIResult([addressFound]);
        setCurrentUI(UIStates.Idle);
      } else {
        setAPIResult(await getTokens(value));
      }
      setCurrentUI(UIStates.Idle);
    },
    [tokens, getTokens],
  );

  const fetchTokensDebounced = debounce(fetchTokens, 300);

  const handleSearch = useCallback(
    (value: string) => {
      setKeyword(value);
      fetchTokensDebounced(value);
    },
    [fetchTokensDebounced],
  );

  return (
    <Card sx={{ borderWidth: 0 }}>
      <SpacedCardHeader title={SELECT_TOKEN_LABEL} />

      <SearchInput
        value={keyword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleSearch(e.target.value)
        }
        onReset={handleReset}
        placeholder={"Search or enter token address"}
      />

      {value && (
        <PinnedListItem
          key={value.symbol}
          token={value}
          onTokenSelect={closeDialog}
          onCustomTokenModification={onCustomTokenModification}
        />
      )}
      {currentUI === UIStates.Idle && (
        <List
        // sx={{
        //   paddingLeft: '24px',
        //   paddingRight: '24px'
        // }}
        >
          <Box
            sx={{
              maxHeight: "40vh",
              overflowY: "auto",
            }}
          >
            {tokenOptions.map((token, index) => (
              <SelectableListItem
                key={index}
                token={token}
                onTokenSelect={onChange}
                onCustomTokenModification={onCustomTokenModification}
                selected={value?.symbol === token.symbol}
              />
            ))}
          </Box>
        </List>
      )}
      {UIStates.Loading === currentUI && <ListItemsSkeletonLoader count={3} />}
    </Card>
  );
};

import React, {
  useCallback,
  // useEffect,
  useState,
  VoidFunctionComponent,
} from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import { SELECT_AMM_LABEL } from "../constants";
import { PinnedListItem } from "./PinnedListItem";
import Image from "next/image";
import { SearchInput } from "./SearchInput";
import { Add, DeleteOutline } from "@mui/icons-material";
import { SpacedCardHeader } from "../../shared/SpacedCardHeader";
import {
  SupportedAmm,
  Token,
  updateCustomToken,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { iconButtonOverrides, sameAmm } from "../../shared/utils";
import { useTheme } from "@mui/material/styles";
import { AMMNotfound } from "@/components/MegaSelector/shared/AMMNotfound";
import { useAppDispatch } from "@/store";

const AMMActionButton: VoidFunctionComponent<{
  onAdd: (a: SupportedAmm) => void;
  onRemove: (a: SupportedAmm) => void;
  value: Token;
  amm: SupportedAmm;
}> = ({ onAdd, onRemove, value, amm }) => {
  const theme = useTheme();
  if (value.amms.some(sameAmm(amm))) {
    return (
      <IconButton sx={iconButtonOverrides(theme)} onClick={() => onRemove(amm)}>
        <DeleteOutline />
      </IconButton>
    );
  }

  return (
    <IconButton sx={iconButtonOverrides(theme)} onClick={() => onAdd(amm)}>
      <Add />
    </IconButton>
  );
};

export const AMMSelector: VoidFunctionComponent<{
  value: Token;
  onChange: (t: Token) => void;
  onBackButtonClick: () => void;
  ammList: SupportedAmm[];
}> = ({ value, onBackButtonClick, onChange, ammList }) => {
  const dispatch = useAppDispatch();

  const [keyword, setKeyword] = useState("");
  const handleSelect = (supportedAmm: SupportedAmm) => {
    const token = {
      ...value,
      amms: [...value.amms, supportedAmm],
    };

    onChange(token);
    dispatch(updateCustomToken(token));
  };
  const handleRemove = (supportedAmm: SupportedAmm) => {
    const token = {
      ...value,
      amms: value.amms.filter((b) => b.ammId !== supportedAmm.ammId),
    };

    onChange(token);
    dispatch(updateCustomToken(token));
  };

  const handleSearch = useCallback((e: any) => setKeyword(e.target.value), []);

  const resetKeyword = useCallback(() => handleSearch(""), [handleSearch]);

  const filteredAMMs = ammList.filter((a) =>
    a.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <List>
      <SpacedCardHeader
        title={SELECT_AMM_LABEL}
        onBackButtonClick={onBackButtonClick}
      />

      <SearchInput
        onChange={handleSearch}
        onReset={resetKeyword}
        value={keyword}
        placeholder="Search"
      />

      <PinnedListItem
        isReadonly
        token={value}
        onCustomTokenModification={onChange}
      />

      {filteredAMMs.map((ammItem) => (
        <ListItem key={ammItem.ammId}>
          <ListItemIcon>
            <Image
              src={ammItem.image}
              alt={ammItem.ammId}
              width={24}
              height={24}
            />
          </ListItemIcon>
          <Stack width="100%">
            <Typography variant="body2">{ammItem.name}</Typography>
            {ammItem.isRecommended && (
              <Typography variant="caption" color="text.secondary">
                Recommended
              </Typography>
            )}
          </Stack>
          <Box display="flex" gap={2}>
            <AMMActionButton
              amm={ammItem}
              value={value}
              onAdd={handleSelect}
              onRemove={handleRemove}
            />
          </Box>
        </ListItem>
      ))}
      {filteredAMMs.length === 0 && <AMMNotfound />}
    </List>
  );
};

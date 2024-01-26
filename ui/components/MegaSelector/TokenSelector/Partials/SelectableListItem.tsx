import { Box, ListItem, ListItemProps, Stack } from "@mui/material";
import React, { FC } from "react";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { listItemStyleOverrides, shortenEvmAddress } from "../../shared/utils";
import { Help } from "@mui/icons-material";
import { TokenDescription } from "./TokenDescription";
import { SquashedAMMIcons } from "./SquashedAMMIcons";
import { CustomTokenCTA } from "./CustomTokenCTA";
import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";

export const SelectableListItem: FC<
  ListItemProps & {
    onTokenSelect?: (token: Token) => void;
    onCustomTokenModification: (token: Token) => void;
    token: Token;
    isReadonly?: boolean;
  }
> = ({
  token,
  onCustomTokenModification,
  onTokenSelect,
  isReadonly = false,
  ...props
}) => {
  const handleSelect = () => onTokenSelect?.(token);
  const handleCustomTokenModification = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    onCustomTokenModification(token);
  };
  const shortened = shortenEvmAddress(token.address);
  const theme = useTheme();
  if (!token) return null;
  return (
    <ListItem
      onClick={handleSelect}
      sx={listItemStyleOverrides(theme)}
      {...props}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Stack direction="row" gap={2}>
          <Box>
            {(token.image && (
              <Image
                width={24}
                height={24}
                src={token.image}
                alt={token.symbol}
              />
            )) || <Help />}
          </Box>
          <TokenDescription
            symbol={token.symbol}
            shortened={shortened}
            theme={theme}
            provider={token.provider}
          />
        </Stack>

        <Box aria-label="Token operations">
          <SquashedAMMIcons theme={theme} amms={token.amms} />
        </Box>

        <CustomTokenCTA
          provider={token.provider}
          readonly={isReadonly}
          address={token.address}
          theme={theme}
          onClick={handleCustomTokenModification}
        />
      </Box>
    </ListItem>
  );
};

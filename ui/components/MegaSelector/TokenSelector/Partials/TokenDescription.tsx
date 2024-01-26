import React, { FC } from "react";
import { alpha, Stack, Theme, Typography } from "@mui/material";
import {
  TokenProvider,
  TokenProviders,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";

export const TokenDescription: FC<{
  symbol: string;
  shortened: string;
  theme: Theme;
  provider: TokenProvider;
}> = ({ symbol, shortened, theme, provider }) => (
  <Stack>
    <Typography variant="body2" color="text.white">
      {symbol}({shortened})
    </Typography>
    <Typography
      paragraph
      variant="caption"
      color={alpha(theme.palette.common.white, 0.6)}
      sx={{ marginBottom: 0 }}
    >
      {TokenProviders[provider]}
    </Typography>
  </Stack>
);

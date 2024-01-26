import { IconButton, Link, Stack, Theme } from "@mui/material";
import { Add, OpenInNew } from "@mui/icons-material";
import { iconButtonOverrides } from "../../shared/utils";
import { FC } from "react";
import { TokenProvider } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";

interface CustomTokenCTAParams {
  provider: TokenProvider;
  readonly: boolean | undefined;
  address: string;
  theme: Theme;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const CustomTokenCTA: FC<CustomTokenCTAParams> = ({
  provider,
  readonly,
  address,
  theme,
  onClick,
}) => (
  <>
    {provider === "custom" && !readonly && (
      <Stack direction="row">
        <Link
          component={IconButton}
          href={`https://etherscan.io/token/${address}`}
          target="_blank"
          rel="noreferer noopener nofollow"
          sx={iconButtonOverrides(theme)}
        >
          <OpenInNew />
        </Link>
        <IconButton
          color="primary"
          onClick={onClick}
          sx={iconButtonOverrides(theme)}
        >
          <Add />
        </IconButton>
      </Stack>
    )}
  </>
);

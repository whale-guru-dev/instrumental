import React, { FC } from "react";
import { Box, Theme } from "@mui/material";
import { SupportedAmm } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import Image from "next/image";

export const SquashedAMMIcons: FC<{
  theme: Theme;
  amms: Readonly<Array<SupportedAmm>>;
}> = ({ amms, theme }) => (
  <Box
    sx={{
      display: "flex",
      "& span:not(:first-of-type)": {
        marginLeft: `${theme.spacing(-0.5)}!important`,
      },
    }}
  >
    {amms.map((amm) => (
      <Image
        alt={amm.name}
        src={amm.image}
        width={24}
        height={24}
        key={amm.ammId}
      />
    ))}
  </Box>
);

import { alpha, Stack, Typography } from "@mui/material";
import React, { VoidFunctionComponent } from "react";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";

export const AMMNotfound: VoidFunctionComponent = () => {
  const theme = useTheme();
  return (
    <Stack alignItems="center" sx={{ paddingY: "10vh" }} gap={3}>
      <Image
        src="/images/lemonade.svg"
        alt="Not found image indicator"
        width={120}
        height={120}
      />
      <Typography
        variant="body2"
        color={alpha(theme.palette.common.white, 0.6)}
      >
        Results not found
      </Typography>
    </Stack>
  );
};

import React, { FC } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

import Spacer from "@/components/Spacer";

const SwapDetails: FC = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: alpha("#7844e6", 0.1),
        px: theme.spacing(3),
        py: theme.spacing(4),
      }}
    >
      <Typography textAlign="center" variant="h3" fontFamily="BIN Regular">
        Details
      </Typography>

      <Spacer mt={4} />

      <Stack spacing={2}>{children}</Stack>
    </Box>
  );
};

export default SwapDetails;

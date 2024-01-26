import { Box, Typography } from "@mui/material";

import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export type WarningProps = {
  title?: string;
  caution?: boolean;
};

const Warning = ({ title, caution }: WarningProps) => {
  return (
    <Box
      px={3}
      py={2}
      borderRadius={1}
      bgcolor={caution ? "other.alert.primary10" : "other.background.n5"}
      display="flex"
      alignItems="center"
    >
      <ErrorOutlineIcon color="error" />
      <Typography ml={2}>{title}</Typography>
    </Box>
  );
};

export default Warning;

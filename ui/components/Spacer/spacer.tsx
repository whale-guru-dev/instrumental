import { Box } from "@mui/material";
import { BoxProps } from "@mui/system";
import React from "react";

export const Spacer: React.FC<BoxProps> = (props) => {
  return <Box {...props} />;
};

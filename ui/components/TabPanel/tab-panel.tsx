import { Box } from "@mui/material";
import { BoxProps } from "@mui/system";
import React from "react";

type TabPanelProps = BoxProps & {
  index: number;
  value: number;
};

export const TabPanel = ({
  value,
  index,
  children,
  ...other
}: TabPanelProps): JSX.Element => {
  return (
    <Box hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};

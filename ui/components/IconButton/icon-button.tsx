import React, { FC } from "react";
import { Box, Button, ButtonProps } from "@mui/material";

interface IconButtonProps extends ButtonProps {
  padding?: string;
  width?: string;
  height?: string;
  noMargin?: boolean;
  Icon: React.ReactNode;
}

export const IconButton: FC<IconButtonProps> = ({
  padding = "0px",
  width = "40px",
  height = "40px",
  noMargin,
  Icon,
  ...props
}) => {
  return (
    <Box mb={noMargin ? 0 : "10px"}>
      <Button
        {...props}
        variant="outlined"
        color="primary"
        sx={{
          padding: padding,
          width: width,
          height: height,
        }}
      >
        {Icon}
      </Button>
    </Box>
  );
};

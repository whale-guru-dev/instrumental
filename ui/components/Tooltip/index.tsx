import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import React from "react";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    sx={{ cursor: "pointer" }}
    {...props}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#342a3c",
    color: theme.palette.text.primary,
    maxWidth: "revert",
    lineHeight: theme.spacing(4),
    padding: theme.spacing(4, 6),
    textAlign: "center",
    boxShadow: `0 17px 32px 0 rgba(0, 0, 0, 0.25)`,
  },
}));

export default LightTooltip;

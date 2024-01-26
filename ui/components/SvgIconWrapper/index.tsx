import { FC, ReactNode } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

interface SvgProps extends SvgIconProps {
  fillColor?: string;
  hoverColor?: string;
  icon: ReactNode;
}

const SvgIconWrapper: FC<SvgProps> = ({
  icon,
  fillColor = "text.tertiary",
  hoverColor = "text.primary",
  ...props
}) => {
  return (
    <SvgIcon
      {...props}
      sx={{
        display: "flex",
        alignItems: "center",
        color: fillColor,
        "&:hover": {
          color: `${hoverColor}`,
          cursor: "pointer",
        },
      }}
    >
      {icon}
    </SvgIcon>
  );
};

export default SvgIconWrapper;

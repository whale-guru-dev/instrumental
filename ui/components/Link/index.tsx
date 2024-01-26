import { FC } from "react";
import Typography from "@mui/material/Typography";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";

interface LinkProps extends MuiLinkProps {
  isExternal?: boolean;
}

const Link: FC<LinkProps> = ({ href, children, isExternal, ...props }) => {
  return (
    <MuiLink
      href={href}
      sx={{
        "&:hover": {
          backgroundColor: isExternal ? "inherit" : "action.hover",
          cursor: isExternal ? "default" : "pointer",
        },
      }}
      target={isExternal ? "_blank" : "_self"}
      {...props}
    >
      <Typography variant="h6" sx={{ color: "text.accent" }}>
        {children}
      </Typography>
    </MuiLink>
  );
};

export default Link;

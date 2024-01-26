import { Theme } from "@/styles/theme";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { Box, Link } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React, { FC } from "react";

interface BreadcrumbLink {
  to: string;
  text: string;
}

export type BreadcrumbProps = {
  link: BreadcrumbLink;
};

const useStyles = makeStyles<Theme>((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      "& svg": {
        color: theme.palette.common.white,
      },
    },
    link: {
      fontWeight: "normal",
      textDecoration: "none",
      paddingRight: 0,
      display: "flex",
    },
    icon: {
      fill: theme.palette.text.accent,
    },
    text: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      fontWeight: "normal",
      textOverflow: "ellipsis",
      color: theme.palette.common.white,
    },

    [`@media (min-width: 1600px)`]: {
      text: {
        width: 600,
      },
    },
    [`@media (min-width: 1280px) and (max-width: 1600px)`]: {
      text: {
        width: 285,
      },
    },
  }),
);

const Breadcrumb: FC<BreadcrumbProps> = ({ link }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Link href={link.to} key={link.text} className={classes.link}>
        <NavigateBeforeIcon className={classes.icon} fontSize="small" />
        Back to {link.text}
      </Link>
    </Box>
  );
};

export default Breadcrumb;

import React from "react";
import IconButton from "@mui/material/IconButton";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

const COLORS = {
  gray: "rgba(255, 255, 255, 0.2)",
  green: "#69F177",
  red: "#FF4343",
  blue: "#43A5FF",
  purple: "#6D3ED1",
};

type OpenLinkProps = {
  color?: keyof typeof COLORS;
  link?: string;
};

const OpenLink = ({ color = "gray", link }: OpenLinkProps) => {
  return (
    <IconButton onClick={() => (link ? window.open(link, "_blank") : null)}>
      <OpenInNewRoundedIcon sx={{ color: COLORS[color] }} />
    </IconButton>
  );
};

export default OpenLink;

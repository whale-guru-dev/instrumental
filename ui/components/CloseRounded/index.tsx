import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/CloseRounded";

const COLORS = {
  gray: "rgba(255, 255, 255, 0.2)",
  green: "#69F177",
  red: "#FF4343",
  blue: "#43A5FF",
};

type CloseRoundedProps = {
  color: keyof typeof COLORS;
};

const CloseRounded = ({ color }: CloseRoundedProps) => {
  return (
    <IconButton>
      <CloseIcon sx={{ color: COLORS[color] }} />
    </IconButton>
  );
};

export default CloseRounded;

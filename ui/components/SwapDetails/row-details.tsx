import React, { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

type SwapDetailsRowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  valueDetail?: React.ReactNode;
  bgColor?: string;
  image?: string;
};

const SwapDetailsRow: FC<SwapDetailsRowProps> = ({
  label,
  value,
  valueDetail = null,
  bgColor = null,
  image = null,
}) => {
  return (
    <Box
      height={bgColor ? "87px" : "70px"}
      px="1.5rem"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: bgColor ? bgColor : "inherit",
      }}
    >
      {image && <Image src={image} width={24} height={24} alt="" />}
      <Typography sx={{ float: "left" }} variant="h6" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ float: "right" }} textAlign="right">
        <Typography variant="h6" color="text.primary">
          {value}
        </Typography>
        {valueDetail && (
          <Typography variant="body2" color="text.secondary">
            {valueDetail}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SwapDetailsRow;

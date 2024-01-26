import React, { FC } from "react";
import { Box, Typography, styled } from "@mui/material";

import DefiIcon from "components/DefiIcon";

const MuiBox = styled(Box)(() => ({
  display: "grid",
  alignItems: "center",
  marginRight: "1rem",
}));

type SwapTokenProps = {
  symbol?: string;
  icon?: React.ReactNode;
};

const SwapToken: FC<SwapTokenProps> = ({ symbol, icon }) => {
  return (
    <Box display="flex" alignItems="center">
      <MuiBox>
        <DefiIcon width={24} height={24} icon={icon} />
      </MuiBox>
      <MuiBox>
        <Typography variant="h6" color="text.primary">
          {symbol}
        </Typography>
      </MuiBox>
      <MuiBox>
        <Typography variant="body2" color="text.primary" mb="2px" fontSize={16}>
          received
        </Typography>
      </MuiBox>
    </Box>
  );
};

export default SwapToken;

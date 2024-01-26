import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const EmptyComponent: React.FC = () => null;

type TokenProps = {
  headingIcon?: React.ElementType;
  symbol?: string;
};

const Token: React.FC<TokenProps> = ({ headingIcon, symbol }) => {
  const HeadingIcon = headingIcon || EmptyComponent;

  return (
    <Box display="flex" alignItems="center">
      <HeadingIcon />
      {symbol && (
        <Typography variant="h6" ml={!!headingIcon ? 1 : 0}>
          {symbol}
        </Typography>
      )}
    </Box>
  );
};
export default Token;

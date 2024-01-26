import { inst } from "@/assets/tokens";
import { Token } from "@/defi/tokenInfo";
import { alpha, Paper, styled, Typography } from "@mui/material";
import React from "react";

const ContainerPaper = styled(Paper)(({ theme }) => ({
  border: `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1),
}));

type ContainerProps = {
  amount: string;
  token: Token;
};

export const Container: React.FC<ContainerProps> = ({ amount, token }) => {
  const CurrentNetwork = (inst as any) ?? <></>;
  return (
    <ContainerPaper variant="outlined" color="primary">
      <CurrentNetwork width="24" height="24" />
      <Typography variant="h5" color="common.white" textAlign="center">
        {amount}
      </Typography>
      <Typography variant="h5" color="text.secondary" textAlign="center">
        {token.symbol}
      </Typography>
    </ContainerPaper>
  );
};

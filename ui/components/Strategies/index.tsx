import { FC } from "react";
import { Stack, Typography } from "@mui/material";
import { tokens } from "@/defi/tokenInfo";
import DefiIcon from "@/components/DefiIcon";
import { ERC20Addresses } from "@/defi/addresses";

interface StrategyProps {
  name: ERC20Addresses;
}

const Strategy: FC<StrategyProps> = ({ name }) => {
  const strategy = tokens[name];
  return (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <DefiIcon height={40} width={40} icon={strategy.picture} />
        <Typography
          fontFamily="BIN Regular"
          variant="h2"
          sx={{
            position: "relative",
            top: -26,
          }}
        >
          {strategy.symbol}
        </Typography>
      </Stack>
    </>
  );
};

export default Strategy;

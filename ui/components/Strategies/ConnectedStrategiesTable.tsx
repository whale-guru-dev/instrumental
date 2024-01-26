import Spacer from "@/components/Spacer";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Table, { TableData } from "@/components/Table";
import { FC } from "react";

type ConnectedStrategiesTableProps = {
  strategies: TableData[];
  headers: Record<string, string>[];
  active: boolean;
};

export const ConnnectedStrategiesTable: FC<ConnectedStrategiesTableProps> = ({
  headers,
  strategies,
  active,
}) => {
  if (!active) {
    return null;
  }
  return (
    <Grid item xs={12} mt={12.5}>
      <Box px="20px">
        <Stack spacing={3.5}>
          <Typography variant="h3" fontFamily="BIN Regular">
            Strategies
          </Typography>
          <Typography variant="h6" color="GrayText">
            Deposit to start earning
          </Typography>
        </Stack>
      </Box>
      <Spacer mt={12.5} />
      <Table headers={headers} data={strategies} />
      <Spacer mb={18} />
    </Grid>
  );
};

import Table, { TableData } from "@/components/Table";
import { FC } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Spacer from "@/components/Spacer";
import { TABLE_HEADERS } from "@/pages/strategies";

interface DisconnectedStrategiesTableParams {
  active: boolean;
  allStrategies: TableData[];
}

export const DisconnectedStrategiesTable: FC<
  DisconnectedStrategiesTableParams
> = ({ active, allStrategies }) => (
  <>
    {!active && (
      <Grid item xs={12}>
        <Spacer mt={12.5} />
        <Box px="20px">
          <Stack spacing={3.5}>
            <Typography variant="h3" fontFamily="BIN Regular">
              strategies
            </Typography>
            <Typography variant="h5" color="GrayText">
              Deposit and lock any of the below LP tokens and your funds will be
              allocated to the highest yield-generating platform and pool
            </Typography>
          </Stack>
        </Box>
        <Spacer mt={12.5} />
        <Table headers={TABLE_HEADERS} data={allStrategies} />
        <Spacer mt={12.5} />
      </Grid>
    )}
  </>
);

import Table, { TableData } from "@/components/Table";
import { Grid, Stack, Typography } from "@mui/material";
import Spacer from "@/components/Spacer";
import { ACTIVE_TABLE_HEADERS } from "@/pages/strategies";
import { FC } from "react";

interface ActivePositionsTableParams {
  active: boolean;
  activeStrategies: TableData[];
}

export const ActivePositionsTable: FC<ActivePositionsTableParams> = ({
  active,
  activeStrategies,
}) => (
  <Grid item xs={12} marginTop={12}>
    {active && (
      <>
        <Stack spacing={3.5}>
          <Typography variant="h3" fontFamily="BIN Regular">
            active positions
          </Typography>
          <Typography variant="h6" color="GrayText">
            Your current active positions and pool share
          </Typography>
        </Stack>
        <Spacer mt={12.5} />
        <Table headers={ACTIVE_TABLE_HEADERS} data={activeStrategies} />
      </>
    )}
  </Grid>
);

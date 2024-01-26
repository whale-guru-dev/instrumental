import { Grid, Typography } from "@mui/material";

export const SectionHeader = ({ active }: { active: boolean }) => (
  <Grid
    item
    xs={12}
    md={8}
    marginX="auto"
    display="flex"
    alignItems="center"
    flexDirection="column"
  >
    <Typography textAlign="center" variant="h2" fontFamily="BIN Regular" mb={2}>
      Instrumental Strategies
    </Typography>
    {active ? (
      <Typography textAlign="center" variant="h5" color="text.secondary">
        Earn Vault Fees and STRM rewards by providing single-sided liquidity to
        facilitate cross-layer transactions. You will be able to deposit and
        withdraw your assets on any L1 & L2 chains.
      </Typography>
    ) : (
      <Typography textAlign="center" variant="h5" color="text.secondary">
        Maximize your earnings through participating in the Instrumental
        Strategies.
      </Typography>
    )}
  </Grid>
);

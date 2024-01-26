import React from "react";

import { useConfimationModal } from "store/appsettings/hooks";
import { Box, CircularProgress, Dialog, Grid, Typography } from "@mui/material";

export const ConfirmationModal = () => {
  const { isOpen } = useConfimationModal();

  return (
    <Dialog open={isOpen}>
      <Box margin="auto" maxWidth={500} width="100%">
        <Grid container direction="column" style={{ width: "100%" }}>
          <Box>
            <CircularProgress color="inherit" size={50} />
            <Typography variant="h5" style={{ marginTop: 16 }}>
              Confirming transaction
            </Typography>
          </Box>
        </Grid>
      </Box>
    </Dialog>
  );
};

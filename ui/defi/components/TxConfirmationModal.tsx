import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Modal from "@/components/Modal";
import { useTxConfirmationModal } from "@/store/appsettings/hooks";

export const TxConfirmationModal = () => {
  const { isOpen, closeTxConfirmation } = useTxConfirmationModal();
  return (
    <Modal fullScreen open={isOpen} onClose={closeTxConfirmation}>
      <Box width="36.94rem" margin="auto">
        <Stack textAlign="center" spacing={3}>
          <Typography variant="h2" fontFamily="BIN Regular">
            depositing
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
          <Box>
            <CircularProgress color="primary" size={50} thickness={4.5} />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TxConfirmationModal;
